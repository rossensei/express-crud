import dotenv from 'dotenv';
import fs from "fs";
import path from "path";

const privateKeyPath = path.join(__dirname, '../../dev_private.pem');
const PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');

const publicKeyPath = path.join(__dirname, '../../dev_public.pem');
const PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  institutionPrivateKey?: string;
  institutionPublicKey?: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  institutionPrivateKey: process.env.INSTITUTION_PRIVATE_KEY || PRIVATE_KEY,
  institutionPublicKey: process.env.INSTITUTION_PUBLIC_KEY || PUBLIC_KEY,
};

export default config;