import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET() {
  try {
    const newArrivals = await prisma.product.findMany({
      where: {
        isArchived: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: {
          take: 1,
          orderBy: {
            order: 'asc',
          },
          select: {
            url: true,
          },
        },
        sizes: {
          select: {
            price: true,
          },
        },
        inStock: true,
        discount: {
          select: {
            percentage: true,
            enabled: true,
          },
        },
      },
    });

    const formattedProducts = newArrivals.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price.toString()),
      image: product.images[0]?.url || null,
      inStock: product.inStock,
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

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch new arrivals' },
      { status: 500 }
    );
  }
}