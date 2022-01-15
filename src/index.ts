import express = require( "express" );
const app = express();
const port =  8080;

app.get ( "/", ( req, res ) => {
   res.send( "Hello World!" );
});

app.listen( port, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost: ${ port }`);
});