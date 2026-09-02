import { browser } from '$app/environment';
import { LOCAL_STORAGE } from './constantes';
import { JsonParser } from './jsonParser';
import type { Card, Timeline } from './struct.class.svelte';

export class CustomLocalStorage {
	/**
	 * take the object passed in the <value> parameter and save it locally under the <key> value. The json generater can be manipulated with an optionnal Json replacer
	 * @param key the key of mapping
	 * @param replacer the JSON replacer.
	 */
	static save(
		key: string,
		value: string | Timeline | Array<Card>,
		replacer?: (this: string | Timeline | Array<Card>, key: string, value: unknown) => unknown
	): void {
		if (!browser) {
			return;
		}
		const json = JSON.stringify(value, replacer)
		if(LOCAL_STORAGE.KEY_CARDS === key){
			//console.info("insert/update data in cards ", json)
		} else {
			//console.info("insert/update data in key", key, value)	
		}
		localStorage.setItem(key, json);
		
	}

	static getCards(): Array<Card> {
		return this.get(LOCAL_STORAGE.KEY_CARDS, JsonParser.cardsReviver) as Array<Card>;
	}

	static getTimeline(key: string): Timeline {
		return this.get(key, JsonParser.timelineReviver) as Timeline;
	}

	static getPicto(key: string): string {
		return this.get(LOCAL_STORAGE.KEY_PICTO + key) as string;
	}

	/**
	 * retrive the JSON value for the <key> parameter and return the object parsed with an optionnal Json reviver
	 * @param key the key of mapping
	 * @param reviver the JSON reviver
	 * @returns the object.
	 */
	protected static get(
		key: string,
		reviver?: (this: unknown, key: string, value: unknown) => unknown
	): string | Timeline | Array<Card> | null {
		if (!browser) {
			return null;
		}

		const localValue = localStorage.getItem(key)

		if (localValue === null) {
			return null;
		}

		//console.info("get for key '%o'", key)
		let result:string | Timeline | Card[] | null = null
		try{
			result = JSON.parse(localValue as string, reviver)
		} catch(e){
			console.warn('JsonParserException for key', key, " with value ", localValue)
			console.warn('The exception was', e)
		}
		return result;
		
	}

	/**
	 * a short-function to purge all the localstorage
	 * @param key the key of mapping
	 */
	static remove(key: string): void {
		localStorage.removeItem(key);
	}

	/**
	 * a short-function to purge all the localstorage
	 */
	static clear(): void {
		localStorage.clear();
	}
}
