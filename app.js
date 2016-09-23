var exphbs = require('express-handlebars');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app=express();
var controller = require('./controller.js');

var model={};

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended:false});

app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

app.use(cookieParser());
app.use('/materialize',express.static(__dirname+'/node_modules/materialize-css/bin'));

app.get('/1',function(req,res) {
	let counter=0;
	res.cookie('counter',++counter);
	if(req.cookies.counter)console.log('counter:',req.cookies.counter);
	model = data;
	model.title = 'Summonersrift-Manager';
	let name = 'mrholz';
	controller.getSummonerName(name,function(data) {
		console.log('appdata ',data);
		model = JSON.parse(data)[name];
		res.render('home',model);
	});
});


app.get('/',function(req,res) {
	let listOfSummoners = ['mrholz','djanysus','hubert huhn','linler'];
	let promises = [];
	promises.push(controller.getIdForEachSummoner(listOfSummoners)
		.then(function(data) {
			model.accs=data;
		})
		.catch(err=>{
			console.log('ERROR',err);
		})
	);
	promises.push(controller.getGamesForSummonerId(19716793)
		.then(function(data) {
			model.games=data;
		})
		.catch(err=>{
					console.log('ERROR',err);
		})
	);
	Promise.all(promises)
		.then(()=> { res.render('home',model)})
		.catch(()=>console.log('error'));

});

//Authentication
app.get('/login',function(req,res) {
	model.title='Login';
	res.render('auth/login',model);
});

app.post('/login',urlencodedParser,function(req,res) {
	console.log('user ',req.body.name+' tried to login');
	controller.login(req.body,function(success) {
		if(success) {
			console.log('login successful');
			//login successful
		}
		else {
			console.log('login failed');
			//login failed
		}
		res.redirect('/');
	});
});

app.get('/register',function(req,res) {
	model.title='Register';
	res.render('auth/register',model);
});

app.post('/register',urlencodedParser,function(req,res) {
	console.log('register post');
	res.redirect('/');
});
//

app.listen(12345,function() {
	console.log('listening on :12345');
});

var data = {persons:[{
		id:2,
		name:'holz',
		isCool:false
	},
	{
		id:99,
		name:'golz',
		isCool:true
	}
	]};
