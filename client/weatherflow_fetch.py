import requests
import json
import os
import time
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

SOURCE_BASE_URL = os.environ.get('SOURCE_BASE_URL')
SOURCE_KEY = os.environ.get('SOURCE_KEY')
SOURCE_STATION = os.environ.get('SOURCE_STATION')

USERNAME = os.environ.get('TARGET_USERNAME')
PASSWORD = os.environ.get('TARGET_PASSWORD') 
TARGET_URL = os.environ.get('TARGET_URL')
MONGOURI = "mongodb+srv://{}:{}@{}".format(USERNAME, PASSWORD, TARGET_URL)
TARGET_COLLECTION = os.environ.get('TARGET_COLLECTION')
TARGET_DATABASE = os.environ.get('TARGET_DATABASE')

def fetch():
    url = "{}{}/?token={}".format(SOURCE_BASE_URL, SOURCE_STATION, SOURCE_KEY)
    response = requests.get(url)
    d = response.json()
    now = str(round(time.time() * 1000))
    d['createdAt'] = { "$date": { "$numberLong": now }}
    # print(len(json.dumps(response).encode('utf-16')))            # how big is the message?
    print(d)
    return d

def sendDataAtlas(d):
   mongoclient = MongoClient(MONGOURI)
   db = mongoclient[TARGET_DATABASE]
   col = db[TARGET_COLLECTION]
   print(json.dumps(d))
   col.insert_one(d)

def main():
    while True:
        try:
            d = fetch()
            if MONGOURI:
                sendDataAtlas(d)
        except Exception as e:
            print("ERROR: unable to process data {}".format(e))
        time.sleep(30)

if __name__ == "__main__":
    main()