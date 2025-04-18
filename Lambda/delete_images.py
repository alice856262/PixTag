import json
import boto3
from boto3.dynamodb.conditions import Key, Attr

# Initialize S3 and DynamoDB clients
s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ImageTable')

def lambda_handler(event, context):
    # Check if the HTTP method is POST
    if event['httpMethod'] == "POST":
        # Parse the JSON body of the request
        data = json.loads(event['body'])
        thumbnail_urls = data['thumbnail_urls']
        user_email = data['user_email']
        
        # Iterate over each thumbnail URL
        for thumbnail_url in thumbnail_urls:
            # Scan DynamoDB table for items matching the thumbnail URL and user email
            response = table.scan(
                FilterExpression=Attr('thumbnail_url').eq(thumbnail_url)& Attr('user_email').eq(user_email)
            )
            # Check if items are found in the response
            if response['Items']:
                item = response['Items'][0]
                image_id = item['image_id']
                full_image_url = item['full_image_url']
                thumbnail_url = item['thumbnail_url']

                # Extract bucket name and keys from thumbnail_url
                bucket_name = 'pixtag-group47-image-test'
                uploads_key = 'uploads/' + full_image_url.split('/')[-1]
                thumbnail_key = 'thumbnails/' + thumbnail_url.split('/')[-1]
                detects_key = 'detects/' + full_image_url.split('/')[-1]
                    
                # Delete images and thumbnails from S3
                delete_from_s3(bucket_name, uploads_key)
                delete_from_s3(bucket_name, thumbnail_key)
                delete_from_s3(bucket_name, detects_key)
                    
                # Delete records from DynamoDB
                delete_from_dynamodb(image_id)
            else:
                return {
                    'statusCode': 404,
                     'headers': {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'},
                    'body': json.dumps({'message': 'No item found for URL and user email', 'status': 'error'})
                }

        return {
            'statusCode': 200,
             'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'},
            'body': json.dumps({'message': 'Images deleted successfully', 'status': 'success'})
        }
    else:
        return {
            'statusCode': 400,
             'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'},
            'body': json.dumps({'message': 'Unsupported HTTP method', 'status': 'error'})
        }

def delete_from_s3(bucket, key):
    """
    Delete an object from an S3 bucket.

    :param bucket: Name of the S3 bucket
    :param key: Key of the object to delete
    """
    s3_client.delete_object(Bucket=bucket, Key=key)

def delete_from_dynamodb(image_id):
    """
    Delete an item from the DynamoDB table.

    :param image_id: ID of the image to delete
    """
    table.delete_item(
        Key={
            'image_id': image_id
        }
    )
