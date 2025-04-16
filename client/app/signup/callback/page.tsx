"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useMutation } from "@apollo/client";
import { SIGNUP_WITH_GITHUB } from "@/graphql/mutations";
import { toast } from "react-toastify";

export default function GitHubSignupCallback() {
  const params = useSearchParams();
  const router = useRouter();
  const [signupWithGitHub] = useMutation(SIGNUP_WITH_GITHUB);

  useEffect(() => {
    const code = params.get("code");
    if (!code) return;

    const fetchGitHubUser = async () => {
      try {
        const res = await fetch(`/api/auth/signup?code=${code}`);
        const data = await res.json();

        if (!data.email || !data.name) {
          throw new Error("GitHub did not return valid user info.");
        }

        const result = await signupWithGitHub({
          variables: {
            email: data.email,
            name: data.name,
          },
        });

        Cookies.set("token", result.data.githubSignup.token, {
          secure: true,
          sameSite: "strict",
          path: "/",
          expires: 7,
        });

        router.push("/home");
      } catch (error: any) {
        const msg = error?.message || "GitHub Signup failed. Please try again.";

        console.error("GitHub Signup Error:", msg);
        toast.error(msg);

        if (msg.includes("already exists")) {
          // Redirect to signin after toast
          setTimeout(() => router.push("/signin"), 3000);
        }
      }
    };

    fetchGitHubUser();
  }, [params]);

  return (
    <p className="text-center mt-20 text-white">Signing you up via GitHub...</p>
  );
}
