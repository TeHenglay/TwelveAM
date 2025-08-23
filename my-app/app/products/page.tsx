import { Suspense } from 'react';
import ProductList from './components/ProductList';
import { prisma } from '@/app/lib/db';
import ProductUpdateNotification from '@/app/components/ProductUpdateNotification';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    collection?: string;
    search?: string;
  };
}

export const metadata = {
  title: 'Products - E-Commerce Store',
  description: 'Browse our collection of products',
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, collection, search } = await searchParams;
  
  // Fetch categories for the sidebar
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
  
  // Fetch collections for the sidebar
  const collections = await prisma.collection.findMany({
    where: {
      available: true,
    },
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
  
  // Pre-fetch initial products for SSR
  const whereClause: any = { isArchived: false };
  
  if (category) {
    whereClause.categoryId = category;
  }
  
  if (collection) {
    whereClause.collectionId = collection;
  }
  
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      images: {
        orderBy: {
          order: 'asc',
        },
        take: 1,
      },
      sizes: true,
      discount: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 12,
  });
  
  // Format products for the frontend
  const formattedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: parseFloat(product.price.toString()),
    image: product.images.length > 0 ? product.images[0].url : null,
    inStock: product.inStock,
    hasSizes: product.sizes.length > 0,
    minPrice: product.sizes.length > 0 
      ? Math.min(...product.sizes.map(s => parseFloat(s.price.toString())))
      : parseFloat(product.price.toString()),
    maxPrice: product.sizes.length > 0 
      ? Math.max(...product.sizes.map(s => parseFloat(s.price.toString())))
      : parseFloat(product.price.toString()),
    discount: product.discount ? {
      percentage: parseFloat(product.discount.percentage.toString()),
      enabled: product.discount.enabled,
    } : null,
  }));
  
  // Get active category and collection names for display
  const activeCategory = category 
    ? categories.find(c => c.id === category)?.name 
    : null;
  
  const activeCollection = collection 
    ? collections.find(c => c.id === collection)?.name 
    : null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product listing update notification */}
      <ProductUpdateNotification />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {activeCategory ? `${activeCategory} Products` : 
         activeCollection ? `${activeCollection} Collection` :
         search ? `Search Results for "${search}"` : 
         'All Products'}
      </h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Categories</h2>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/products"
                  className={`block text-gray-600 hover:text-gray-900 ${!category ? 'font-medium text-gray-900' : ''}`}
                >
                  All Categories
                </a>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <a 
                    href={`/products?category=${cat.id}`}
                    className={`block text-gray-600 hover:text-gray-900 ${category === cat.id ? 'font-medium text-gray-900' : ''}`}
                  >
                    {cat.name} ({cat._count.products})
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Collections */}
          {collections.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Collections</h2>
              <ul className="space-y-2">
                {collections.map(col => (
                  <li key={col.id}>
                    <a 
                      href={`/products?collection=${col.id}`}
                      className={`block text-gray-600 hover:text-gray-900 ${collection === col.id ? 'font-medium text-gray-900' : ''}`}
                    >
                      {col.name} ({col._count.products})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Product List */}
        <div className="flex-1">
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductList 
              category={category} 
              collection={collection} 
              search={search}
              initialProducts={formattedProducts}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}