/*
body: {
thumbnail_url: ["https://pixtag-group47-image-test.s3.amazonaws.com/thumbnails/test_image1_thumbnail.jpg",
"https://pixtag-group47-image-test.s3.amazonaws.com/thumbnails/test_image2_thumbnail.jpg"],
type: 1
tags: ["banana"],
user_email: “nicolsonzs0112@gmail.com”
}
*/
import { StorageUtils } from '@/utils'
import { queryUpdateTagsUrl } from '@/config/aws-config.ts'

export class ImgAddTagApi {
  static async addTag(thumbnail_url: string[], tags: string) {
    return ImgAddTagApi.addOrDeleteTag(thumbnail_url, tags, 1)
  }

  static async deleteTag(thumbnail_url: string[], tags: string) {
    return ImgAddTagApi.addOrDeleteTag(thumbnail_url, tags, 0)
  }

  private static async addOrDeleteTag(
    thumbnail_url: string[],
    inputTag: string,
    type: number,
  ): Promise<boolean> {
    try {
      const requestBody = JSON.stringify({
        thumbnail_url,
        type,
        tags: ImgAddTagApi.handlerInputTag(inputTag),
        user_email: StorageUtils.getEmail(),
      })
      // console.error(queryUpdateTagsUrl, requestBody)
      const response = await fetch(queryUpdateTagsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      })
      return response.ok
    } catch (e) {
      console.error(queryUpdateTagsUrl, e)
    }
    return false
  }

  private static handlerInputTag(tag: string): string[] {
    if (!tag) {
      return []
    }
    return tag.split(',').filter((element) => element.trim() !== '')
  }
}
