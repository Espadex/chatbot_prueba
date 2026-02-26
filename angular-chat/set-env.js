const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

const envConfigFile = `export const environment = {
  production: ${isProd},
  apiUrl: '${process.env.API_URL}',
  token: '${process.env.API_TOKEN}'
};
`;

const devEnvConfigFile = `export const environment = {
  production: ${isProd},
  apiUrl: '${process.env.API_URL}',
  token: '${process.env.API_TOKEN}'
};
`;

const targetPath = './src/environments';
if (!fs.existsSync(targetPath)) {
  fs.mkdirSync(targetPath, { recursive: true });
}

// Creates the environment files dynamically
fs.writeFileSync(`${targetPath}/environment.ts`, envConfigFile);
fs.writeFileSync(`${targetPath}/environment.development.ts`, devEnvConfigFile);

console.log('✅ Angular environments generated based on .env variables.');
