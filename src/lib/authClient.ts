import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});
export const signInWithGoogle = async () => {
  const { data, error } = await authClient.signIn.social({
    provider: "google",
  });
  return {
    data,
    error,
  };
};
export const signInWithGIthub = async () => {
  const { data, error } = await authClient.signIn.social({
    provider: "github",
  });
  return {
    data,
    error,
  };
};
