export const ironOptions = {
  cookieName: "siwe",
  password: process.env.IRON_PASSWORD!, // Add this to .env
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as "strict",
  },
}; 