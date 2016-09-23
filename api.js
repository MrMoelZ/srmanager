var request = require('request');

var api_key = '8709ed7c-b63a-41f8-a4ee-b62e0ef0f9d8';

module.exports = {
	riot : function(command,next) {
		request('https://euw.api.pvp.net'+command+'?api_key='+api_key,function(error,response,body) {
			if(error) {
				console.error('error occured: ',error);
				next(error);
			}
			else if(response.statusCode != 200) {
				console.log('something went wrong @ apicall: ',body);
				next(body);
			}
			else {
				next(JSON.parse(body));
			}
		});
	},

	riotStatic:function (command,next){
		request('https://global.api.pvp.net/api/lol/static-data/euw'+command+'&api_key='+api_key,function(error,response,body) {
			if(error) {
					console.error('error occured: ',error);
					next(error);
				}
				else if(response.statusCode != 200) {
					console.log('something went wrong @ apicall: ',body);
					next(body);
				}
				else {
					next(JSON.parse(body));
				}
		});
	}
}