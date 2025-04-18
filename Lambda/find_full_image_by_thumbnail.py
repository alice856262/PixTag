import json
import boto3
from boto3.dynamodb.conditions import Attr

def lambda_handler(event, context):
    # 从事件中解析缩略图URL
    # body = json.loads(event['body'])
    thumbnail_url = event.get("thumbnail_url","")
    
    # 初始化DynamoDB资源
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('ImageTable')
    
    # 查询DynamoDB表
    response = table.scan(
        FilterExpression=Attr('thumbnail_url').eq(thumbnail_url)
    )
    
    # 检查查询结果
    if 'Items' in response and len(response['Items']) > 0:
        full_image_url = response['Items'][0]['full_image_url']
        return {
            'statusCode': 200,
            'full_image_url': full_image_url
            # 'headers': {
            #     'Content-Type': 'application/json',
            #     'Access-Control-Allow-Origin': '*'
            # }
        }
    else:
        return {
            'statusCode': 404,
            'error': 'Image not found'
            # 'headers': {
            #     'Content-Type': 'application/json',
            #     'Access-Control-Allow-Origin': '*'
            # }
        }