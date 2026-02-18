import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';
import connectDB from './src/config/db.js';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CSV file
const parseCSV = (filePath) => {
  try {
    console.log('📖 Reading CSV file...');
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const products = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      const product = {};
      headers.forEach((header, index) => {
        product[header] = values[index];
      });
      products.push(product);
    }
    
    console.log(`✅ Successfully parsed ${products.length} products from CSV`);
    return products;
  } catch (error) {
    console.error('❌ Error parsing CSV:', error.message);
    throw error;
  }
};

// Transform CSV data to match our Product schema - selective loading
const transformCSVProducts = (csvProducts) => {
  const categoryMap = {
    'Apparel': 'clothing',
    'Footwear': 'footwear'
  };

  const clientPublicPath = path.join(__dirname, '../client/public');

  const transformedProducts = [];

  csvProducts.forEach((product, index) => {
    const category = categoryMap[product.Category] || product.Category.toLowerCase();
    const productId = product.ProductId;
    
    // Construct image path based on category and gender structure
    let imageRelPath;
    let absoluteImagePath;

    if (product.Category === 'Apparel') {
      if (product.Gender === 'Boys') {
        imageRelPath = `/product-image-data/Apparel/Boys/${productId}.jpg`;
      } else if (product.Gender === 'Girls') {
        imageRelPath = `/product-image-data/Apparel/Girls/Images/${productId}.jpg`;
      }
    } else if (product.Category === 'Footwear') {
      if (product.Gender === 'Men' || product.Gender === 'Boys') { // Some men products might be labeled as boys or vice versa in fashion data
        imageRelPath = `/product-image-data/Footwear/Men/Images/${productId}.jpg`;
        // Check if it exists there, if not try Women
        if (!fs.existsSync(path.join(clientPublicPath, imageRelPath))) {
          imageRelPath = `/product-image-data/Footwear/Women/Images/${productId}.jpg`;
        }
      } else {
        imageRelPath = `/product-image-data/Footwear/Women/Images/${productId}.jpg`;
        if (!fs.existsSync(path.join(clientPublicPath, imageRelPath))) {
          imageRelPath = `/product-image-data/Footwear/Men/Images/${productId}.jpg`;
        }
      }
    }

    if (!imageRelPath) return;

    absoluteImagePath = path.join(clientPublicPath, imageRelPath);

    // Only include product if the image actually exists
    if (fs.existsSync(absoluteImagePath)) {
      // Generate random pricing with variety
      const basePrice = Math.floor(Math.random() * 200) + 20;
      const originalPrice = Math.floor(basePrice * (1.2 + Math.random() * 0.6));

      transformedProducts.push({
        name: product.ProductTitle || `${product.ProductType} - ${product.Colour}`,
        description: `${product.ProductTitle} in ${product.Colour}. Perfect for ${product.Usage} wear. Product Type: ${product.ProductType}. A premium ${product.Gender.toLowerCase()} collection item.`,
        image: imageRelPath,
        images: [imageRelPath, imageRelPath],
        price: basePrice,
        original_price: originalPrice,
        category: category,
        brand: product.Gender === 'Boys' ? 'Boys Collection' : product.Gender === 'Girls' ? 'Girls Collection' : product.Gender || 'Fashion Brand',
        stock: Math.floor(Math.random() * 150) + 10,
        rating: (Math.random() * 1.5) + 3.5, // Rating between 3.5 and 5.0
        numReviews: Math.floor(Math.random() * 250) + 15,
        new_arrival: Math.random() > 0.8,
        featured: Math.random() > 0.7,
        colour: product.Colour,
        productType: product.ProductType,
        subCategory: product.SubCategory,
        usage: product.Usage,
        productId: productId,
        gender: product.Gender
      });
    }
  });

  console.log(`\n📦 Processed ${csvProducts.length} products:`);
  console.log(`   • Found images for: ${transformedProducts.length} products`);
  console.log(`   • Missing images: ${csvProducts.length - transformedProducts.length} products\n`);

  return transformedProducts;
};

const importData = async () => {
  try {
    console.log('📦 Starting product import from offline data...\n');
    
    // Read CSV file from client public folder
    const csvPath = path.join(__dirname, '../client/public/product-image-data/fashion.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at ${csvPath}`);
    }

    // Parse CSV
    const csvProducts = parseCSV(csvPath);
    
    // Transform CSV data - selective loading (250 total: 200 apparel + 50 footwear)
    const transformedProducts = transformCSVProducts(csvProducts);
    
    // Delete existing products
    await Product.deleteMany();
    console.log('🗑️  Cleared existing products');
    
    // Insert new products
    await Product.insertMany(transformedProducts);
    console.log(`✅ Successfully imported ${transformedProducts.length} products from offline data!\n`);
    
    // Summary statistics
    console.log('📊 Product Categories:');
    const categories = [...new Set(transformedProducts.map(p => p.category))];
    categories.forEach(cat => {
      const count = transformedProducts.filter(p => p.category === cat).length;
      console.log(`   • ${cat}: ${count} products`);
    });

    console.log('\n👥 Products by Gender:');
    const genders = [...new Set(transformedProducts.map(p => p.gender))];
    genders.forEach(gender => {
      const count = transformedProducts.filter(p => p.gender === gender).length;
      console.log(`   • ${gender}: ${count} products`);
    });

    console.log('\n🎨 Product Types:');
    const types = [...new Set(transformedProducts.map(p => p.productType))];
    types.slice(0, 15).forEach(type => {
      const count = transformedProducts.filter(p => p.productType === type).length;
      console.log(`   • ${type}: ${count} products`);
    });
    if (types.length > 15) {
      console.log(`   ... and ${types.length - 15} more types`);
    }

    console.log('\n🆕 Featured Products:', transformedProducts.filter(p => p.featured).length);
    console.log('⭐ New Arrivals:', transformedProducts.filter(p => p.new_arrival).length);

    console.log('\n✨ Database seeding complete!\n');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
