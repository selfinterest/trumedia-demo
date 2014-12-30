/**
 * Created by terrence on 12/26/14.
 */

Game.prototype = new Base();

/**
 * Turns game dates into JavaScript date objects
 * @param {String} gameDate Date in string format yyyy-mm-dd
 * @throws Error if string does not match yyyy-mm-dd format.
 */

Game.prototype.parseGameDate = function(gameDate){
    var dateParts = gameDate.match(/^(\d+)-(\d+)-(\d+)$/);
    if(!dateParts) {
        throw new Error("Game date is malformed.");
    } else {
        return new Date(dateParts[1], dateParts[2] - 1, dateParts[3]);
    }
};

Game.prototype.combineTeams = function(){
    return {
        opp: this.opp,
        oppImage: this.oppImage,
        team: this.team,
        teamImage: this.teamImage
    };
};

function Game(gameData){
    if(this instanceof Game){
        this.mergeDataProperties(gameData);
        this._date = this.date;             //Backup the original property
        this.date = this.parseGameDate(this.date);
        this.teams = this.combineTeams();

    } else {
        return new Game(gameData);
    }
}
