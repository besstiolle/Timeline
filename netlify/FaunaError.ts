export class FaunaError extends Error {
    
    code:string
    statusCode:number
    message:string
    map:Map<string, number> = new Map ([
      ["instance not unique",409],
      ["authentication failed",401],
      ["unauthorized",401],
      ["instance not found",404],
      ["permission denied",403]
    ])
  
    constructor (error) {
      super();
  
      const errors = error.requestResult.responseContent.errors;
  
      this.code = errors[0].code;
      this.message = errors[0].description;
      this.statusCode = 500;

      if(this.map.has(this.code)){
        this.statusCode = this.map.get(this.code)
      }
    }

    return(){
      return {
        statusCode: this.code,
        body: JSON.stringify({ message: '['+ this.code +'] : ' + this.message }),
      } 
    }
  }
  