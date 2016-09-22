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

	getData: function(collection,query,next){
		MongoClient.connect('mongodb://localhost:27017/lol',function(err,db) {
			if (err) console.error('An error occured while querying the database: ',err);
			else {
				var coll = db.collection(collection);
				coll.find(query).toArray(function(err,docs) {
					console.log('database says: ',docs);
					if(err) console.error('An error occured while querying the database: ',err);
					else next(docs);
				});
			}
			db.close();
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
						else next(res);
					});
				}
				else {
					coll.insertOne(data,function(err,res) {
						if(err) console.error('An error occured while trying to insert data into the database: ',err);
						else next(res);
					});
				}
			}
			db.close();
		});
	}

}



