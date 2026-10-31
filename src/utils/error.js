export class ConflictError extends Error{
      constructor(status,message){
            super()
            this.status = status
            this.message = message
            this.name = "ConflictError"
      }
}
export class NotFoundError extends Error{
      constructor(status,message){
            super()
            this.status = status
            this.message = message
            this.name = "NotFoundError"
      }
}
export class ValidationError extends Error{
      constructor(status,message){
            super()
            this.status = status
            this.message = message
            this.name = "ValidationError"
      }
}
export class InternalServerError extends Error{
      constructor(status,message){
            super()
            this.status = status
            this.message = message
            this.name = "InternalServerError"
      }
}