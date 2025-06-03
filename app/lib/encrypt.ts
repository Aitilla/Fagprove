import bcrypt from "bcrypt";

export async function encrypt(password: string) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

export async function verify(password: string, storedPassword: string) {
  const passwordMatched: boolean = await bcrypt.compare(password, storedPassword);
  return passwordMatched
}
