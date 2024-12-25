const path = require('path');
// import path from 'path' // "type": "module" in package.json

/** @type {import('next').NextConfig} */
const nextConfig = {
   async headers() {
      return [
         {
            source: '/api/file',
            headers: [
               {
                  key: 'Access-Control-Allow-Origin',
                  value: 'true',
               },
               {
                  key: 'Access-Control-Allow-Origin',
                  value: '*',
               },
               {
                  key: 'Access-Control-Allow-Origin',
                  value: 'GET, DELETE, POST, PATCH, PUT',
               },
               {
                  key: 'Access-Control-Allow-Headers',
                  value: 'Content-Type, multipart/form-data',
               },
            ],
         },
      ];
   },

   experimental: {
      typedRoutes: true,
   },
   sassOptions: {
      // алиасы для SCSS
      includePaths: [path.join(__dirname, 'styles')],
   },

   webpack(config) {
      config.resolve.alias = {
         ...config.resolve.alias,
         '@src': path.resolve(__dirname, 'src'),
         '@public': path.resolve(__dirname, 'public'),
         '@components': path.resolve(__dirname, 'src/components'),
      };

      config.module.rules.push({
         test: /\.svg$/,
         oneOf: [
            {
               resourceQuery: /url/, // для background-image
               type: 'asset/resource',
               generator: {
                  filename: 'static/media/[name].[hash][ext]',
               },
            },
            {
               issuer: /\.(js|ts)x?$/,
               resourceQuery: { not: [/url/] }, // для импорта SVG как компонента
               use: ['@svgr/webpack'],
            },
         ],
      });

      return config;
   },
};

module.exports = nextConfig;
