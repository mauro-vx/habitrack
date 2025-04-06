import type { NextConfig } from "next";

const NEXT_PUBLIC_SUPABASE_HOSTNAME = process.env.NEXT_PUBLIC_SUPABASE_HOSTNAME || "supabase.co";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: NEXT_PUBLIC_SUPABASE_HOSTNAME,
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
      },
    ],
  },
};

export default nextConfig;
