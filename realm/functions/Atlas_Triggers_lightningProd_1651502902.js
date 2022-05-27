exports = function(changeEvent) {

    const fullDocument = changeEvent.fullDocument;
    const collection = context.services.get("KGShardedCluster01").db("demo").collection("strikes");
    const logCollection = context.services.get("KGShardedCluster01").db("demo").collection("strikeslog");
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
        const accountSid = 'AC4d0ea8d08742f70ba5aff90da6bbe10a'; 
        const authToken = '3446d37f748a0c91d833a600cd95d272'; 
        const client = require('twilio')(accountSid, authToken, { lazyLoading: true }); 
 
        /* comment out for now
        client.messages 
            .create({ 
                body: 'lightning strike detected near you!',
                messagingServiceSid: 'MGb82eed03aea26d50742a67bfb59a851c',      
                to: '+19255773168' 
            }) 
            .then(message => console.log('message sent')) 
            .done();
        */

        /* upsert a collection */
        const pk = fullDocument.station_id;
        const query = {station_id : pk};
        const update = { station_id: pk, strike: strikeDocument , modifiedAt: fullDocument.createdAt };
        const options = { upsert: true };
        collection.updateOne(query, update, options);

        /* set var for strike */
        strikeFound = 1;

        }

    /* log what this run found */
    if (fullDocument) {
        const logDocument = { station_id: fullDocument.station_id, strikeFound: strikeFound, createdAt: fullDocument.createdAt };
        logCollection.insertOne(logDocument);
    }

    return strikeFound;

};