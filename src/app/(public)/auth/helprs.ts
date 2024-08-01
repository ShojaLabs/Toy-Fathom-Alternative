export function getGoogleOauthUrl(originalUrl: string) {
  let authUrl = new URL(originalUrl);
  let searchParams = new URLSearchParams(authUrl.search);
  const originalParams = Object.fromEntries(searchParams);
  console.log(originalParams);
  const params: any = {
    ...originalParams,
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/calendar.events.readonly",
    ].join(" "),
    prompt: "consent",
  };

  console.log(params);
  // const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.search = new URLSearchParams(params).toString();

  return authUrl.toString();
}
// https://github.com/recallai/calendar-integration-demo/blob/v2/v2-demo/logic/oauth.js
// https://github.com/recallai/calendar-integration-demo/blob/v2/v2-demo/routes/oauth-callback/google-calendar.js#L25
