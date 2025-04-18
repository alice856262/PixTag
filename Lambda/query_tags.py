"""
Find images based on the tags
INPUT: 
        dynamodb_table: <DynamoDB table name>

        request body: 
        {
    "tags": "[\"person\", \"cat\", \"laptop\"]",
    "count": "[\"1\",\"1\",\"3\"]",
    "user_email": "xxxxxx@gmail.com"


RETURN:
        {
        thumbnail_url: [
            <thumbnail_url>,
            <thumbnail_url>,
            .........
        ],
        full_image_url:[
            <full_image_url>,
            <full_image_url>,
            <full_image_url>
            ............
        ]
        }
"""

import json
import boto3
from boto3.dynamodb.conditions import Attr

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('PixTag-jianhui')  # Replace with your actual table name

def lambda_handler(event, context):
    # Extract parameters from the event body
    data = json.loads(event['body'])
    user_email = data['user_email']
    tags = data['tags']  # Expecting a list of strings
    counts = data['count']  # Expecting a list of integers

    if len(tags) != len(counts):
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'The length of tags and counts must be the same.'}),
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        }

    # Prepare results containers
    thumbnail_url_list = []
    full_image_url_list = []
    
    # Query DynamoDB by user_email
    response = table.scan(
        FilterExpression=Attr('user_email').eq(user_email)
    )
    
    # Filter items by tags and their counts
    for item in response['Items']:
        item_tags = item.get('tags', [])  # This should be a simple list of strings
        valid_item = True
        for tag, count in zip(tags, counts):
            if item_tags.count(tag) < count:
                valid_item = False
                break
        
        if valid_item:
            thumbnail_url_list.append(item.get('thumbnail_url', ''))
            full_image_url_list.append(item.get('full_image_url', ''))

    # Construct response object
    return {
        'statusCode': 200,
        'body': json.dumps({
            'thumbnail_url': thumbnail_url_list,
            'full_image_url': full_image_url_list
        }),
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    }


