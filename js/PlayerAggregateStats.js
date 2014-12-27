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


    // We've already divided games into months. Take the games for each month, and generate a set of stats for _each month_: AVG, H, HR, etc.
    this.months = {};

    this.months.total = _.chain(player.months)
        .keys()                                     //Extract months into an array
        .reduce(_.bind(function(resultObject, month){
            resultObject[month] = this.applyToEachStatForAllGames(player.months[month], this.sumUp);
            return resultObject;
        }, this), {})
        .value();

    this.months.AVG = _.chain(player.months)
        .keys()
        .reduce(_.bind(function(resultObject, month){
            resultObject[month] = Math.round(this.months.total[month].H / this.months.total[month].AB * 1000)/1000;
            return resultObject;
        }, this), {})
        .value();


    /**
     * Returns a function that can calculate a moving average for a data series
     * @param period
     * @returns {Function}
     */
    function generateMovingAverageFunction(period) {
        var nums = [];
        return function(num) {
            //debugger;
            nums.push(num);
            if (nums.length > period)
                nums.splice(0,1);  // remove the first element of the array
            var sum = 0;
            for (var i in nums)
                sum += nums[i];
            var n = period;
            if (nums.length < period)
                n = nums.length;
            return(sum/n);
        }
    }

    function generateCumulativeMovingAverageFunction(){
        var n = 0;
        var cumulativeAverage = 0;

        return function(newData){
            var x = cumulativeAverage * n;
            x = x + newData;
            x = x / (n + 1);
            cumulativeAverage = x;
            n++;
            return cumulativeAverage;
        }
    }

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

//
//    this.total = {};
//    this.total = applyToEachStatForAllGames(sumUp, games);
//
//    //It makes no sense to total up all the averages, but we can at least calculate the overall average
//    this.total.AVG = Math.round(this.total.H / this.total.AB * 1000)/1000;
//
//    this.total.games = games.length;
//
//    //We can also figure out the maximum and minimum for each stat
//    /*var statsIncludingAverage = stats.concat("AVG");  //Include the average
//
//     this.maximum = applyToEachStatForAllGames(_.max, games, statsIncludingAverage);        //include average here, because maximum average might be interesting to know.
//     this.minimum = applyToEachStatForAllGames(_.min, games, statsIncludingAverage);*/
//
//    //this.movingAverage = {};      //the moving average for each stat, indexed by game
//    /*this.movingAverage = _.reduce(games, function(obj, game, index){
//     if(!isNaN(game.AVG)){
//     if(index == 0){
//     obj[index] = game.AVG;
//     //debugger;
//     } else {
//     //Find the mean of the previous games
//     var sum = 0, mean;
//     for(var x = 0; x < index; x++){
//     if(obj[x]){
//     sum += obj[x];
//     }
//     }
//
//     sum += game.AVG;
//     mean = sum / index;
//     obj[index] = mean;
//
//     //obj[index] =
//     }
//     }
//
//     return obj;
//     }, {});*/
//
//
//    var movingAverageCalculator = generateMovingAverageFunction(9);
//    var cumulativeAverageCalculator = generateCumulativeMovingAverageFunction();
//
//    var wait = false;
//
//    _.each(games, function(game, index){
//
//        if(!isNaN(game.AVG)){
//            game.movingAverage = movingAverageCalculator(game.AVG);
//            game.cumulativeAverage = cumulativeAverageCalculator(game.AVG);
//        } else {
//            //game.movingAverage = game.AVG;
//            //game.cumulativeAverage = game.AVG;
//            /*if(index > 0) {
//             game.cumulativeAverage = cumulativeAverageCalculator(games[index - 1].cumulativeAverage)
//
//             } else {    //peek ahead
//             wait = true;
//             }*/
//            /*if(games[index - 1]){
//             game.movingAverage = games[index-1].movingAverage;
//             }*/
//            //game.movingAverage = games[index - 1].movingAverage || 0;
//        }
//
//    });
//
//
//    //var statsIncludingAverages = stats.concat(["AVG", "cumulativeAverage", "movingAverage"]);  //Include the average
//
//    //this.maximum = applyToEachStatForAllGames(_.max, games, statsIncludingAverages);        //include average here, because maximum average might be interesting to know.
//    //this.minimum = applyToEachStatForAllGames(_.min, games, statsIncludingAverages);

    console.log(this);
}