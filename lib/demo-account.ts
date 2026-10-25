export const DEMO_PROFILE_USERNAME = "portfolio.demo";

export function isDemoSignInConfigured() {
  return Boolean(
    process.env.DEMO_USER_ID &&
    process.env.DEMO_USER_EMAIL &&
    process.env.DEMO_USER_PASSWORD &&
    process.env.DEMO_USER_PASSWORD.length >= 16,
  );
}
