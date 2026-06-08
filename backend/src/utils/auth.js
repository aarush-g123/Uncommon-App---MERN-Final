import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

const base64url = (input) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const sign = (value) =>
  crypto.createHmac("sha256", JWT_SECRET).update(value).digest("base64url");

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return `${salt}:${hash}`;
};

export const verifyPassword = (password, storedHash) => {
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;

  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash));
};

export const createToken = (user) => {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    }),
  );
  const unsignedToken = `${header}.${payload}`;

  return `${unsignedToken}.${sign(unsignedToken)}`;
};

export const verifyToken = (token) => {
  if (!token) return null;

  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;

  const unsignedToken = `${header}.${payload}`;
  const expectedSignature = sign(unsignedToken);

  if (signature !== expectedSignature) return null;

  const parsedPayload = JSON.parse(Buffer.from(payload, "base64url").toString());
  if (parsedPayload.exp && parsedPayload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return parsedPayload;
};
