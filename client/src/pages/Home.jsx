import React, { useMemo } from 'react';
import { luxe } from '@/api/luxeClient';
import { useQuery } from '@tanstack/react-query';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoryShowcase from '../components/CategoryShowcase';
import LuxuryBanner from '../components/LuxuryBanner';
import NewsletterSection from '../components/NewsletterSection';
import TestimonialsSection from '../components/TestimonialsSection';

export default function Home() {
  // Fetch all featured products
  const { data: allFeatured = [] } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => luxe.entities.Product.filter({ featured: true }, '-created_date', 100)
  });

  // Fetch all new arrivals
  const { data: allNewArrivals = [] } = useQuery({
    queryKey: ['newArrivals'],
    queryFn: () => luxe.entities.Product.filter({ new_arrival: true }, '-created_date', 100)
  });

  // Organize featured products: 3 boys, 3 girls, 2 shoes
  const organizedFeatured = useMemo(() => {
    const boys = allFeatured.filter(p => p.gender === 'Boys').slice(0, 3);
    const girls = allFeatured.filter(p => p.gender === 'Girls').slice(0, 3);
    return [...boys, ...girls];
  }, [allFeatured]);

  // Organize new arrivals: 3 boys, 3 girls, 2 shoes
  const organizedNewArrivals = useMemo(() => {
    const boys = allNewArrivals.filter(p => p.gender === 'Boys').slice(0, 3);
    const girls = allNewArrivals.filter(p => p.gender === 'Girls').slice(0, 2);
    return [...boys, ...girls];
  }, [allNewArrivals]);

  return (
    <div className="bg-black">
      <HeroSection />
      <FeaturedProducts products={organizedFeatured} title="Featured Collection" />
      <CategoryShowcase />
      <LuxuryBanner />
      <FeaturedProducts products={organizedNewArrivals} title="New Arrivals" />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}