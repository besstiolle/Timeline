import { writable } from 'svelte/store'
import { Struct } from './struct.class';

import { CustomLocalStorage } from './customLocalStorage';
import { Constantes } from './constantes';
import { FactoryCards } from './factoryCards';
import { FactoryTimeline } from './factoryTimeline';


let timelineStore = new Struct.TimelineStore()
timelineStore.cards = CustomLocalStorage.getCards()
if(!timelineStore.cards){
    timelineStore.cards = new Array<Struct.Card>()
}
export const store = writable(timelineStore);

store.subscribe(val => updateLocalStorage(val))


function updateLocalStorage(timelineStore: Struct.TimelineStore){
    //console.info("updateLocalStorage(val) with key %o", (timelineStore&&timelineStore.currentTimeline&&timelineStore.currentTimeline.key)?timelineStore.currentTimeline.key:"N/A")
    let currentTimeline = timelineStore.currentTimeline
    let cards = timelineStore.cards
    if(!timelineStore._cancelRefreshLastUpdatedLocally){
        timelineStore.lastUpdatedLocally = new Date().getTime() * 1000
    } else {
        timelineStore._cancelRefreshLastUpdatedLocally = false
    }
    
    if(currentTimeline){

        //Inserting/Updating information of current Timline into the good card
        FactoryCards.updateCardsWithTimeline(cards, currentTimeline)

        //Refresh datemin / max and other compiled data
        FactoryTimeline.refresh(currentTimeline)

        //Persist both current timeline & cards in localstorage
        CustomLocalStorage.save(currentTimeline.key, currentTimeline)
        CustomLocalStorage.save(Constantes.LOCAL_STORAGE.KEY_CARDS, cards)
    }
}