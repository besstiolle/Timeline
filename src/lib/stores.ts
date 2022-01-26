import { writable } from 'svelte/store'
import { Struct } from './struct.class';
import { HelperStructTimeline } from './helperStructTimeline.class';
import { CustomLocalStorage } from './customLocalStorage';
import { Constantes } from './constantes.class';
import { HelperStructCards } from './helperStructCards.class';

let timelineStore = new Struct.TimelineStore()
timelineStore.cards = CustomLocalStorage.getCards()
if(!timelineStore.cards){
    timelineStore.cards = new Array<Struct.Card>()
}
export const store = writable(timelineStore);

store.subscribe(val => updateLocalStorage(val))


function updateLocalStorage(timelineStore: Struct.TimelineStore){
    //console.info("updateLocalStorage(val) with values %o", val)
    let currentTimeline = timelineStore.currentTimeline
    let cards = timelineStore.cards
    
    if(currentTimeline){

        //Inserting/Updating information of current Timline into the good card
        HelperStructCards.updateCardsWithTimeline(cards, currentTimeline)

        //Refresh datemin / max and other compiled data
        HelperStructTimeline.refresh(currentTimeline)

        //Persist both current timeline & cards in localstorage
        CustomLocalStorage.save(currentTimeline.key, currentTimeline)
        CustomLocalStorage.save(Constantes.LOCAL_STORAGE.KEY_CARDS, cards)
    }
}