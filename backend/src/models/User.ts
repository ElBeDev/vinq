import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

// Extender el tipo User de Prisma con métodos de utilidad
export type UserWithMethods = User & {
  comparePassword(candidatePassword: string): Promise<boolean>;
};

// Función para hashear password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Función para comparar passwords
export async function comparePassword(
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  } catch (error) {
    return false;
  }
}

// Re-exportar el tipo User de Prisma
export type { User } from '@prisma/client';
