import { ZodSchema } from 'zod'

import { AppRequest, AppResponse } from '@/@types/express'

export function BodyMiddleware(schema: ZodSchema) {
  return (_this: any, methodName: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value as any
    
    descriptor.value = function (req: AppRequest, res: AppResponse, ...args: any) {
      let body = req.body
      
      const contentType = req.headers['content-type']?.split(';')[0] ?? ''
      
      if(contentType === 'application/json') {
        body = req.body
      } else if (contentType === 'multipart/form-data') {
        try {
          body = req.body.data ? JSON.parse(req.body.data) : {}
        } catch (error) {
          return res.status(400).json({
            message: 'Invalid JSON in form data',
          })
        }
      }
      
      console.log(body)
      const validationResult = schema.safeParse(body)
      
      if(!validationResult.success) {
        return res.status(400).json({ 
          message: validationResult.error.issues.map(issue => `[${issue.input}] ${issue.message}`).join(', '),
        })
      }
      
      req.body = validationResult.data
      
      return originalMethod.call(this, req, res, ...args)
    }
  }
}