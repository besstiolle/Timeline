import { Struct } from "./struct.class";

export module FactoryCards {

    /**
	 * copy information from timline (title/key) and copy them into the (new?) card.
	 * @param cards the Array<Struct.Card> to update
	 * @param timeline the Struct.Timeline to use to updating cards
	 */
	export function updateCardsWithTimeline(cards:Array<Struct.Card>, timeline:Struct.Timeline):void{
		//TODO : remove it.
		if(timeline == null){
			console.error("Struct.Timeline was null in function FactoryCards.updateCardsWithTimeline()")
			return
		}

		//Retrive the index of the good card or -1 if it doesn't exist
		let positionInCards:number = -1
		for(let i:number=0; i< cards.length; i++){
			if(cards[i].key === timeline.key){
				positionInCards = i
			}
		}

		//If it doesn't exist, we create it
		if(positionInCards === -1){
			cards.push(new Struct.Card(timeline.key, timeline.title))	
		} else {
			cards[positionInCards].title = timeline.title	
			cards[positionInCards].lastUpdated = new Date()
		}
	}
}