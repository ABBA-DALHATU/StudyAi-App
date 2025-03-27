import { SignUp } from "@clerk/nextjs";

export default function page() {
  return (
    <SignUp
      afterSignUpUrl="/auth/callback"
      redirectUrl="/auth/callback"
      signInUrl="/auth/sign-in"
    />
  );
}
