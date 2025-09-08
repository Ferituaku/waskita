import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2 mt-8 text-black">
      <button className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button className="px-4 py-2 rounded-md text-sm font-medium bg-[#5C110E] text-white">
        1
      </button>
      <button className="px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
        2
      </button>
      <button className="px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
        3
      </button>
      <span className="px-4 py-2 text-sm">...</span>
      <button className="px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
        10
      </button>
      <button className="p-2 rounded-md hover:bg-gray-200">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
