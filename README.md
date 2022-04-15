# weatherflow_atlas
A simple agent to stream Octoprint information from 3d printing process to MongoDB Atlas

# install
### Clone this repo
Open a terminal window and run the following commands from a convenient directory on your machine:

```
git clone git@github.com:kgorman/weatherflow_atlas.git
cd weatherflow_atlas
```

### Create an environment file
In the same terminal window and directory, create an .env file

```
echo "SOURCE_BASE_URL=https://swd.weatherflow.com/swd/rest/observations/station/" >> env.txt
echo "SOURCE_STATION=<<your station ID" > env.txt
echo "SOURCE_KEY=<<your source key>>" > env.txt

echo "TARGET_BASE_URL=https://data.mongodb-api.com/app/<< your endpoint key>>/endpoint/data/beta/action/insertOne" > env.txt
echo "TARGET_KEY=<<your data api key>>" > env.txt
echo "TARGET_NAME=<<your cluster>>" > env.txt
echo "TARGET_DATABASE=<<your database>>" > env.txt
echo "TARGET_COLLECTION=weather" > env.txt
```

## run it
```
docker build . -t weatherflow_atlas
docker run -it --env-file env.txt weatherflow_atlas
```