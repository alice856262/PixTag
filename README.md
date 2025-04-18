# PixTag - Serverless Image Storage System

PixTag is a serverless image storage system that allows users to upload, tag, and query images using object detection and image metadata. The system leverages AWS services and OpenCV for robust image processing and analysis.

## Features

- Image upload and storage
- Automatic object detection and tagging
- Image metadata management
- Advanced image querying capabilities
- User authentication and authorization
- Serverless architecture

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI (MUI) for UI components
- Vite for build and development
- AWS Cognito for authentication

### Backend
- AWS Lambda for serverless functions
- API Gateway for REST endpoints
- DynamoDB for metadata storage
- S3 for image storage
- SNS for notifications
- OpenCV for image processing

## Project Structure

```
PixTag/
├── src/                   # Frontend source code
│   ├── api/               # API integration
│   ├── config/            # Configuration files
│   ├── pages/             # React page components
│   ├── router/            # React router configuration
│   └── utils/             # Utility functions
├── Lambda/                # AWS Lambda functions
│   ├── delete_images.py
│   ├── find_full_image_by_thumbnail.py
│   ├── image_processing_function.py
│   ├── image_upload_function.py
│   ├── object_detection_function.py
│   ├── operation_of_tags.py
│   ├── pix_tag_image_upload.py
│   ├── query_image.py
│   ├── query_image_function.py
│   ├── query_tags.py
│   ├── subscription_sns.py
│   └── update_subscription.py
├── yolo_tiny_configs/     # YOLO model configurations
└── package.json           # Frontend dependencies
```

## Key Components

### Image Processing
- `image_processing_function.py`: Core image processing utilities
- `object_detection_function.py`: Object detection implementation
- `yolo_tiny_configs/`: YOLO model configurations for object detection

### Image Management
- `image_upload_function.py`: Image upload handling
- `query_image_function.py`: Image querying functionality
- `operation_of_tags.py`: Tag management operations

### Frontend
- React-based user interface
- Material-UI components
- AWS Cognito integration
- Image upload and management interface

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3.x
- AWS account with appropriate permissions
- OpenCV installed

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd PixTag
```

2. Install frontend dependencies
```bash
npm install
```

3. Configure AWS credentials
- Set up AWS credentials in your environment
- Configure Cognito user pool and identity pool
- Set up S3 buckets and DynamoDB tables

4. Start the development server
```bash
npm run dev
```

## Deployment

The system is designed to be deployed on AWS using serverless architecture:

1. Deploy Lambda functions
2. Set up API Gateway endpoints
3. Configure S3 buckets and DynamoDB tables
4. Deploy frontend to static hosting

## Testing

- Frontend tests: `npm run test`
- Python tests: Run individual test files
- Lambda function tests: Use AWS SAM or local testing

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Acknowledgments

- AWS for serverless infrastructure
- OpenCV for image processing capabilities
- YOLO for object detection 