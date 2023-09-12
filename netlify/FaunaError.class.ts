export class FaunaError extends Error {
    
    code:string
    statusCode:number
    message:string
    map:Map<string, number> = new Map ([
      ["instance not unique",409],
      ["instance already exists",409],
      ["authentication failed",401],
      ["unauthorized",401],
      ["instance not found",404],
      ["permission denied",403],
      ["Malformed Request Body",400],
      ["Malformed Request parameter",400],
      ["ERR_HTTP2_STREAM_CANCEL", 404]
    ])
  
    constructor (error) {
      super();

      console.error(error)
  
      if(error.constructor.name == 'Array'){
        this.code = error[0];
        this.message = error[1];
      }
      else if (typeof error == 'string'){
        this.code = error;
        this.message = error;
      } else if (error.code && typeof error.code == 'string'){
        this.code = error.code as string;
        this.message = error;
      } else {
        const errors = error.requestResult.responseContent.errors;
        this.code = errors[0].code;
        this.message = errors[0].description;
      }

      this.statusCode = 500;

      if(this.map.has(this.code)){
        this.statusCode = this.map.get(this.code) as number
      }
    }

    return(){
      return {
        statusCode: this.statusCode,
        body: JSON.stringify({ code : this.code, message: this.message }),
      } 
    }
  }
  