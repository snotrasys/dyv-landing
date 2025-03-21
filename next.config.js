// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  transpilePackages: ['@lifi/widget', '@lifi/wallet-management'],
};

webpack: (config) => {
  let modularizeImports = null;
  config.module.rules.some((rule) =>
    rule.oneOf?.some((oneOf) => {
      modularizeImports =
        oneOf?.use?.options?.nextConfig?.modularizeImports;
      return modularizeImports;
    }),
  );
  if (modularizeImports?.["@headlessui/react"])
    delete modularizeImports["@headlessui/react"];
  return config;
},

module.exports = nextConfig;