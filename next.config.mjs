const repoName = process.env.NEXT_PUBLIC_BASE_PATH
  ?? (process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split("/")[1] : "");

const isUserSite = repoName.endsWith(".github.io");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (repoName && !isUserSite ? `/${repoName}` : "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
