exports = function(changeEvent) {

    const fullDocument = changeEvent.fullDocument;
    const collection = context.services.get("KGShardedCluster01").db("demo").collection("strikes");
    strikeFound = 0;

    if (fullDocument && fullDocument.obs[0].lightning_strike_count_last_1hr < 100 && fullDocument.obs[0].lightning_strike_last_distance < 50 ) {
        const strikeDocument = {
            'lightning_strike_last_epoch' : fullDocument.obs[0].lightning_strike_last_epoch,
            'lightning_strike_last_distance' : fullDocument.obs[0].lightning_strike_last_distance,
            'lightning_strike_count' : fullDocument.obs[0].lightning_strike_count,
            'lightning_strike_count_last_1hr' : fullDocument.obs[0].lightning_strike_count_last_1hr,
            'lightning_strike_count_last_3hr' : fullDocument.obs[0].lightning_strike_count_last_3hr
        };

        /* send an alert, be sure to add twilio to dependencies */
        const accountSid = 'xxxx'; 
        const authToken = 'xxx'; 
        const client = require('twilio')(accountSid, authToken); 
 
        client.messages 
            .create({ 
                body: 'lightning strike detected near you!',
                messagingServiceSid: 'xxxx',      
                to: 'xxxxx' 
            }) 
            .then(message => console.log('message sent')) 
            .done();

        /* upsert a collection */
        const pk = fullDocument.station_id;
        const query = { station_id : pk };
        const update = { station_id: pk, strike: strikeDocument , modifiedAt: fullDocument.createdAt };
        const options = { upsert: true };
        collection.updateOne(query, update, options);
        
        strikeFound = 1;

        }

    return strikeFound;

};