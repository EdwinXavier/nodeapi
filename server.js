var express = require('express')
	mongoose = require('mongoose')
	app = express()
	bodyParser = require('body-parser')
	endPoint = require('./app/model/model')
	url = 'mongodb://127.0.0.1:27017/test';

var options = { 
	server: { 
		socketOptions: { 
			keepAlive: 300000, 
			connectTimeoutMS: 30000 
		} 
	}, 
	replset: { 
		socketOptions: { 
			keepAlive: 300000, 
			connectTimeoutMS : 30000 
		} 
	} 
};


mongoose.connect(url, options);
var conn = mongoose.connection;             
 
conn.on('error', console.error.bind(console, 'Connection error:'));  
 
conn.once('open', function() {
  // Wait for the database connection to establish, then start the app. 
	console.log('db connected');                        
});


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;

var router = express.Router();

// calls everytime a request is sent
router.use(function(req, res, next) {
    console.log('Process is going on');
    next();
});

router.get('/', function(req, res) {
	res.json([
		{
			'message': 'HELLO SIR',
			'statusCode': 200
		}
	]);
});

router.route('/data')

	/* 
 	 * save name to the database
 	 */
	.post(function(req, res) {
		var data = new endPoint();
		data.name = req.body.name

		data.save(function(err) {
			if(err) 
			res.json({
				"message": 'Data not created!',
				"statusCode": 301
			});
				
			res.json({
				"message": 'Data created!',
				"statusCode": 200
			});
		})
	})

	/* 
 	 * retrieve all the names from the database
 	 */
	.get(function(req, res) {
		endPoint.find(function(err, list) {
			if(err)
			res.json({
				"message": 'Data cannot be fetched!',
				"statusCode": 301
			});

			if(list.lenght === 0) {
				res.json({
					"message": 'No data available!',
					"statusCode": 200
				});
			} else {
				res.json(list, {
					"statusCode": 200
				});
			}		
		})	
	})

router.route('/data/:data_id')
	
	/* 
 	 * get a name from the database by passing the id
 	 */
	.get(function(req, res) {
		endPoint.findById(req.params.data_id, function(err, data) {
			if(err)
			res.json({
				"message": 'No data is associated with this Id',
				"statusCode": 404
			});
	
			res.json(data);
		})
	})

	/* 
 	 * edit a name in the database by passing its id
 	 */
	.put(function(req, res) {
		endPoint.findById(req.params.data_id, function(err, newData) {
			if(err)
			res.json({
				"message": 'Error occured!',
				"statusCode": 404
			});
		
			newData.name = req.body.name;

			newData.save(function(err) {
				if(err)
				res.json({
					"message": 'Try again later!',
					"statusCode": 301
				});

				res.json({
					"message": 'Data updated successfully!',
					"statusCode": 200
				});			
			})		
		})	
	})
	
	/* 
 	 * delete a name in the database by passing its id
 	 */
	.delete(function(req, res) {
		endPoint.remove({_id: req.params.data_id}, function(err, data) {
			if(err)
			res.json({
				"message": 'Error occured!',
				"statusCode": 301
			});
		
			res.json({
				"message": 'Data deleted successfully!',
				"statusCode": 200
			});		
		})	
	})

app.use('/api', router);

app.listen(port);

console.log('Your api is ready in port' +  port);
