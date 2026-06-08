import { User } from "../models/index.js";

const verifyGoogleCredential = async (credential) => {
  if (!credential) {
    throw new Error("Missing Google credential.");
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is missing on the backend.");
  }

  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
      credential,
    )}`,
  );

  if (!response.ok) {
    throw new Error("Google rejected this sign-in token.");
  }

  const profile = await response.json();

  if (profile.aud !== process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Google token was not issued for this app.");
  }

  if (profile.email_verified !== "true" && profile.email_verified !== true) {
    throw new Error("Google account email is not verified.");
  }

  return profile;
};

export const googleLogin = async (req, res, next) => {
  try {
    const profile = await verifyGoogleCredential(req.body.credential);

    const [user] = await User.upsert(
      {
        googleId: profile.sub,
        email: profile.email,
        name: profile.name || profile.email,
        picture: profile.picture || null,
      },
      { returning: true },
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    next(error);
  }
};
