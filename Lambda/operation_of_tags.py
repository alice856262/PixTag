import json
import boto3
from boto3.dynamodb.conditions import Attr

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ImageTable')

def lambda_handler(event, context):
    # Check if the HTTP method is POST
    if event['httpMethod'] == "POST":
        # Parse the JSON body of the request
        data = json.loads(event['body'])
        urls = data['thumbnail_url']
        tags = data['tags']
        user_email = data['user_email']
        operation_type = data['type']
        
        # Validate the operation type
        if operation_type not in [0, 1]:
            return{
                'statusCode': 400,
                 'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'},
                'body': json.dumps({
                    'message': 'Invalid operation type',
                    'status': 'error'
                })
            }
        # Iterate over each thumbnail URL
        for url in urls:
            # Scan DynamoDB table for items matching the thumbnail URL and user email
            response = table.scan(
                FilterExpression=Attr('thumbnail_url').eq(url)& Attr('user_email').eq(user_email)
            )
            # Check if items are found in the response
            if response['Items']:
                item = response['Items'][0]
                image_id = item['image_id']
                current_tags = set(item.get('tags', []))
            
                # Determine the new tags based on the operation type
                if operation_type == 1: 
                    new_tags = current_tags.union(set(tags))
                elif operation_type == 0:  
                    new_tags = current_tags.difference(set(tags))
                    
                # Update the tags in the DynamoDB table
                table.update_item(
                    Key={'image_id': image_id
                },
                    UpdateExpression='SET tags = :new_tags',
                    ExpressionAttributeValues={':new_tags': list(new_tags)}
                )
            
            else:
                return {
                    'statusCode': 404,
                     'headers': {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'},
                    'body': json.dumps({
                        'message': f'No item found for URL: {url} and user email: {user_email}',
                        'status': 'error'
                    })
                }
            
    return {
            'statusCode': 200,
             'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'},
            'body': json.dumps('Tags updated successfully')
        }

