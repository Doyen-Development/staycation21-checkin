import { createRouteHandler } from 'uploadthing/next'
import { ourFileRouter } from '@/lib/uploadthing'

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    // v7 renamed this from UPLOADTHING_SECRET to UPLOADTHING_TOKEN.
    // Falls back to UPLOADTHING_SECRET so you don't have to rename
    // anything already set in Vercel.
    token: process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET,
  },
})
