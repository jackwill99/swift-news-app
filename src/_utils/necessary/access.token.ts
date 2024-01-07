import { BadRequestException } from "@nestjs/common";
import jwt from "jsonwebtoken";
import { errorResponse } from "./response";

export const generateToken = (data: object, expires = 30): string => {
  const jwtSecretKey = process.env["JWT_SECRET_KEY"] as jwt.Secret;
  return jwt.sign(data, jwtSecretKey, {
    expiresIn: `${expires}d`
  });
};

export const verifyToken = (token: string): null | string | jwt.JwtPayload => {
  const jwtSecretKey = process.env["JWT_SECRET_KEY"] as jwt.Secret;
  try {
    return jwt.verify(token, jwtSecretKey);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new BadRequestException(errorResponse("Token is expired", false));
    }
    return null;
  }
};
