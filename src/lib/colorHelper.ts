import { Helpers } from "./helpers"

const classBright = `{0}-slate-900 dark:{0}-slate-100`
const classNormal = `{0}-slate-600 dark:{0}-slate-400`
const classDarker = `{0}-slate-600 dark:{0}-slate-400`

export function fillBright(){
    return Helpers.printf(classBright,['fill'])
}
export function fillNormal(){
    return Helpers.printf(classNormal,['fill'])
}
export function strokeNormal(){
    return Helpers.printf(classNormal,['stroke'])
}
export function strokeBright(){
    return Helpers.printf(classBright,['stroke'])
}