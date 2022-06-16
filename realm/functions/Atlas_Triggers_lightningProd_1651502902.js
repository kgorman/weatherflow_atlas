exports = function(changeEvent) {

    const fullDocument = changeEvent.fullDocument;
    const collection = context.services.get("KGShardedCluster01").db("demo").collection("strikes");
    const usersCollection = context.services.get("KGShardedCluster01").db("demo").collection("users"); 
    const logCollection = context.services.get("KGShardedCluster01").db("demo").collection("strikeslog");
    const tsCollection = context.services.get("KGShardedCluster01").db("demo").collection("tsweather");
    strikeFound = 0;
    messageAck = "";

    /* test for a strike near me */
    if (fullDocument && fullDocument.obs[0].lightning_strike_count_last_1hr > 2 && fullDocument.obs[0].lightning_strike_last_distance < 20 ) {
        const strikeDocument = {
            'lightning_strike_last_epoch' : fullDocument.obs[0].lightning_strike_last_epoch,
            'lightning_strike_last_distance' : fullDocument.obs[0].lightning_strike_last_distance,
            'lightning_strike_count' : fullDocument.obs[0].lightning_strike_count,
            'lightning_strike_count_last_1hr' : fullDocument.obs[0].lightning_strike_count_last_1hr,
            'lightning_strike_count_last_3hr' : fullDocument.obs[0].lightning_strike_count_last_3hr,
        };

        /* look for userid to alert, if not skip */
        const user = usersCollection.findOne({"station_id": fullDocument.station_id })
        if (user) {

            /* send an alert, be sure to add twilio to dependencies */
            const accountSid = "%%values.twilio_account_sid"; 
            const authToken = "%%values.twilio_auth_token";
            const client = require('twilio')(accountSid, authToken, { lazyLoading: true });
    
            messageAck = client.messages 
                .create({ 
                    body: 'lightning strike detected near you!',
                    messagingServiceSid: "%%values.twilio_service_sid",
                    to: user.sms
                }) 
                .then(message => console.log('message sent')) 
                .done();
            }

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
        const logDocument = { 
            station_id: fullDocument.station_id, 
            strikeFound: strikeFound,
            messageLog: messageAck,
            createdAt: fullDocument.createdAt
        };
        logCollection.insertOne(logDocument);

        const tsDocument = {
            metadata: {station: fullDocument.station_id},
            ts: fullDocument.createdAt,
            air_temperature: fullDocument.obs[0].air_temperature
        }
        tsCollection.insertOne(tsDocument);
    }

    return strikeFound;

};