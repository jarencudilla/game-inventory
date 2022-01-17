import axios from "axios";
import * as M from "materialize-css";
import Vue from "vue";

// tslint:disable-next-line no-unused-expression
new Vue( {
  computed: {
      hasGames(): boolean {
          return this.isLoading === false && this.games.length > 0;
      },
      noGames(): boolean {
          return this.isLoading === false && this.games.length === 0;
      }
  },
  data: {
    game_name: "",
    developer: "",
    games: [],
    isLoading: true,
    game_type: "",
    selectedGame: "",
    selectedGameId: 0,
    year: ""
  },
  el: "#app",
    methods: {
        addGame: function {
            const game = {
                game_name: this.game_name,
                developer: this.developer,
                game_type: this.game_type,
                year: this.year
            };
            axios
                .post( "/api/games/add", game )
                .then( () => {
                    this.$refs.year.focus();
                    this.game_name = "";
                    this.developer = "";
                    this.game_type = "";
                    this.year = "";
                    this.loadGames();
                } )
                .catch( ( err: any ) => {
                    // tslint:disable-next-line:no-console
                    console.log( err );
                } );
        },
        confirmDeleteGame: function ( id: string ) {
          const game = this.games.find( ( g ) => g.id === id );
          this.selectedGame = `${ game.year } ${ game.game_name } ${ game.developer }`;
          this.selectedGameId = game.id;
          const dc = this.$refs.deleteConfirm;
          const modal = M.Modal.init( dc );
          modal.open();
      },
      deleteGame: function( id: string ) {
          axios
              .delete( `/api/games/remove/${ id }` )
              .then( this.loadGames )
              .catch( ( err: any ) => {
                  // tslint:disable-next-line:no-console
                  console.log( err );
              } );
      },
      loadGames: function() {
        axios
            .get( "/api/games/all" )
            .then( ( res: any ) => {
                this.isLoading = false;
                this.games = res.data;
            } )
            .catch( ( err: any ) => {
                // tslint:disable-next-line:no-console
                console.log( err );
            } );
      }
    },
    mounted: function() {
      return this.loadGames();
  }
} );

