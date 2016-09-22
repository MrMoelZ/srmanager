var request = require('request');

var api_key = '8709ed7c-b63a-41f8-a4ee-b62e0ef0f9d8';

module.exports.riot = function(command,data,next) {

	request('https://euw.api.pvp.net'+command+data+'?api_key='+api_key,function(error,response,body) {
			if(error) {
				console.error('error occured: ',error);
				next(error);
			}
			else if(response.statusCode != 200) {
				console.log('something went wrong @ apicall: ',body);
				next(body);
			}
			else {
				console.log(response.statusCode);
				next(body);
			}
	});
}



module.exports.test = function test() {
	return 'test erfolgreich!';
};