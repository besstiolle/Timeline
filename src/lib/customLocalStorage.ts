import { browser } from "$app/environment"
import { LOCAL_STORAGE } from "./constantes"
import { JsonParser } from "./jsonParser"
import type { Card, Timeline } from "./struct.class"

export class CustomLocalStorage{

    
    /**
     * take the object passed in the <value> parameter and save it locally under the <key> value. The json generater can be manipulated with an optionnal Json replacer
     * @param key the key of mapping   
     * @param replacer the JSON replacer.
     */
    static save(key:string, value:string|Timeline|Array<Card>, replacer?: (this: string|Timeline|Array<Card>, key: string, value: unknown) => unknown): void {
        if(!browser){
            return
        }
        //console.info("insert/update data in key '"+key+"'")
        localStorage.setItem(key, JSON.stringify(value, replacer))
    }

    static getCards() : Array<Card>{
        return this.get(LOCAL_STORAGE.KEY_CARDS, JsonParser.cardsReviver) as Array<Card>
    }

    static getTimeline(key:string):Timeline{
        return this.get(key, JsonParser.timelineReviver) as Timeline
    }

    static getPicto(key:string):string{
        return this.get(LOCAL_STORAGE.KEY_PICTO + key) as string
    }

    

    /**
     * retrive the JSON value for the <key> parameter and return the object parsed with an optionnal Json reviver
     * @param key the key of mapping   
     * @param reviver the JSON reviver
     * @returns the object.
     */
    protected static get(key:string, reviver?: (this: unknown, key: string, value: unknown) => unknown): string|Timeline|Array<Card>|null{
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
    static remove(key: string): void{
        localStorage.removeItem(key)
    }
    
    /**
     * a short-function to purge all the localstorage
     */
    static clear(): void{
        localStorage.clear()
    }
}