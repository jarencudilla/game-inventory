import * as express from "express";
import pgPromise from "pg-promise";

export const register = ( app: express.Application ) => {
    const oidc = app.locals.oidc;
    const port = parseInt( process.env.PGPORT || "5432", 10 );
    const config = {
        database: process.env.PGDATABASE || "postgres",
        host: process.env.PGHOST || "localhost",
        port,
        user: process.env.PGUSER || "postgres"
    };

    const pgp = pgPromise();
    const db = pgp( config );

    app.get( `/api/games/all`, oidc.ensureAuthenticated(), async ( req:any, res ) => {
      try {
      const userId = req.userContext.userinfo.sub;
            const games = await db.any( `
            SELECT
                    id
                    , game_name
                    , developer
                    , year
                    , game_type
                FROM    games
                WHERE   user_id = $[userId]
                ORDER BY year, game_name, game_type`, { userId } );
            return res.json( games );
          } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    });
    app.get( `/api/games/total`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
      try {
          const userId = req.userContext.userinfo.sub;
          const total = await db.one( `
          SELECT  count(*) AS total
          FROM    guitars
          WHERE   user_id = $[userId]`, { userId }, ( data: { total: number } ) => {
              return {
                  total: +data.total
              };
          } );
          return res.json( total );
      } catch ( err ) {
          // tslint:disable-next-line:no-console
          console.error(err);
          res.json( { error: err.message || err } );
      }
    });
    app.get( `/api/games/find/:search`, oidc.ensureAuthenticated(), async ( req:any, res ) => {
      try {
      const userId = req.userContext.userinfo.sub;
            const games = await db.any( `
            SELECT
                    id
                    , game_name
                    , developer
                    , year
                    , game_type
                FROM    games
                WHERE   user_id = $[userId]
                AND   ( game_type ILIKE $[search] OR game_name ILIKE $[search] )`,
                { userId, search: `%${ req.params.search }%` } );
            return res.json( games );
          } catch ( err ) {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json( { error: err.message || err } );
        }
    });
    app.post( `/api/games/add`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
      try {
          const userId = req.userContext.userinfo.sub;
          const id = await db.one( `
              INSERT INTO games( user_id, game_name, developer, year, game_type )
              VALUES( $[userId], $[game_name], $[developer], $[year], $[game_type] )
              RETURNING id;`,
              { userId, ...req.body  } );
          return res.json( { id } );
      } catch ( err ) {
          // tslint:disable-next-line:no-console
          console.error(err);
          res.json( { error: err.message || err } );
      }
    });
    app.post( `/api/games/update`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
      try {
          const userId = req.userContext.userinfo.sub;
          const id = await db.one( `
              UPDATE games
              SET brand = $[game_name]
                  , model = $[developer]
                  , year = $[year]
                  , color = $[game_type]
              WHERE
                  id = $[id]
                  AND user_id = $[userId]
              RETURNING
                  id;`,
              { userId, ...req.body  } );
          return res.json( { id } );
      } catch ( err ) {
          // tslint:disable-next-line:no-console
          console.error(err);
          res.json( { error: err.message || err } );
      }
    });
    app.delete( `/api/games/remove/:id`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
      try {
          const userId = req.userContext.userinfo.sub;
          const id = await db.result( `
              DELETE
              FROM    games
              WHERE   user_id = $[userId]
              AND     id = $[id]`,
              { userId, id: req.params.id  }, ( r ) => r.rowCount );
          return res.json( { id } );
      } catch ( err ) {
          // tslint:disable-next-line:no-console
          console.error(err);
          res.json( { error: err.message || err } );
      }
    });
    };
