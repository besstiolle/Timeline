import { Struct } from "./struct.class";

export namespace FactoryCards {

    /**
	 * copy information from timline (title/key) and copy them into the (new?) card.
	 * @param cards the Array<Struct.Card> to update
	 * @param timeline the Struct.Timeline to use to updating cards
	 */
	export function updateCardsWithTimeline(cards:Array<Struct.Card>, timeline:Struct.Timeline):void{
		
		//Retrive the index of the good card or -1 if it doesn't exist
		let positionInCards:number|null = FactoryCards.getIndexByKey(cards, timeline.key)

		//If it doesn't exist, we create it
		if(positionInCards === null){
			cards.push(new Struct.Card(timeline.key, timeline.title))	
		} else {
			cards[positionInCards].title = timeline.title	
			cards[positionInCards].lastUpdated = new Date()
			cards[positionInCards].isOnline = timeline.isOnline
		}
	}

	/**
	 * return the index of the array of Cards or null if it's key is not found
	 * @param cards the Array<Struct.Card> to look for
	 * @param key the Struct.Timeline.key to use to find card
	 */
	export function getIndexByKey(cards:Array<Struct.Card>, key:string):number|null{
		//Retrive the index of the good card or -1 if it doesn't exist
		for(let i:number=0; i< cards.length; i++){
			if(cards[i].key === key){
				return i
			}
		}
		return null
	}

	
	/**
	 * return the first index of the array of Cards or null if it's title is not found
	 * @param cards the Array<Struct.Card> to look for
	 * @param key the Struct.Timeline.title to use to find card
	 */
	 export function getFirstIndexByTitle(cards:Array<Struct.Card>, title:string):number|null{
		//Retrive the index of the good card or -1 if it doesn't exist
		for(let i:number=0; i< cards.length; i++){
			if(cards[i].title === title){
				return i
			}
		}
		return null
	}

	
}