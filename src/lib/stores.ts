import { writable } from 'svelte/store'
import { Struct } from './struct.class';

import { CustomLocalStorage } from './customLocalStorage';
import { FactoryCards } from './factoryCards';
import { FactoryTimeline } from './factoryTimeline';
import { LOCAL_STORAGE } from './constantes';
import { Rights } from './rights.class';



let cards = CustomLocalStorage.getCards()
if(!cards){
    cards = new Array<Struct.Card>()
}
const timeline = new Struct.Timeline()
const rights = new Rights(null)

const timelineStore = new Struct.TimelineStore(cards, timeline, rights)
export const store = writable(timelineStore);

store.subscribe(val => updateLocalStorage(val))


function updateLocalStorage(timelineStore: Struct.TimelineStore){
    //console.info("updateLocalStorage(val) with key %o", (timelineStore&&timelineStore.currentTimeline&&timelineStore.currentTimeline.key)?timelineStore.currentTimeline.key:"N/A")
    const currentTimeline = timelineStore.currentTimeline
    const cards = timelineStore.cards
    if(!timelineStore._cancelRefreshLastUpdatedLocally){
        timelineStore.lastUpdatedLocally = new Date().getTime()
    } else {
        timelineStore._cancelRefreshLastUpdatedLocally = false
    }
    
    if(currentTimeline && currentTimeline.isInitiate){
        
        //Inserting/Updating information of current Timline into the good card
        FactoryCards.updateCardsWithTimeline(cards, currentTimeline)

        //Refresh datemin / max and other compiled data
        FactoryTimeline.refresh(currentTimeline)

        //Persist both current timeline & cards in localstorage
        CustomLocalStorage.save(currentTimeline.key, currentTimeline)
    }
    CustomLocalStorage.save(LOCAL_STORAGE.KEY_CARDS, cards)
}