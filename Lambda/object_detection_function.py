import json
import boto3
import cv2
import numpy as np
import io

# Initialize the S3 and DynamoDB clients
s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ImageTable')

# Specify the bucket where YOLO configuration files are stored
CONFIG_BUCKET = 'pixtag-group47-config'


def lambda_handler(event, context):
    # Download YOLO configuration files from S3
    labels = load_file_from_s3(s3, CONFIG_BUCKET, 'yolo_tiny_configs/coco.names').decode('utf-8').strip().split('\n')
    cfg_path = '/tmp/yolov3-tiny.cfg'
    weights_path = '/tmp/yolov3-tiny.weights'
    download_file_from_s3(s3, CONFIG_BUCKET, 'yolo_tiny_configs/yolov3-tiny.cfg', cfg_path)
    download_file_from_s3(s3, CONFIG_BUCKET, 'yolo_tiny_configs/yolov3-tiny.weights', weights_path)

    # Load the YOLO model
    net = cv2.dnn.readNetFromDarknet(cfg_path, weights_path)

    # Process each record from S3 event
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']

        # Get the image from S3
        response = s3.get_object(Bucket=bucket, Key=key)
        image_content = response['Body'].read()

        # Prepare image for detection
        img_array = np.frombuffer(image_content, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        # Perform object detection
        detections = do_prediction(img, net, labels)

        # Create a comma-separated list of labels from detections
        tags = [detection['label'] for detection in detections]

        save_key = key.replace('detects/', '')
        image_url = f"https://{bucket}.s3.amazonaws.com/uploads/{key}"
        thumbnail_url = f"https://{bucket}.s3.amazonaws.com/thumbnails/{key}"

        # Save to DynamoDB
        save_to_dynamodb(save_key, image_url, tags, thumbnail_url)

    return {
        'statusCode': 200,
        'body': json.dumps('Object detection and data insertion executed successfully')
    }


def do_prediction(image, net, labels):
    (H, W) = image.shape[:2]
    blob = cv2.dnn.blobFromImage(image, 1 / 255.0, (416, 416), swapRB=True, crop=False)
    net.setInput(blob)
    layerOutputs = net.forward(get_output_layers(net))

    boxes, confidences, classIDs = [], [], []
    for output in layerOutputs:
        for detection in output:
            scores = detection[5:]
            classID = np.argmax(scores)
            confidence = scores[classID]
            if confidence > 0.3:
                box = detection[0:4] * np.array([W, H, W, H])
                (centerX, centerY, width, height) = box.astype("int")
                x = int(centerX - (width / 2))
                y = int(centerY - (height / 2))
                boxes.append([x, y, int(width), int(height)])
                confidences.append(float(confidence))
                classIDs.append(classID)

    idxs = cv2.dnn.NMSBoxes(boxes, confidences, 0.3, 0.1)
    results = []
    if len(idxs) > 0:
        for i in idxs.flatten():
            results.append({
                "label": labels[classIDs[i]],
                "confidence": confidences[i],
                "box": {
                    "x": boxes[i][0],
                    "y": boxes[i][1],
                    "width": boxes[i][2],
                    "height": boxes[i][3]
                }
            })
    return results


def get_output_layers(net):
    layer_names = net.getLayerNames()
    out_layers_indices = net.getUnconnectedOutLayers()
    if out_layers_indices.ndim == 2:
        out_layers_indices = out_layers_indices.flatten()
    return [layer_names[i - 1] for i in out_layers_indices]


def load_file_from_s3(client, bucket, key):
    response = client.get_object(Bucket=bucket, Key=key)
    return response['Body'].read()


def download_file_from_s3(client, bucket, key, local_path):
    client.download_file(Bucket=bucket, Key=key, Filename=local_path)


def save_to_dynamodb(image_id, image_url, tags, thumbnail_url):
    response = table.update_item(
        Key={
            'image_id': image_id,
        },
        UpdateExpression='SET full_image_url = :url, tags = :tags, thumbnail_url = :thumb',
        ExpressionAttributeValues={
            ':url': image_url,
            ':tags': tags,
            ':thumb': thumbnail_url
        },
        ReturnValues='UPDATED_NEW'
    )


def save_to_dynamodb(image_id, image_url, tags, thumbnail_url):
    # Query DynamoDB to check if the item already exists
    response = table.get_item(
        Key={
            'image_id': image_id,
        }
    )

    # Check if the item exists and if the attributes are all null
    if 'Item' in response:
        existing_item = response['Item']
        if not existing_item['full_image_url'] and not existing_item['tags'] and not existing_item['thumbnail_url']:
            # Update the item with new data
            response = table.update_item(
                Key={
                    'image_id': image_id,
                },
                UpdateExpression='SET full_image_url = :url, tags = :tags, thumbnail_url = :thumb',
                ExpressionAttributeValues={
                    ':url': image_url,
                    ':tags': tags,
                    ':thumb': thumbnail_url
                },
                ReturnValues='UPDATED_NEW'
            )
            return True  # Item saved successfully
        else:
            return False  # Item already has non-null data, skip saving
    else:
        # Item doesn't exist, save as new item
        table.put_item(
            Item={
                'image_id': image_id,
                'full_image_url': image_url,
                'tags': tags,
                'thumbnail_url': thumbnail_url
            }
        )
        return True
