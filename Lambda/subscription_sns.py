import json
import boto3
from boto3.dynamodb.conditions import Attr

def lambda_handler(event, context):
    sns = boto3.client('sns')
    dynamodb = boto3.resource('dynamodb')
    subscription_table = dynamodb.Table('PixTag_subscription')
    
    topic_arn = 'arn:aws:sns:us-east-1:868394781763:PixTag_jianhui_SNS'  # Update with your SNS topic ARN

    for record in event['Records']:
        if record['eventName'] == 'MODIFY':  # Check if it's a new image record
            new_image = record['dynamodb']['NewImage']
            user_email = new_image['user_email']['S']
            tags = [tag['S'] for tag in new_image['tags']['L']]
            full_image_url = new_image['full_image_url']['S']

            # Scan the subscription table for matches
            response = subscription_table.scan(
                FilterExpression=Attr('user_email').eq(user_email)
            ) 
            for item in response['Items']:
                # Direct access to item attributes as the AWS SDK automatically handles the type conversion
                if item['tag'] in tags:
                    message = f"There is a new image with tag you subscribed is uploaded, {full_image_url}"

                    # Publish the message to the SNS topic
                    sns.publish(
                        TargetArn=topic_arn,
                        Message=message,
                        Subject="New Image Notification"
                    )

    return {
        'statusCode': 200,
        'body': json.dumps('Processed successfully!')
    }