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
 * Applies a function to each stat in a set
 * @param {Function} someFunction The function to apply
 * @param {Array} games The array of games
 * @param {Array=} someStats an array of stats. Optional.
 * @returns {Object} An object, keys will be stats, values will be the value of the stat across all games, as calculated by the function
 */
Base.prototype.applyToEachStatForAllGames = function(someFunction, games, someStats){
    if(!someStats) someStats = this.stats;                       //if not defined, use the default set of stats

    var resultObject = {};

    _.each(someStats, function(stat){
        resultObject[stat] = someFunction(games, stat);
    });

    return resultObject;
};