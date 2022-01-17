import dotenv from "dotenv";
import express = require( "express" );
import path from "path";
import * as sessionAuth from "./middleware/sessionAuth";
import * as routes from "./routes";

// to initialize config
dotenv.config();

const port =  process.env.SERVER_PORT;
const app = express();

// Configure Express to parse incoming JSON data
app.use( express.json() );

// Configure Express to use EJS
app.set( "views", path.join(__dirname, "views"));
app.set( "view engine", "ejs" );

// Configure Express to serve static files in the public folder
app.use( express.static( path.join( __dirname, "public" ) ) );

// Configure session auth
sessionAuth.register( app );

// Configure routes
routes.register( app );

// to handle route to index page
app.get ( "/", ( req, res ) => {
   res.render( "index" );
});

// start the express server
app.listen( port, () => {
  // tslint:disable-next-line:no-console
  console.log( `Server started at http://localhost:${ port }`);
});
