import React, { memo, useCallback, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import ProductCard from './ProductCard';
import { ProductSkeleton } from './ProductSkeleton';

const VirtualProductGrid = memo(({
  products = [],
  isLoading = false,
  width = 1200,
  height = 800,
  columnCount = 4,
  rowGap = 24,
  columnGap = 24
}) => {
  
  // Calculate dimensions
  const itemWidth = (width - (columnCount - 1) * columnGap) / columnCount;
  const itemHeight = itemWidth * 1.5; // Aspect ratio for product card
  const gap = rowGap;

  // Calculate grid dimensions
  const totalRows = Math.ceil(products.length / columnCount);
  const gridHeight = totalRows * (itemHeight + gap);

  // Responsive column count
  const getColumnCount = useCallback((w) => {
    if (w < 640) return 2;
    if (w < 1024) return 3;
    return columnCount;
  }, [columnCount]);

  const responsiveColumnCount = useMemo(() => {
    return getColumnCount(width);
  }, [width, getColumnCount]);

  // Item renderer
  const Item = memo(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * responsiveColumnCount + columnIndex;
    const product = products[index];

    if (!product) return null;

    return (
      <div style={style} className="p-3">
        <ProductCard product={product} index={index} />
      </div>
    );
  });

  Item.displayName = 'VirtualGridItem';

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/60 text-lg">No products found</p>
      </div>
    );
  }

  // Use standard grid for smaller datasets, virtualized for larger
  if (products.length < 50) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${responsiveColumnCount} gap-6`}
           style={{ gridTemplateColumns: `repeat(${responsiveColumnCount}, minmax(0, 1fr))` }}
      >
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    );
  }

  // Use virtualized grid for large datasets
  return (
    <Grid
      columnCount={responsiveColumnCount}
      columnWidth={itemWidth + columnGap}
      height={height}
      rowCount={totalRows}
      rowHeight={itemHeight + gap}
      width={width}
      itemData={products}
    >
      {Item}
    </Grid>
  );
});

VirtualProductGrid.displayName = 'VirtualProductGrid';

export default VirtualProductGrid;
