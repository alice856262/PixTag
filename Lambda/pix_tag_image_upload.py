"""
The image will be uploaded to S3 bucket <bucket_name/uploads> folder
INPUT:
    bucket_name: <S3 bucket name>

    request body: {
        "name": "image name",
        "file": "base64 encode ".
        "user_email": "user_email"
        }
    
RETURN：
    {'message': "images uploaded successfully"}
"""

import json
import base64
import boto3
import hashlib
import mimetypes

s3 = boto3.client('s3')
dynamodb = boto3.client('dynamodb')

bucket_name = 'pix-tag-jianhui'
dynamodb_table = 'PixTag-jianhui'

def generate_image_id(base64_image):
    image_data = base64.b64decode(base64_image)
    sha256_hash = hashlib.sha256(image_data).digest()
    return sha256_hash.hex()

def lambda_handler(event, context):
    if event['httpMethod'] == 'POST':
        try:
            data = json.loads(event['body'])
            name = data['name']
            complete_name = "uploads/" + name
            imageb64 = data['file']
            image = base64.b64decode(imageb64)
            user_email = data['user_email']
            image_id = generate_image_id(imageb64)

            mime_type, _ = mimetypes.guess_type(name)
            if not mime_type:
                mime_type = 'application/octet-stream'

            dynamodb.put_item(
                TableName=dynamodb_table,
                Item={
                    'image_id': {'S': image_id},
                    'user_email': {'S': user_email},
                    'full_image_url': {'S': ''},
                    'tags': {'L': []},
                    'thumbnail_url': {'S': ''}
                }
            )

            s3.put_object(
                Bucket=bucket_name,
                Key=complete_name,
                Body=image,
                ACL='public-read',
                ContentType=mime_type,
                ContentDisposition='inline'
            )

            return {
                'statusCode': 200,
                'body': json.dumps({'S3_URL': f"https://{bucket_name}.s3.amazonaws.com/{complete_name}"}),
                'headers': {'Access-Control-Allow-Origin': '*'}
            }
        except KeyError as e:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': f'Missing key in the request: {str(e)}'}),
                'headers': {'Access-Control-Allow-Origin': '*'}
            }
    else:
        return {
            'statusCode': 405,
            'body': json.dumps({'message': 'Method Not Allowed'}),
            'headers': {'Access-Control-Allow-Origin': '*'}
        }
