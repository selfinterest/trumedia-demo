/**
 * Created by terrence on 12/26/14.
 */

Player.prototype = new Base();

/**
 * Represents an individual player, along with all his games.
 * @param playerData The data from which to build the player
 * @constructor
 */

function Player(playerData){

    if(this instanceof Player){
        this.mergeDataProperties(playerData);

        //Convert game data to game objects
        this.games = _.map(this.games, Game);

        //Sort the collection of games
        this.games = _.sortBy(this.games, "date");


        //And get only the games where the player had an at bat
        this.gamesAtBat = _.filter(this.games, function(game){
            return game.AB > 0;
        });

        //For games at bat, calculate average
        _.each(this.gamesAtBat, function(game){
            game.AVG = Math.round(game.H / game.AB * 1000)/1000;
            game.AVG = game.AVG.toFixed(3);

        });

        //Group games at bat into months
        this.months = _.groupBy(this.gamesAtBat, function(game){
            return game.date.getMonth();
        });



        this.href = "/"+this.id;      //this is the URL that will represent the player in our view

    } else {
        return new Player(playerData);
    }


    //Generate some aggregate stats -- things like overall average, season home runs, and the like
    this.aggregateStats = new PlayerAggregateStats(this);
}
