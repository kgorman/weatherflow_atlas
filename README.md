# WeatherFlow Atlas

An application built on MongoDB Atlas for various weather related stream processing, event processing, and real-time data analysis, alerting and analytics use-cases. This uses [WeatherFlow Tempest](https://shop.weatherflow.com/collections/frontpage/products/tempest) as the IoT/Weather sensor to generate data. This repo then manages both the collection, storage and analysis of that data for various use cases.

## Client

A client exists to pull data from Tempest weather stations, and push it to MongoDB Atlas. [See Here](./datasource/)

## MongoDB Atlas streaming components 

Atlas triggers and functions are [defined here](./realm/). They utilize Github integration for committing files to Atlas, see more [documentation here](https://www.mongodb.com/docs/atlas/app-services/manage-apps/deploy/automated/deploy-automatically-with-github/) for how to link/configure your repository with Atlas.

### Lightning Alerts

An Atlas trigger/function to alert in real time when lightning is detected N times within Y distance from the sensor. A text message is sent to a configurable SMS address when strikes are detected. Configuring alerts is done via entering an SMS value for a specific weather station id like:

```json
db.users.insertOne({
    "email": "<your email address>",
    "station_id": "<station_id for the weather station in question>",
    "sms": "<sms number>"
})
```

