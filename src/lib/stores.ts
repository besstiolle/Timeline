import { writable } from 'svelte/store'
import { Struct } from '$lib/struct.class'
import { FactoryTimeline } from '$lib/factoryTimeline'
import { CustomLocalStorage } from '$lib/customLocalStorage'
import { Constantes } from '$lib/constantes'
import { FactoryCards } from '$lib/factoryCards'

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

        //Persist both current timeline & cards in localstorage
        CustomLocalStorage.save(currentTimeline.key, currentTimeline)
        CustomLocalStorage.save(Constantes.LOCAL_STORAGE.KEY_CARDS, cards)
    }
}