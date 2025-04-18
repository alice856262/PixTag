"""
update subscription tag, if previously no record in databse. Create a new record
Also operate SNS subscription
INPUT: 
        dynamodb_table: <DynamoDB table name>

        request body: 
            {
            "user_email": "xxxx@gmail.com",
            "tag": "person"
            }


RETURN:
            {
                'statusCode': 200,
                'body': json.dumps({'message': f'You now have subscribed for {tag}'}),
                'headers': {'Content-Type': 'application/json'}
            }
"""

import json
import boto3

# Initialize a DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('PixTag_subscription')  # Replace with your table name

# Initialize an SNS client
sns = boto3.client('sns')

def lambda_handler(event, context):
    # Parse the incoming JSON body
    try:
        data = json.loads(event['body'])
        user_email = data['user_email']
        tag = data['tag']
    except KeyError as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': f'Missing key: {str(e)}'}),
            'headers': {'Content-Type': 'application/json'}
        }

    try:
        response = table.get_item(Key={'user_email': user_email})
        item = response.get('Item')

        if item:
            # Item exists, update it
            table.update_item(
                Key={'user_email': user_email},
                UpdateExpression='SET tag = :val',
                ExpressionAttributeValues={
                    ':val': tag
                }
            )
        else:
            # Item does not exist, create it
            table.put_item(
                Item={
                    'user_email': user_email,
                    'tag': tag
                }
            )

        # Subscribe the email to the SNS topic
        sns_response = sns.subscribe(
            TopicArn='arn:aws:sns:us-east-1:868394781763:PixTag_jianhui_SNS',
            Protocol='email',
            Endpoint=user_email  # User's email address
        )

        # Check if subscription was successful
        if sns_response['ResponseMetadata']['HTTPStatusCode'] == 200:
            return {
                'statusCode': 200,
                'body': json.dumps({'message': f'You now have subscribed for {tag}'}),
                'headers': {'Content-Type': 'application/json'}
            }
        else:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Failed to subscribe to SNS topic'}),
                'headers': {'Content-Type': 'application/json'}
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': f'Error processing request: {str(e)}'}),
            'headers': {'Content-Type': 'application/json'}
        }