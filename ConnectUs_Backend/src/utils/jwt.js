import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  if (!id) {
    throw new Error("ID is required to generate a token");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};