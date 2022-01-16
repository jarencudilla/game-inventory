import * as express from "express";

export const register = ( app: express.Application) => {
  const oidc = app.locals.oidc;

  // route handler to index page
  app.get( "/", ( req: any, res  ) => {
    res.render ( "index" );
  });

  // to validate before redirecting to login page before going to library page
  app.get( "/login", oidc.ensureAuthenticated() , ( req, res ) => {
    res.redirect( "/games" );
  });

  // to handle logout the redirect back to default index page
  app.get( "/logout", ( req: any, res ) => {
    req.logout();
    res.redirect( "/" );
  });

  // to handle route from games, check if user is validated
  app.get( "/games", oidc.ensureAuthenticated(), ( req: any, res ) => {
    res.render( "games" );
  });

};
