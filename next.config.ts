import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xgdmyjzyejjmwdqkufhp.supabase.co',
      },
    ],
  },
};

export default nextConfig;
