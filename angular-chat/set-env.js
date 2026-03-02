const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Construir la ruta absoluta correcta hacia el archivo .env
const envPath = path.resolve(__dirname, '.env');
const envConfig = dotenv.config({ path: envPath });

if (envConfig.error) {
  console.log('⚠️ ADVERTENCIA: No se encontró el archivo .env en la ruta: ' + envPath);
  console.log('Asegúrate de que no se llame ".env.txt" por error de Windows.');
} else {
  console.log('✅ Archivo .env cargado correctamente.');
}

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
