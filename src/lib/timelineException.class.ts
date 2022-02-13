import { Helpers } from "./helpers"

export class NotFoundException extends Error {
  args: any[]
  constructor (...args:any) {
    super(Helpers.printf("The entity {0} with the id {1} wasn't found", args))
    this.args = args
    console.error(super.message)
  }
}
  