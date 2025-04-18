"""
Find thumbnail url based on the image
INPUT: 
        dynamodb_table: <DynamoDB table name>

        request body: 
        {
    "file":"image_base64",
    "user_email": "xxxxxx@gmail.com"
}

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
            ...
        ]
        }
"""
import json
import boto3
from boto3.dynamodb.conditions import Attr
import cv2
import numpy as np
import io
import base64

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ImageTable')  # Replace with your actual table name

# Specify the bucket where YOLO configuration files are stored
CONFIG_BUCKET = 'pixtag-group47-config'

def lambda_handler(event, context):
    # Extract parameters from the event body
    data = json.loads(event['body'])
    user_email = data['user_email']
    imageb64 = data['file']

    # Object detect resulting tags
    tags = object_detect(imageb64)

    # Prepare results containers
    thumbnail_url_list = []
    full_image_url_list = []

    # Query DynamoDB
    response = table.scan(
        FilterExpression=Attr('user_email').eq(user_email)
    )

    # Filter items by tags
    for item in response['Items']:
        item_tags = item.get('tags', [])  # No need to parse JSON, assuming tags are already a list
        # Check if the item tags contain all elements of the input tags
        if all(item_tags.count(tag) >= tags.count(tag) for tag in set(tags)):
            thumbnail_url_list.append(item.get('thumbnail_url', ''))
            full_image_url_list.append(item.get('full_image_url',''))


    # Construct response object
    return {
        'statusCode': 200,
        'body': json.dumps({
            'thumbnail_url': thumbnail_url_list,
            'full_image_url':full_image_url_list
        }),
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    }

def object_detect(image_base64):
    # Initialize S3 client
    s3_client = boto3.client('s3')

    # Download YOLO configuration files from S3
    labels = load_file_from_s3(s3_client, CONFIG_BUCKET, 'yolo_tiny_configs/coco.names').decode('utf-8').strip().split('\n')
    cfg_path = '/tmp/yolov3-tiny.cfg'
    weights_path = '/tmp/yolov3-tiny.weights'
    download_file_from_s3(s3_client, CONFIG_BUCKET, 'yolo_tiny_configs/yolov3-tiny.cfg', cfg_path)
    download_file_from_s3(s3_client, CONFIG_BUCKET, 'yolo_tiny_configs/yolov3-tiny.weights', weights_path)

    # Load YOLO model
    net = cv2.dnn.readNetFromDarknet(cfg_path, weights_path)

    # Decode base64 image
    image_data = base64.b64decode(image_base64)
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Perform object detection
    detections = do_prediction(img, net, labels)

    # Create a comma-separated list of labels from detections
    tags = [detection['label'] for detection in detections]

    return tags

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
    # Retrieve all layer names from the network
    layer_names = net.getLayerNames()

    # OpenCV's DNN module was changed in version 4.x, where getLayerNames() returns names of all layers, not just output layers
    # getUnconnectedOutLayers() returns indices of the output layers which are not connected to the next layers
    out_layers_indices = net.getUnconnectedOutLayers()

    # Since getUnconnectedOutLayers() might return a 1D array or a 2D array (depends on OpenCV version), handle both cases
    if out_layers_indices.ndim == 2:
        out_layers_indices = out_layers_indices.flatten()

    # Retrieve the names of the output layers using the indices
    return [layer_names[i - 1] for i in out_layers_indices]

def load_file_from_s3(client, bucket, key):
    response = client.get_object(Bucket=bucket, Key=key)
    return response['Body'].read()

def download_file_from_s3(client, bucket, key, local_path):
    client.download_file(Bucket=bucket, Key=key, Filename=local_path)