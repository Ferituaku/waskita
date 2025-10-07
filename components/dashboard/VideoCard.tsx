import type React from "react";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

interface VideoCardProps {
  thumbnailUrl: string;
  title: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ thumbnailUrl, title }) => {
  return (
    <div
      className="
        group relative cursor-pointer overflow-hidden
        rounded-xl shadow-lg ring-1 ring-black/5
        transition-transform duration-300 hover:scale-[1.01] hover:shadow-xl
        bg-white
      "
      aria-label={title}
      role="button"
      tabIndex={0}
    >
      <Image
        src={thumbnailUrl || "/placeholder.svg"}
        alt={title}
        width={640}
        height={360}
        className="h-44 w-full object-cover sm:h-48 md:h-56 lg:h-44 xl:h-52 transition-transform duration-300 group-hover:scale-105"
      />

      <div
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-t from-slate-900/75 via-slate-900/20 to-transparent
          transition-colors duration-300 group-hover:from-slate-900/80
        "
      />

      <div
        className="
          absolute inset-0 flex items-center justify-center
          opacity-0 transition-opacity duration-300 group-hover:opacity-100
        "
      >
        <PlayCircle className="h-16 w-16 text-white/90 drop-shadow-md transition-transform duration-300 group-hover:scale-110" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-white font-semibold text-lg leading-snug drop-shadow-md">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default VideoCard;
