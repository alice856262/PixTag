import { StorageUtils } from '@/utils'
import { deleteImagesUrl } from '@/config/aws-config.ts'

export class ImgDeleteApi {
  static async deleteImg(thumbnail_urls: string[]): Promise<boolean> {
    try {
      const requestBody = JSON.stringify({
        thumbnail_urls,
        user_email: StorageUtils.getEmail(),
      })
      // console.error(deleteImagesUrl, requestBody)
      const response = await fetch(deleteImagesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      })

      return response.ok
    } catch (e) {
      console.error(deleteImagesUrl, e)
    }
    return false
  }
}
