import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the Turbopack workspace root so multiple lockfiles up the tree
  // don't trigger the inferred-root warning during builds.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
