import { CognitoUserPool } from 'amazon-cognito-identity-js'

export const userPool = new CognitoUserPool({
  UserPoolId: 'us-east-1_iRafv33fz',
  ClientId: '5ufp3de280rsofhjf4gav1pqnh',
})

const BASE_URL: string =
  'https://5ihn668nq1.execute-api.us-east-1.amazonaws.com'

export const deleteImagesUrl: string = `${BASE_URL}/prod/api/query/delete-images`
export const tagSubscriptionUrl: string = `${BASE_URL}/prod/api/tag-subscription`
export const queryByTagsUrl: string = `${BASE_URL}/prod/api/query/query-by-tags`
export const queryUpdateTagsUrl: string = `${BASE_URL}/prod/api/query/update-tags`
export const uploadPicUrl: string = `${BASE_URL}/prod/api/upload`
export const queryByPic: string = `${BASE_URL}/prod/api/query/query-by-image`
