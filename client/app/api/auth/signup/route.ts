import { NextRequest } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return new Response(JSON.stringify({ error: "Missing GitHub code" }), {
      status: 400,
    });
  }

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
      }),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    const profile = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const emails = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const primaryEmail = emails.data.find((e: any) => e.primary)?.email;
    const name = profile.data.name || profile.data.login;

    return new Response(JSON.stringify({ email: primaryEmail, name }));
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return new Response(JSON.stringify({ error: "GitHub Signup Failed" }), {
      status: 500,
    });
  }
}
