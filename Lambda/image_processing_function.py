import cv2
import numpy as np
import boto3
import io


def lambda_handler(event, context):
    # Configuration for role and session
    role_arn = 'arn:aws:iam::363931128526:role/LabRole'
    session_name = 'session-name'
    sts_client = boto3.client('sts')
    assumed_role = sts_client.assume_role(RoleArn=role_arn, RoleSessionName=session_name)
    credentials = assumed_role['Credentials']

    # Create a new session with the assumed role credentials
    session = boto3.Session(
        aws_access_key_id=credentials['AccessKeyId'],
        aws_secret_access_key=credentials['SecretAccessKey'],
        aws_session_token=credentials['SessionToken'],
    )
    s3_client = session.client('s3')

    # Retrieve the bucket name and key for the uploaded image
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    # Ensure processing only for images in 'uploads/'
    if not key.startswith("uploads/"):
        return {
            'statusCode': 400,
            'body': "This function only processes images within the 'uploads/' folder."
        }

    # Copy the original image to the 'detects/' folder
    new_key = key.replace("uploads/", "detects/")
    s3_client.copy_object(Bucket=bucket, CopySource={'Bucket': bucket, 'Key': key}, Key=new_key)

    # Get the image from S3
    response = s3_client.get_object(Bucket=bucket, Key=key)
    image_content = response['Body'].read()

    # Convert the image content to a numpy array and decode
    image_np_array = np.frombuffer(image_content, np.uint8)
    image = cv2.imdecode(image_np_array, cv2.IMREAD_COLOR)

    # Calculate new dimensions preserving aspect ratio
    desired_size = 128
    old_size = image.shape[:2]  # old_size is in (height, width) format
    ratio = float(desired_size) / max(old_size)
    new_size = tuple([int(x * ratio) for x in old_size])

    # Resize the image to new dimensions
    resized_image = cv2.resize(image, (new_size[1], new_size[0]))  # new_size should be in (width, height) format

    # Encode the resized image to JPEG
    _, buffer = cv2.imencode('.jpg', resized_image)
    io_buffer = io.BytesIO(buffer)

    # Construct the S3 key for the thumbnail
    thumbnail_key = f"thumbnails/{key.replace('uploads/', '')}"

    # Upload the thumbnail to S3
    s3_client.put_object(Bucket=bucket, Key=thumbnail_key, Body=io_buffer.getvalue(), ContentType='image/jpeg')

    return {
        'statusCode': 200,
        'body': f"Thumbnail created and uploaded successfully to {thumbnail_key}. Original image copied to {new_key}."
    }
