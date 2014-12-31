/**
 * Created by terrence on 12/26/14.
 */

/*
 This base object is at the bottom of my inheritance chain. I use it to define some standard behavior I want all my other objects to exhibit.
 My aim here is to develop some models that could be taken out of this Angular application and used anywhere.
 */
function Base(){}

/**
 * Copies data from some data structure to a newly created object. We don't need to know the exact structure, but simply loop over the properties we find.
 * @param {object} someData
 */
Base.prototype.mergeDataProperties = function(someData){
    _.each(someData, _.bind(function(dataValue, dataField){
        this[dataField] = dataValue;
    }, this));
};


Base.prototype.stats = ["H", "HR", "RBI", "AB"];

/**
 * Applies fn to all stats in game
 * @param {Game} game Game object, or any object with properties matching stats array
 * @param {Function} fn The function to apply
 * @param {Array=} stats The array of stats. Optional. If not provided, prototype.stats will be used.
 * @returns {Object}
 */
Base.prototype.applyToAllGameStats = function(game, fn, stats){
    if(!stats) stats = this.stats;

    return _.reduce(stats, function(resultObject, stat){
        resultObject[stat] = fn(game[stat]);
    }, {});
};


/**
 * Sums up a particular stat for a collection of games
 * @param games
 * @param stat
 * @returns {Number}
 */
Base.prototype.sumUp = function(games, stat){
    return _.reduce(games, function(total, game){
        return total += game[stat];
    }, 0);
};


/**
 * Applies a function to each stat in a set across a collection of games
 * @param {Array} games The array of games
 * @param {Function} someFunction The function to apply
 * @param {Array=} someStats an array of stats. Optional.
 * @returns {Object} An object, keys will be stats, values will be the value of the stat across all games, as calculated by the function
 */
Base.prototype.applyToEachStatForAllGames = function(games, someFunction, someStats){
    if(!someStats) someStats = this.stats;                       //if not defined, use the default set of stats


    var resultObject = {};

    _.each(someStats, function(stat){
        resultObject[stat] = someFunction(games, stat);
    });

    return resultObject;
};


/**
 * Returns a function that can calculate a moving average for a data series
 * @param period
 * @returns {Function}
 */
Base.prototype.generateMovingAverageFunction = function(period) {
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

Base.prototype.generateCumulativeMovingAverageFunction = function(){
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
};



/**
 * Applies a function to each of the stats.
 * @param {Function} someFunction Function to call
 * @param {Array} someArguments The arguments to use when the function is called
 * @param {Array} someStats
 * @returns {object} Keys are stat names, values are results of applying the function
 */
Base.prototype.applyToEachStat = function(someFunction, someArguments, someStats){
    if(!someStats) someStats = this.stats;
    if(!someArguments) someArguments = [];
    return _.reduce(someStats, _.bind(function(resultObject, stat){
        resultObject[stat] = someFunction.apply(this, someArguments.concat(stat));          //apply the passed arguments, plus the stat
        return resultObject;
    }, this), {});
}
