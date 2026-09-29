/** @type {import('next').NextConfig} */
const nextConfig = {
  // The gallery serves the exported portal from a static path, so the build has
  // no server to lean on. All data is resolved at build time.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
