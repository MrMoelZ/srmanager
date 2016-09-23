var api = require('./api.js');
var db = require('./db.js');

module.exports = 	{
	getSummonerName : function(summonername,cb) {
		return api.riot('/api/lol/euw/v1.4/summoner/by-name/',summonername,cb);
	},

	testinsert : function(data,cb) {
		return db.insertData('test',data,cb);
	},

	login : function (data,cb) {
		db.getData('users',{name:data.name,pw:data.pw},function(dbdata){
			cb(dbdata[0].name == data.name && dbdata[0].pw == data.pw);
		});
	},

	getGamesForSummonerId :function(id) {
		return new Promise((resolve,reject) => {
			db.getDataPromise('games',{summonerId:id})
				.then(function(data) {
					if(data && data.length>0){
						resolve(data);
					}
					else {
						api.riot('/api/lol/euw/v1.3/game/by-summoner/'+id+'/recent',function(apidata) {
							helpers.cleanGameData(apidata)
								.then((data)=> {
									console.log('ingetgamesforsummonerid',data.length);
									db.insertDataPromise('games',data)
										.then((e)=>console.log(e))
										.catch(err=>reject('rejected '+err+' in '+this.name));
									resolve([data]);
								})
								.catch(err=>reject('rejected '+err+' in '+this.name));
						});
					}
				})
				.catch(err=>reject('rejected '+err+' in '+this.name));
			});
	},

	getIdForSummoner : function(summoner) {
		return new Promise((resolve,reject) => {
			db.getDataPromise('accounts',{name:summoner})
				.then(function(data) {
					if(data[0] && data[0].id) {
						resolve(data);
					}
					else {
						console.log('account does not exist, inserting...');
						api.riot('/api/lol/euw/v1.4/summoner/by-name/'+summoner,function(apidata) {
							let sname= summoner.replace(/\s/g,"");
							if(apidata[sname]) {
								db.insertDataPromise('accounts',{name:apidata[sname].name.toLowerCase(),id:apidata[sname].id})
									.then(resolve([{name:apidata[sname].name,id:apidata[sname].id}]))
									.catch(err=>reject('rejected '+err+' in '+this.name))
							}
							else
								reject('?');
						});
					}
				})
				.catch(err=>reject('rejected '+err+' in '+this.name));
		});
	},


	getIdForEachSummoner : function(list) {
		return new Promise((resolve,reject) => {
			let promises = [];
			let ret = [];
			for(let x=0;x<=list.length-1;x++) {
				promises.push(module.exports.getIdForSummoner(list[x])
					.then(data => {
						ret.push({name:data[0].name,id:data[0].id});
					})
					.catch(err=>reject('rejected '+err+' in '+this.name))
				);
			}
			Promise.all(promises).then(()=>resolve(ret));
		});
	},

	test : function() {
		return new Promise((resolve,reject) => {
			db.insertDataPromise('test',{a:1,b:'asgf'})
				.then(data=>resolve(data))
				.catch(err=>reject('rejected '+err+' in '+this.name))
		});
	}

};


var helpers = {
	test:function(data) {
		return new Promise((resolve,reject)=>{
			return resolve(data);
		});
	},
	cleanGameData:function(gamedata) {
		return new Promise((resolve,reject)=> {
			let promises = [];
			let data={};
			//images
			for(let x=0;x<gamedata.games.length;x++) {
				let game = gamedata.games[x];
				game.summonerId = gamedata.summonerId;
				promises.push(new Promise((resolve,reject) => {
					api.riotStatic('/v1.2/champion/'+game.championId+'?champData=image',function(data){
						game.champImage = data.image.full;
						game.champName = data.name;

						return resolve(game);
					})
				}));
			}
			Promise.all(promises).then((data)=>{resolve(data);});
		});
	}
}