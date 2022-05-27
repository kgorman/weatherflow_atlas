# WeatherFlow Atlas

A application built on MongoDB Atlas for various weather related stream processing, event processing, and real-time data analysis, alerting and analytics use-cases.


## Client

A client exists to pull data from Tempest weather stations, and push it to MongoDB Atlas. [See Here](./datasource/)

## MongoDB Atlas streaming components 

Atlas triggers and functions are [defined here](./realm/). They utilize Github integration for committing files to Atlas, see more [documentation here](https://www.mongodb.com/docs/atlas/app-services/manage-apps/deploy/automated/deploy-automatically-with-github/) for how to link/configure your repository with Atlas.
