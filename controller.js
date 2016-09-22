var api = require('./api.js');
var db = require('./db.js');

module.exports = 	{
	apicall : function () {
		console.log(api.test());
	},

	getSummonerName : function(summonername,cb) {
		return api.riot('/api/lol/euw/v1.4/summoner/by-name/',summonername,cb);
	},

	dbtest : function(cb) {
		return db.test(cb);
	},

	testinsert : function(data,cb) {
		return db.insertData('test',data,cb);
	},

	login : function (data,cb) {
		db.getData('users',{name:data.name,pw:data.pw},function(dbdata){
			cb(dbdata[0].name == data.name && dbdata[0].pw == data.pw);
		});
	}
};