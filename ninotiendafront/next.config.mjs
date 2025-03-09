/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    webpackDevMiddleware: (config) => {
      config.watchOptions = {
        poll: 1000, // Verifica cambios cada 1000ms (1s)
        aggregateTimeout: 300, // Espera 300ms antes de aplicar cambios
      };
      return config;
    },
  };
  
  export default nextConfig;