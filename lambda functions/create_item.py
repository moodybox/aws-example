import json
import os
import uuid
import boto3


dynamodb = boto3.resource('dynamodb')

def create(event, context):
    print(event)
    event = json.loads(event['body'])

    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

    item = {
        "id": str(uuid.uuid1()),
        "assetID": event["assetID"],
        "assetLocation": event["assetLocation"],
        "description": event["description"],
        "implementationMonth": event["implementationMonth"],
        "implementationYear": event["implementationYear"],
        "maintenanceNotes": event["maintenanceNotes"],
        "manufacturer": event["manufacturer"],
        "manufacturerPart": event["manufacturerPart"],
        "organizationalTag": event["organizationalTag"]
    }

    # write the todo to the database
    table.put_item(Item=item)

    # create a response
    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*" # Required for CORS support to work
        },
        "body": json.dumps(item)
    }

    return response