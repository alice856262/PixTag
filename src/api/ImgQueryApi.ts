import { StorageUtils } from '@/utils'
import { ImgUploadApi, IPics } from '@/api/index.ts'
import { queryByPic, queryByTagsUrl } from '@/config/aws-config.ts'

export class ImgQueryApi {
  static async query(tags: string = ''): Promise<IPics> {
    try {
      const requestBody = JSON.stringify({
        ...ImgQueryApi.processTags(tags),
        user_email: StorageUtils.getEmail(),
      })
      // console.error(queryByTagsUrl, requestBody)
      const response = await fetch(queryByTagsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      })
      if (!response.ok) {
        return {
          thumbnail_url: [],
          full_image_url: [],
        }
      }
      const res = await response.json()
      return res as IPics
    } catch (e) {
      console.error(queryByTagsUrl, e)
    }
    return {
      thumbnail_url: [],
      full_image_url: [],
    }
  }

  static async queryByPic(rawFile: File): Promise<IPics> {
    try {
      const file = await ImgUploadApi.fileToBase64(rawFile)
      const requestBody = JSON.stringify({
        file,
        user_email: StorageUtils.getEmail(),
      })
      // console.error(queryByPic, requestBody)
      const response = await fetch(queryByPic, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      })
      if (!response.ok) {
        return {
          thumbnail_url: [],
          full_image_url: [],
        }
      }
      const res = await response.json()
      return res as IPics
    } catch (e) {
      console.error(queryByTagsUrl, e)
    }
    return {
      thumbnail_url: [],
      full_image_url: [],
    }
  }

  /**
   *
   * input person,person,cat
   *
   * output {tags:[person,cat],count:[2,1]}
   *
   * @param input
   */
  static processTags(input: string): {
    tags: string[]
    count: number[]
  } {
    let inputArray: string[] = []
    if (input.trim().length === 0) {
      return { tags: [], count: [] }
    }
    inputArray = input.split(',').filter((element) => element.trim() !== '')

    const elementCountMap: Record<string, number> = {}
    inputArray.forEach((element) => {
      if (elementCountMap[element]) {
        elementCountMap[element]++
      } else {
        elementCountMap[element] = 1
      }
    })

    const tags: string[] = []
    const count: number[] = []

    for (const element in elementCountMap) {
      tags.push(element)
      count.push(elementCountMap[element])
    }

    return { tags, count }
  }
}
