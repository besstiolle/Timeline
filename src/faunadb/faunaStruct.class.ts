import type { Struct } from "$lib/struct.class"

export class FaunaStruct {

    readKey: string = null
    writeKey: string = null
    ownerKey: string = null
    timeline : Struct.Timeline = null
    hash: string = null

    /*constructor(timeline: Struct.Timeline, hash: string, ownerKey?: string, writeKey?:string, readKey?: string){
        this.timeline = timeline
        this.hash = hash
        this.ownerKey = ownerKey
        this.writeKey = writeKey
        this.readKey = readKey
    }*/
    constructor(){}
}