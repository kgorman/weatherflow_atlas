import requests
import json
import os
import time

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
    print(url)
    response = requests.get(url)
    return response.json()

def send():
    source_data = fetch()
    now = str(round(time.time() * 1000))
    source_data['createdAt'] = { "$date": { "$numberLong": now }}

    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': TARGET_KEY
    }
    raw_data = json.dumps({
            "dataSource": TARGET_NAME,
            "database": TARGET_DATABASE,
            "collection": TARGET_COLLECTION,
            "document": source_data
    })
    response = requests.post(TARGET_BASE_URL, headers=headers, data=raw_data)
    print(raw_data)
    return response

def main():
    while True:
        print(send())
        time.sleep(30)

if __name__ == "__main__":
    main()