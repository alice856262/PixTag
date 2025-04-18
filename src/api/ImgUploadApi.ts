// {
//   "name": "test_image1.jpg",
//   "file": "",
//   "user_email": "nicolsonzs0112@gmail.com"
// }
import { StorageUtils } from '@/utils'
import { uploadPicUrl } from '@/config/aws-config.ts'

export class ImgUploadApi {
  static async uploadPic(rawFile: File): Promise<boolean> {
    try {
      const file = await ImgUploadApi.fileToBase64(rawFile)
      const requestBody = JSON.stringify({
        name: rawFile.name,
        file,
        user_email: StorageUtils.getEmail(),
      })
      // console.error(uploadPicUrl, requestBody)
      const response = await fetch(uploadPicUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      })
      return response.ok
    } catch (e) {
      console.error(uploadPicUrl, e)
    }
    return false
  }

  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]
        resolve(base64String)
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsDataURL(file)
    })
  }
}
