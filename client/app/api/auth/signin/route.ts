// pages/api/auth/github.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code as string;

  if (!code) return res.status(400).send("Missing code");

  try {
    // 1. Exchange code for access token
    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // 2. Get user profile
    const profileRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const primaryEmail = emailRes.data.find((e: any) => e.primary)?.email;

    const { name } = profileRes.data;

    // 3. Redirect to frontend with user info as query
    const redirectURL = `/auth/callback?email=${primaryEmail}&name=${encodeURIComponent(
      name
    )}`;
    res.redirect(redirectURL);
  } catch (error) {
    console.error("GitHub auth error:", error);
    res.status(500).send("GitHub Authentication Failed");
  }
}
