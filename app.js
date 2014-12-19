/**
 * Created by: Terrence C. Watson
 * Date: 12/19/14
 * Time: 6:50 PM
 */
angular.module("TruMediaApp", ["ui.router"])
	.constant("dataFiles", [
		"data/452655.json",
		"data/457706.json",
		"data/502082.json"
	])
	.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "dataFiles", function($stateProvider, $urlRouterProvider, $locationProvider, dataFiles){

		/**
		 * Extracts the player id from the filename.
		 * @param {String} filename
		 */
		function extractPlayerIdFromFilename(filename){
			var filenameMatch = filename.match(/\/(\d+)\.json$/);
			if(filenameMatch) {
				return filenameMatch[1];
			} else {  //Not the kind of filename we were looking for. Throw an error
				throw new Error("Filename must be in format like: data/#####.json");
			}
		}

		$locationProvider.hashPrefix("");

		//When empty state, redirect to first player
		$urlRouterProvider.when('', '/players/'+extractPlayerIdFromFilename(dataFiles[0]));

		//When no player specified, redirect to first player
		$urlRouterProvider.when('/players', '/players/'+extractPlayerIdFromFilename(dataFiles[0]));

		$stateProvider
			.state('players', {
				abstract: true,
				url: '/players',
				templateUrl: "base.html"
				//template: '<div><h1>HELLO!</h1><div ui-view></div></div>'
			})
			.state('players.player', {
				url: "/:playerId",
				template: "<h2>I am a specific player!</h2>"
			});



	}])
;