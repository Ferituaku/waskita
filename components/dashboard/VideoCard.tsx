import React from "react";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

interface VideoCardProps {
  thumbnailUrl: string;
  title: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ thumbnailUrl, title }) => {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer">
      <Image
        src={thumbnailUrl}
        alt={title}
        width={500}
        height={281}
        className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <PlayCircle className="w-16 h-16 text-white/80" />
      </div>
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-white font-bold text-lg">{title}</h3>
      </div>
    </div>
  );
};

export default VideoCard;
