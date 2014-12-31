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
        .reduce(_.bind(
            function(resultObject, month){
                resultObject[month] = this.applyToEachStatForAllGames(player.months[month], this.sumUp);
                resultObject[month].AVG = Math.round(resultObject[month].H / resultObject[month].AB * 1000)/1000;
                resultObject[month].AVG = resultObject[month].AVG.toFixed(3);
                //I'd also like some specific performance data on a per team basis for each month
                //TODO: Combine THIS logic with the per month logic into one super duper functional transformation
                var teams = _.groupBy(player.months[month], "opp");
                resultObject[month].byTeam = _.chain(teams)
                    .keys()
                    .reduce(_.bind(function(r, team){
                        r[team] = this.applyToEachStatForAllGames(teams[team], this.sumUp);
                        r[team].AVG = Math.round(r[team].H / r[team].AB * 1000)/1000;
                        r[team].AVG = r[team].AVG.toFixed(3);
                        return r;
                    }, this), {}).value();
                //resultObject[month].performanceByTeam =
                //console.log();

        return resultObject;
        }, this), {})
        .value();


    //this.monthlyCumulativeAverageFunctions = {};




}