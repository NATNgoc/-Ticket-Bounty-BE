import { UserRequestBodyProps } from './guard.type'

declare global {
  namespace Express {
    interface Request {
      user?: UserRequestBodyProps
    }
  }
}