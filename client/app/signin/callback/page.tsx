"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { SIGNIN_WITH_GITHUB } from "@/graphql/mutations";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const GitHubCallbackPage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [githubSignin] = useMutation(SIGNIN_WITH_GITHUB);

  useEffect(() => {
    const email = params.get("email");
    const name = params.get("name");

    if (!email || !name) return;

    githubSignin({
      variables: { email, name },
    })
      .then((res) => {
        Cookies.set("token", res.data.githubSignin.token, {
          secure: true,
          sameSite: "strict",
        });
        router.push("/home");
      })
      .catch((err) => {
        console.error("GitHub Signin Error:", err);

        const errorMessage =
          err?.message || "GitHub Signin failed. Please try again.";

        toast.error(errorMessage);

        // ✅ Custom redirect based on error type
        if (errorMessage.includes("No account found. Please SignUp")) {
          setTimeout(() => router.push("/signup"), 3000);
        }
      });
  }, [params]);

  return (
    <div className="text-center mt-20 text-white">
      Logging you in via GitHub...
    </div>
  );
};

export default GitHubCallbackPage;
