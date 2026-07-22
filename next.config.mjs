/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' output hanya untuk Docker build.
  // Saat deploy ke Vercel, env DOCKER_BUILD tidak ada sehingga output = default (undefined).
  ...(process.env.DOCKER_BUILD === "true" && { output: "standalone" }),
};

export default nextConfig;
