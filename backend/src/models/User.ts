import bcrypt from 'bcryptjs';

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
