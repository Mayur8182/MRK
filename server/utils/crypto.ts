import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
  return salt + ':' + derivedKey.toString('hex');
}

export async function verifyPassword(storedPassword: string, suppliedPassword: string): Promise<boolean> {
  const [salt, hashedPassword] = storedPassword.split(':');
  const derivedKey = await scryptAsync(suppliedPassword, salt, 64) as Buffer;
  const storedDerivedKey = Buffer.from(hashedPassword, 'hex');
  return timingSafeEqual(derivedKey, storedDerivedKey);
}
