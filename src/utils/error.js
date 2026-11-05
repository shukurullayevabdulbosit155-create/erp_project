export class  ErrorException extends Error{
      constructor(status,message){
            super()
            this.status = status
            this.message = message
            this.name = "UnauthrizedError"
      }
}