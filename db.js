var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/lol';

module.exports = {
	test: function(next) {
		MongoClient.connect('mongodb://localhost:27017/test',function(err,db) {
			let data;
			var coll = db.collection('people');
			coll.find({}).toArray(function(err,docs) {
				next(docs);
			});
		});
	},

	getDataPromise : function(collection,query) {
		return new Promise((resolve,reject)=> {
			MongoClient.connect('mongodb://localhost:27017/lol',function(err,db) {
				if(err) return reject(err);
				let coll = db.collection(collection);
				coll.find(query).toArray(function(err,docs) {
					if(err) return reject(err);
					console.log('getdb fertig');
					return resolve(docs);
				});
			});
		});
	},

	insertDataPromise:function (collection,data) {
		return new Promise((resolve,reject) => {
			MongoClient.connect('mongodb://localhost:27017/lol',function(err,db) {
				if(err) return reject(err);
				let coll = db.collection(collection);
				if(data instanceof Array) {
					coll.insertMany(data,function(err,res) {
						if(err) return reject(err);
						return resolve(res.result.ok ? 'insert ok' : 'insert not ok');
					});
				}
				else {
					coll.insertOne(data,function(err,res) {
						if(err) return reject(err);
						return resolve(res.result.ok ? 'insert ok' : 'insert not ok');
					});
				}
			});
		});
	},


	getData: function(collection,query,next){
		MongoClient.connect('mongodb://localhost:27017/lol',function(err,db) {
			if (err) console.error('An error occured while querying the database: ',err);
			else {
				var coll = db.collection(collection);
				coll.find(query).toArray(function(err,docs) {
					//db.close();
					console.log('database says: ',docs);
					if(err) console.error('An error occured while querying the database: ',err);
					else next(docs);
				});
			}
		});
	},

	insertData: function(collection,data,next){
		MongoClient.connect('mongodb://localhost:27017/lol',function(err,db) {
			if (err) console.error('An error occured while trying to insert data into the database: ',err);
			else {
				var coll = db.collection(collection);
				if(data instanceof Array) {
					coll.insertMany(data,function(err,res) {
						if(err) console.error('An error occured while trying to insert data into the database: ',err);
						else next(res.insertedCount);
					});
				}
				else {
					coll.insertOne(data,function(err,res) {
						if(err) console.error('An error occured while trying to insert data into the database: ',err);
						else next(res.insertedCount);
					});
				}
			}
			db.close();
		});
	}
}