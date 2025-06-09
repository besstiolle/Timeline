import { writable } from 'svelte/store';

import { CustomLocalStorage } from './customLocalStorage';
import { FactoryCards } from './factoryCards';
import { FactoryTimeline } from './factoryTimeline';
import { LOCAL_STORAGE } from './constantes';
import { Rights } from './rights.class';
import { Timeline, TimelineStore, type Card } from './struct.class';

let cards = CustomLocalStorage.getCards();
if (!cards) {
	cards = new Array<Card>();
}
const timeline = new Timeline();
const rights = new Rights(null);

const timelineStore = new TimelineStore(cards, timeline, rights);
export const store = writable(timelineStore);

store.subscribe((val) => updateLocalStorage(val));

function updateLocalStorage(timelineStore: TimelineStore) {
	//console.info("updateLocalStorage(val) with key %o", (timelineStore&&timelineStore.currentTimeline&&timelineStore.currentTimeline.key)?timelineStore.currentTimeline.key:"N/A")
	let currentTimeline = timelineStore.currentTimeline;
	let cards = timelineStore.cards;
	if (!timelineStore._cancelRefreshLastUpdatedLocally) {
		timelineStore.lastUpdatedLocally = new Date().getTime();
	} else {
		timelineStore._cancelRefreshLastUpdatedLocally = false;
	}

	if (currentTimeline && currentTimeline.isInitiate) {
		//Inserting/Updating information of current Timline into the good card
		cards = FactoryCards.updateCardsWithTimeline(cards, currentTimeline);

		//Refresh datemin / max and other compiled data
		currentTimeline = FactoryTimeline.refresh(currentTimeline);

		//Persist both current timeline & cards in localstorage
		CustomLocalStorage.save(currentTimeline.key, currentTimeline);
	}
	CustomLocalStorage.save(LOCAL_STORAGE.KEY_CARDS, cards);
}
