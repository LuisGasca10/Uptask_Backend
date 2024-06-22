import bycrypt from "bcrypt";

export async function hashPassword(password: string) {
  const salt = await bycrypt.genSalt(10);

  return await bycrypt.hash(password, salt);
}

export const checkPassword = async (
  enteredPassword: string,
  storedPassword: string
) => {
  return await bycrypt.compare(enteredPassword, storedPassword);
};
