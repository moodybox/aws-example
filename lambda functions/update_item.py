import json
import logging
import os
import boto3

dynamodb = boto3.resource('dynamodb')


def update(event, context):
    
    # Get event item from JSON body
    event = json.loads(event['body'])

    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])
    
    # update the todo in the database
    result = table.update_item(
        Key={
            'id': event['id']
        },
        ExpressionAttributeValues={
            ":assetID": event["assetID"],
            ":assetLocation": event["assetLocation"],
            ":description": event["description"],
            ":implementationMonth": event["implementationMonth"],
            ":implementationYear": event["implementationYear"],
            ":maintenanceNotes": event["maintenanceNotes"],
            ":manufacturer": event["manufacturer"],
            ":manufacturerPart": event["manufacturerPart"],
            ":organizationalTag": event["organizationalTag"]
        },
        UpdateExpression='''set assetID = :assetID,
            assetLocation = :assetLocation,
            description = :description,
            implementationMonth = :implementationMonth,
            implementationYear = :implementationYear,
            maintenanceNotes = :maintenanceNotes,
            manufacturer = :manufacturer,
            manufacturerPart = :manufacturerPart,
            organizationalTag = :organizationalTag''',
        ReturnValues='UPDATED_NEW',
    )

    # create a response
    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*", # Required for CORS support to work
        },
        "body": json.dumps(result['Attributes'])
    }
    return response
