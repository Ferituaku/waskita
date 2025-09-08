import { Search } from "lucide-react";
// import { Input } from "postcss";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-[#EEEEEE] shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

      <div className="relative max-w-md w-72 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Jelajahi Halaman..."
          className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-full focus:ring-[#5C110E] text-black"
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-700 hidden sm:block">
          User Name
        </span>
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          <img
            src="https://i.pravatar.cc/40"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
export default Header;
