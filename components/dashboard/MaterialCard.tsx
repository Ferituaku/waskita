import React from "react";
import Image from "next/image";

interface MaterialCardProps {
  category: string;
  title: string;
  imageUrl: string;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  category,
  title,
  imageUrl,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer transform hover:-translate-y-1 transition-transform duration-300">
      <div className="relative h-48 w-full">
        <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="p-5">
        <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
          {category}
        </p>
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-hover transition-colors duration-200">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default MaterialCard;
