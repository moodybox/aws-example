import os
import json
import boto3


dynamodb = boto3.resource('dynamodb')

def get(event, context):
    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])
    
    # fetch todo from the database
    # fetch todo from the database
    result = table.get_item(
    Key={
        'id': event['queryStringParameters']['id']
        }
    )

    # create a response
    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*", # Required for CORS support to work
        },
        "body": json.dumps(result["Item"])
    }
    
    return response