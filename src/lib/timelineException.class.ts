import { Helpers } from "./helpers"

export class NotFoundException extends Error {
  args: any[]
  constructor (...args:any) {
    super(Helpers.printf("The entity {0} with the id {1} wasn't found", args))
    this.args = args
    console.error(super.message)
  }
}
export class JsonParserException extends Error {
  args: any[]
  constructor (...args:any) {
    super(Helpers.printf("key : `{0}` with value `{1}` was not expected in {2} function", args))
    this.args = args
    console.error(super.message)
  }
}
export class DuplicateEntityException extends Error {
  args: any[]
  constructor (...args:any) {
    super(Helpers.printf("The entity {0} with the id {1} already exist", args))
    this.args = args
    console.error(super.message)
  }
}
  