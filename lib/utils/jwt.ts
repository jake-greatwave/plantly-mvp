import { SignJWT, jwtVerify } from "jose";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "your-access-token-secret-key-change-this"
);

const REFRESH_TOKEN_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "your-refresh-token-secret-key-change-this"
);

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "30d";

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  userGrade: string;
  isAdmin?: boolean;
}

export async function generateAccessToken(
  payload: TokenPayload
): Promise<string> {
  return await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    userGrade: payload.userGrade,
    isAdmin: payload.isAdmin || false,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRES_IN)
    .sign(ACCESS_TOKEN_SECRET);
}

export async function generateRefreshToken(
  payload: TokenPayload
): Promise<string> {
  return await new SignJWT({
    userId: payload.userId,
    email: payload.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRES_IN)
    .sign(REFRESH_TOKEN_SECRET);
}

export async function verifyAccessToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      userGrade: payload.userGrade as string,
      isAdmin: (payload.isAdmin as boolean) || false,
    };
  } catch (error) {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch (error) {
    return null;
  }
}
