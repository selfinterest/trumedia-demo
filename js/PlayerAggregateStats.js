/**
 * Created by terrence on 12/26/14.
 */


PlayerAggregateStats.prototype = new Base();


/**
 * Generates some stats based on all the games a player has been in
 * @param {Player} player A Player object
 * @constructor
 */
function PlayerAggregateStats(player){

    //I'm really only interested in games in which this player had an at bat, so...
    this.total = this.applyToEachStatForAllGames(player.gamesAtBat, this.sumUp);

    this.AVG = Math.round(this.total.H / this.total.AB * 1000)/1000;    //Overall average
    this.AVG = this.AVG.toFixed(3);

    // We've already divided games into months. Take the games for each month, and generate a set of stats for _each month_: AVG, H, HR, etc.
    this.months = {};

    this.months = _.chain(player.months)
        .keys()                                     //Extract months into an array
        .reduce(_.bind(function(resultObject, month){
            resultObject[month] = this.applyToEachStatForAllGames(player.months[month], this.sumUp);
            resultObject[month].AVG = Math.round(resultObject[month].H / resultObject[month].AB * 1000)/1000;
            resultObject[month].AVG = resultObject[month].AVG.toFixed(3);
            return resultObject;
        }, this), {})
        .value();



    /**
     * Applies a function to each of the stats.
     * @param {Function} someFunction Function to call
     * @param {Array} someArguments The arguments to use when the function is called
     * @param {Array} someStats
     * @returns {object} Keys are stat names, values are results of applying the function
     */
    function applyToEachStat(someFunction, someArguments, someStats){
        if(!someStats) someStats = stats;
        return _.reduce(someStats, function(resultObject, stat){
            resultObject[stat] = someFunction.apply(null, someArguments.concat(stat));          //apply the passed arguments, plus the stat
            return resultObject;
        }, {});

    }

}