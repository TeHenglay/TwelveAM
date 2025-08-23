import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to E-Shop</h1>
      <p className="mb-6 text-gray-600">Discover featured products and best deals!</p>
      <div className="flex gap-4">
        <Link href="/products" className="px-4 py-2 bg-blue-600 text-white rounded">Shop Now</Link>
        <Link href="/cart" className="px-4 py-2 bg-gray-200 rounded">View Cart</Link>
      </div>
    </section>
  );
}
