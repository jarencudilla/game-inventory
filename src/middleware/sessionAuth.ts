import { ExpressOIDC } from "@okta/oidc-middleware";
import session from "express-session";

export const register = ( app: any ) => {

  // OIDC client
  const oidc = new ExpressOIDC( {
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret:  process.env.OKTA_CLIENT_SECRET,
    issuer: `${ process.env.OKTA_ORG_URL}/oauth2/default`,
    redirect_uri: `${ process.env.HOST_URL }/authorization-code/callback`,
    appBaseUrl:`${ process.env.HOST_URL }`,
    scope: "openid profile"
  });

  // Express config for session auth
  app.use( session( {
    resave: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
  }));

  // Express config for OIDC client
  app.use( oidc.router );

  // adding OIDC client to app.local
  app.locals.oidc = oidc;
};