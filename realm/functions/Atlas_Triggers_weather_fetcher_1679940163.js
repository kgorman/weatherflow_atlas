exports = function() {
 const request = require('request');

 let url = "https://swd.weatherflow.com/swd/rest/observations/station/72117?token=23e0cb90-8a11-4ca5-871e-133ab69c47ae";
 const collection = context.services.get('KGShardedCluster01').db('weather').collection('weather');
  
 request(url, (error, res, body) => {
    if (error) {
        return  console.log(error)
    }

    if (!error && res.statusCode == 200) {
        // do something with JSON, using the 'body' variable
        console.log(body);
        const result = collection.insertOne(JSON.parse(body));
    }
 });
};