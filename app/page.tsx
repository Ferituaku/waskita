import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex min-h-screen bg-amber-50 flex-col items-center justify-center p-24">
      <div className="text-center">
        <div className="text-center">
          <Image
            src="/logo-waskitabystophiva.png"
            alt="Waskita Logo"
            width={440} // Sesuaikan lebar logo
            height={50} // Sesuaikan tinggi logo
            priority
          />
        </div>
        <p className="mt-4 text-lg text-red-700">
          Selamat datang di Wadah Sadar Kesehatan Tembalang.
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
