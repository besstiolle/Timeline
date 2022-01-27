import { browser } from "$app/env"
import { Constantes } from "$lib/constantes"
import { JsonParser } from "$lib/jsonParser"
import type { Struct } from "$lib/struct.class"

export module CustomLocalStorage{

    
    /**
     * take the object passed in the <value> parameter and save it locally under the <key> value. The json generater can be manipulated with an optionnal Json replacer
     * @param key the key of mapping   
     * @param replacer the JSON replacer.
     */
    export function save(key:string, value:any, replacer?: (this: any, key: string, value: any) => any): void {
        if(!browser){
            return
        }
        //console.info("insert/update data in key '"+key+"'")
        localStorage.setItem(key, JSON.stringify(value, replacer))
    }

    export function getCards() : Array<Struct.Card>{
        return get(Constantes.LOCAL_STORAGE.KEY_CARDS, JsonParser.cardsReviver)
    }

    export function getTimeline(key:string):Struct.Timeline{
        return get(key, JsonParser.timelineReviver)
    }

    

    /**
     * retrive the JSON value for the <key> parameter and return the object parsed with an optionnal Json reviver
     * @param key the key of mapping   
     * @param reviver the JSON reviver
     * @returns the object.
     */
    function get(key:string, reviver?: (this: any, key: string, value: any) => any): any{
        if(!browser){
            return null
        }

        if(localStorage.getItem(key) === null){
            return null
        }

        //console.info("get for key '%o'", key)
        return JSON.parse(localStorage.getItem(key), reviver)
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