const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const envConfigFile = `export const environment = {
  production: process.env.NODE_ENV === 'production',
  apiUrl: '${process.env.API_URL}',
  token: '${process.env.API_TOKEN}'
};
`;

const devEnvConfigFile = `export const environment = {
  production: process.env.NODE_ENV === 'production',
  apiUrl: '${process.env.API_URL}',
  token: '${process.env.API_TOKEN}'
};
`;

// Creates the environment files dynamically
fs.writeFileSync('./src/environments/environment.ts', envConfigFile);
fs.writeFileSync('./src/environments/environment.development.ts', devEnvConfigFile);

console.log('✅ Angular environments generated based on .env variables.');
