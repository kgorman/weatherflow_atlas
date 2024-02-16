import requests
import json
import os
import time

import socket

SOURCE_BASE_URL = os.environ.get('SOURCE_BASE_URL')
SOURCE_KEY = os.environ.get('SOURCE_KEY')
SOURCE_STATION = os.environ.get('SOURCE_STATION')

TARGET_BASE_URL = os.environ.get('TARGET_BASE_URL')
TARGET_KEY = os.environ.get('TARGET_KEY')
TARGET_NAME = os.environ.get('TARGET_NAME')
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

def send_to_atlas(payload):
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': TARGET_KEY
    }
    raw_data = json.dumps({
            "dataSource": TARGET_NAME,
            "database": TARGET_DATABASE,
            "collection": TARGET_COLLECTION,
            "document": payload
    })
    response = requests.post(TARGET_BASE_URL, headers=headers, data=raw_data)
    if response.status_code != 201:
        raise ValueError("Error code was {}".format(response.status_code))
    print("flushed to atlas")

def main():
    while True:
        try:
            d = fetch()
            if TARGET_BASE_URL:
                send_to_atlas(d)
        except Exception as e:
            print("ERROR: unable to process data {}".format(e))
        time.sleep(30)

if __name__ == "__main__":
    main()
