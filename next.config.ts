import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Ensure Prisma query-engine binaries are included in serverless traces (Vercel).
  outputFileTracingIncludes: {
    "/api/**/*": [
      "./node_modules/.prisma/client/**/*",
      "./node_modules/@prisma/client/**/*",
    ],
    "/*": [
      "./node_modules/.prisma/client/**/*",
      "./node_modules/@prisma/client/**/*",
    ],
  },
  async redirects() {
    return [{ source: "/shop", destination: "/catalog", permanent: true }];
  },
};

export default nextConfig;
