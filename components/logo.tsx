import React from "react";
import Image from "next/image";

export const Logo = () => (
  <div className="flex justify-center mb-8">
    <Image
      src="/logo-waskitabystophiva.png"
      alt="Waskita Logo"
      width={300}
      height={50}
      priority
    />
  </div>
);

export default Logo;
