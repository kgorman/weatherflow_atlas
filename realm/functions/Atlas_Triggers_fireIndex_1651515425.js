/*

Red Flag fire warning per https://www.weather.gov/gjt/firewxcriteria

*/

exports = function(changeEvent) {

    const fullDocument = changeEvent.fullDocument;
    const collection = context.services.get("KGShardedCluster01").db("demo").collection("weatherlog");

    /*

     Query for stage A.1:
     Relative humidity of 15% or less combined with sustained surface winds, 
     or frequent gusts, of 25 mph or greater. Both conditions must occur simultaneously 
     for at least 3 hours in a 12 hour period.

    */

    /* insert into collection */
    var newDocument = fullDocument;
    newDocument.observations = newDocument.obs[0];
    delete newDocument.obs;
    delete newDocument.outdoor_keys;
    collection.insertOne(newDocument);

    /* aggregate using detail collection, write summary collection */    

    var last12Hour = new Date();
    last12Hour.setHours(last12Hour.getHours()-12);

    const pipeline = [
        {
            "$match": {
                "createdAt":{ $gt: last12Hour },
                "observations.relative_humidity": { $lte: 99 },  
                "observations.wind_gust": { $gte: 0 }     
            }
        },
        {
            "$project": {
               date: {
                  $dateToParts: { date: "$createdAt" }
               },
               "observations": 1,
               "station_id": 1
            }
         },
         {
            "$group": {
               _id: {
                  date: {
                     year: "$date.year",
                     month: "$date.month",
                     day: "$date.day",
                     hour: "$date.hour"
                  },
                  station_id: "$station_id"
               },
               avgHumidity: { $avg: "$observations.relative_humidity" },
               count: {"$sum": 1}
            }
         }, 
         {
            "$match": { "count": {"$gt": 3}}
         },
         {
            "$merge": { into: "hourlyhumidityaverages", whenMatched: "replace" }
         }
    ];
    
    return collection.aggregate(pipeline).toArray()
        .then(firedanger => {
            console.log(`Successfully grouped: ${firedanger }`);
            return firedanger;
        })
        .catch(err => console.error(`Failed to group data: ${err}`));

};