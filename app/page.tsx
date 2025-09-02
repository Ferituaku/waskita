import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-600">WASKITA</h1>
        <p className="mt-4 text-lg text-gray-700">
          Selamat datang di Wadah Sadar Kesehatan Kita.
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 hover:bg-red-700"
          >
            Masuk
          </Link>
        </div>
      </div>
    </main>
  );
}
