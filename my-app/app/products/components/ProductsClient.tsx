'use client';

import React, { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Filter } from 'lucide-react';
import FilterSidebar from './FilterSidebar';
import Pagination from './Pagination';
import ProductHeader from './ProductHeader';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  inStock: boolean;
  minPrice: number;
  maxPrice: number;
  discount?: {
    percentage: number;
    enabled: boolean;
  } | null;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Array<{
    id: string;
    name: string;
    _count: { products: number };
  }>;
  collections: Array<{
    id: string;
    name: string;
    _count: { products: number };
  }>;
  totalPages: number;
  currentPage: number;
}

export default function ProductsClient({
  initialProducts,
  categories,
  collections,
  totalPages,
  currentPage: initialPage,
}: ProductsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const selectedCategory = searchParams.get('category') || undefined;
  const selectedCollection = searchParams.get('collection') || undefined;
  const currentSort = searchParams.get('sort') || 'newest';

  const updateSearchParams = useCallback((updates: Record<string, string | undefined>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });
    
    router.push(`${pathname}?${newSearchParams.toString()}`);
  }, [pathname, router, searchParams]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams({ sort: e.target.value, page: '1' });
  };

  const handleCategoryChange = (categoryId: string) => {
    updateSearchParams({
      category: categoryId === selectedCategory ? undefined : categoryId,
      page: '1'
    });
  };

  const handleCollectionChange = (collectionId: string) => {
    updateSearchParams({
      collection: collectionId === selectedCollection ? undefined : collectionId,
      page: '1'
    });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
    setCurrentPage(page);
  };

  const handleResetFilters = () => {
    updateSearchParams({
      category: undefined,
      collection: undefined,
      page: '1'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader
        totalProducts={products.length}
        currentSort={currentSort}
        onSortChange={value => updateSearchParams({ sort: value, page: '1' })}
        onMobileFilterOpen={() => setMobileFilterOpen(true)}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters */}
          <FilterSidebar
            categories={categories}
            collections={collections}
            selectedCategory={selectedCategory}
            selectedCollection={selectedCollection}
            onCategoryChange={handleCategoryChange}
            onCollectionChange={handleCollectionChange}
            onReset={handleResetFilters}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setMobileFilterOpen(false)}
          />

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link 
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm 
                           hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={product.image || '/images/product-placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {product.discount?.enabled && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 
                                    rounded-md text-sm font-medium">
                        {product.discount.percentage}% OFF
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center 
                                    justify-center text-white text-lg font-medium">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium line-clamp-1">{product.name}</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      {product.discount?.enabled ? (
                        <>
                          <span className="text-xl font-bold">
                            ${(product.minPrice * (1 - product.discount.percentage / 100)).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${product.minPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold">
                          {product.minPrice === product.maxPrice
                            ? `$${product.minPrice.toFixed(2)}`
                            : `$${product.minPrice.toFixed(2)} - $${product.maxPrice.toFixed(2)}`}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
