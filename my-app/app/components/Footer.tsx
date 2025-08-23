export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50 py-4 mt-8">
      <div className="container mx-auto text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
      </div>
    </footer>
  );
}
