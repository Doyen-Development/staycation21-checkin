import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
  idDocument: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
    pdf:   { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      // No auth needed on the form — anyone with the link can upload
      // Files are private by default in Uploadthing
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      // file.url is the private URL stored in Uploadthing
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
