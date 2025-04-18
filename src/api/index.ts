export * from './UserApi.ts'
export * from './ImgAddTagApi.ts'
export * from './ImgDeleteApi.ts'
export * from './ImgQueryApi.ts'
export * from './ImgUploadApi.ts'

export interface IPics {
  full_image_url: string[]
  thumbnail_url: string[]
}
