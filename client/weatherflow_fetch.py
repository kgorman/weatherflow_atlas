import requests
import json
import os
import time

from confluent_kafka import Producer
import socket

SOURCE_BASE_URL = os.environ.get('SOURCE_BASE_URL')
SOURCE_KEY = os.environ.get('SOURCE_KEY')
SOURCE_STATION = os.environ.get('SOURCE_STATION')

TARGET_BASE_URL = os.environ.get('TARGET_BASE_URL')
TARGET_KEY = os.environ.get('TARGET_KEY')
TARGET_NAME = os.environ.get('TARGET_NAME')
TARGET_COLLECTION = os.environ.get('TARGET_COLLECTION')
TARGET_DATABASE = os.environ.get('TARGET_DATABASE')
TARGET_TOPIC = os.environ.get('TARGET_TOPIC')
TARGET_KAFKA = os.environ.get('TARGET_KAFKA')

def fetch():
    url = "{}{}/?token={}".format(SOURCE_BASE_URL, SOURCE_STATION, SOURCE_KEY)
    # print(url)
    response = requests.get(url)
    return response.json()

def send():
    source_data = fetch()
    now = str(round(time.time() * 1000))                            # new TS
    source_data['createdAt'] = { "$date": { "$numberLong": now }}
    # print(len(json.dumps(source_data).encode('utf-16')))            # how big is the message?

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

    # throw into local kafka
    conf = {'bootstrap.servers': "broker:9092"}
    producer = Producer(conf)
    producer.produce(TARGET_TOPIC, value=json.dumps(source_data))
    producer.flush()

    return response

def main():
    while True:
        try:
            print(send())
        except Exception as e:
            print("ERROR: unable to fetch {}".format(e))
        time.sleep(30)

if __name__ == "__main__":
    main()
