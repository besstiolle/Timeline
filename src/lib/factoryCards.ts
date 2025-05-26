import { Card, Timeline } from "./struct.class";

export class FactoryCards {

    /**
	 * copy information from timline (title/key) and copy them into the (new?) card.
	 * @param cards the Array<Card> to update
	 * @param timeline the Timeline to use to updating cards
	 */
	static updateCardsWithTimeline(cards:Array<Card>, timeline:Timeline):void{
		
		//Retrive the index of the good card or -1 if it doesn't exist
		const positionInCards:number|null = FactoryCards.getIndexByKey(cards, timeline.key)

		//If it doesn't exist, we create it
		if(positionInCards === null){
			cards.push(new Card(timeline.key, timeline.title))	
		} else {
			cards[positionInCards].title = timeline.title	
			cards[positionInCards].lastUpdated = new Date()
			cards[positionInCards].isOnline = timeline.isOnline
		}
	}

	/**
	 * return the index of the array of Cards or null if it's key is not found
	 * @param cards the Array<Card> to look for
	 * @param key the Timeline.key to use to find card
	 */
	static getIndexByKey(cards:Array<Card>, key:string):number|null{
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
	 * @param cards the Array<Card> to look for
	 * @param key the Timeline.title to use to find card
	 */
	 static getFirstIndexByTitle(cards:Array<Card>, title:string):number|null{
		//Retrive the index of the good card or -1 if it doesn't exist
		for(let i:number=0; i< cards.length; i++){
			if(cards[i].title === title){
				return i
			}
		}
		return null
	}	
}