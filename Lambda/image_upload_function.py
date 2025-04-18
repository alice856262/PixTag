import json
import boto3
import base64
import hashlib


def generate_image_id(base64_image):
    image_data = base64.b64decode(base64_image)
    sha256_hash = hashlib.sha256(image_data).digest()
    return sha256_hash.hex()


def lambda_handler(event, context):
    try:
        # Retrieving data from the event
        request_body = json.loads(event['body'])
        file_name = request_body['name']
        file_content = request_body['file']
        user_email = request_body['user_email']
        image_id = generate_image_id(file_content)

        # Initialize AWS clients
        dynamodb = boto3.resource('dynamodb')
        s3 = boto3.client('s3')

        table_image = dynamodb.Table('ImageTable')
        table_user = dynamodb.Table('UserSubscription')
        table_user.put_item(Item={'user_email': user_email, 'tag': ''})

        # Query DynamoDB to check if an item with the same image_id exists
        response_image = table_image.get_item(
            Key={
                'image_id': image_id,
            }
        )

        # If item with the same image_id doesn't exist
        if 'Item' not in response_image:
            # Save image ID and user email to DynamoDB
            table_image.put_item(Item={'image_id': image_id, 'full_image_url': '', 'tags': [], 'thumbnail_url': '',
                                       'user_email': user_email})

            # Save image to S3
            s3.put_object(
                Bucket='pixtag-group47-image',
                Key='uploads/' + image_id,
                Body=base64.b64decode(file_content))

            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps('Image uploaded successfully!')
            }
        else:
            existing_user_email = response_image['Item'].get('user_email')
            # If the item belongs to a different user
            if existing_user_email != user_email:
                # Save image ID and user email to DynamoDB (this overwrites the record with the same image_id)
                table_image.put_item(Item={'image_id': image_id, 'full_image_url': '', 'tags': [], 'thumbnail_url': '',
                                           'user_email': user_email})

                # Save image to S3
                s3.put_object(
                    Bucket='pixtag-group47-image',
                    Key='uploads/' + image_id,
                    Body=base64.b64decode(file_content))

                return {
                    'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
                    'body': json.dumps('Image uploaded successfully!')
                }
            else:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
                    'body': json.dumps('Image already exists!')
                }

    except KeyError as e:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': f'Missing key in the request: {str(e)}'}),
        }
