import { writable } from 'svelte/store'
import { Struct } from './struct.class';

import { CustomLocalStorage } from './customLocalStorage';
import { Constantes } from './constantes';
import { FactoryCards } from './factoryCards';
import { FactoryTimeline } from './factoryTimeline';
import { create } from './timelineRepository';


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
        FactoryCards.updateCardsWithTimeline(cards, currentTimeline)

        //Refresh datemin / max and other compiled data
        FactoryTimeline.refresh(currentTimeline)

        //Refresh remote instance
        if(currentTimeline.isOnline && (currentTimeline.ownerKey || currentTimeline.writeKey)){
            create(currentTimeline).then((json) => {
                console.info("create.then")
                console.info(json)
            }).catch((err) => {
                console.info("create.catch")
                console.info(err)
            }).finally(()=>{
                console.info("create.finnaly")
            })
        }

        //Persist both current timeline & cards in localstorage
        CustomLocalStorage.save(currentTimeline.key, currentTimeline)
        CustomLocalStorage.save(Constantes.LOCAL_STORAGE.KEY_CARDS, cards)
    }
}