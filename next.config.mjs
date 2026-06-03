import fs from "node:fs";

const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split("/")[1] : "";
const hasCustomDomain = fs.existsSync("CNAME");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (hasCustomDomain ? "" : (repoName && !repoName.endsWith(".github.io") ? `/${repoName}` : ""));

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
