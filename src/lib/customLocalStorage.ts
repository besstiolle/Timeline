import { browser } from "$app/environment"
import { LOCAL_STORAGE } from "./constantes"
import { JsonParser } from "./jsonParser"
import type { Struct } from "./struct.class"

export namespace CustomLocalStorage{

    
    /**
     * take the object passed in the <value> parameter and save it locally under the <key> value. The json generater can be manipulated with an optionnal Json replacer
     * @param key the key of mapping   
     * @param replacer the JSON replacer.
     */
    export function save(key:string, value:string|Struct.Timeline|Array<Struct.Card>, replacer?: (this: string|Struct.Timeline|Array<Struct.Card>, key: string, value: string|Struct.Timeline|Array<Struct.Card>) => unknown): void {
        if(!browser){
            return
        }
        //console.info("insert/update data in key '"+key+"'")
        localStorage.setItem(key, JSON.stringify(value, replacer))
    }

    export function getCards() : Array<Struct.Card>{
        return get(LOCAL_STORAGE.KEY_CARDS, JsonParser.cardsReviver) as Array<Struct.Card>
    }

    export function getTimeline(key:string):Struct.Timeline{
        return get(key, JsonParser.timelineReviver) as Struct.Timeline
    }

    export function getPicto(key:string):string{
        return get(LOCAL_STORAGE.KEY_PICTO + key) as string
    }

    

    /**
     * retrive the JSON value for the <key> parameter and return the object parsed with an optionnal Json reviver
     * @param key the key of mapping   
     * @param reviver the JSON reviver
     * @returns the object.
     */
    function get(key:string, reviver?: (this: unknown, key: string, value: unknown) => unknown): string|Struct.Timeline|Array<Struct.Card>|null{
        if(!browser){
            return null
        }

        if(localStorage.getItem(key) === null){
            return null
        }

        //console.info("get for key '%o'", key)
        return JSON.parse(localStorage.getItem(key) as string, reviver)
    }

    /**
     * a short-function to purge all the localstorage
     * @param key the key of mapping     
     */
    export function remove(key: string): void{
        localStorage.removeItem(key)
    }
    
    /**
     * a short-function to purge all the localstorage
     */
    export function clear(): void{
        localStorage.clear()
    }
}