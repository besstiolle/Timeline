import { Timeline, Card } from '$lib/struct.class.svelte';
import { Rights } from '$lib/rights.class';
import { untrack } from 'svelte';
import { FactoryCards } from '$lib/factoryCards';
import { FactoryTimeline } from '$lib/factoryTimeline';
import { CustomLocalStorage } from '$lib/customLocalStorage';
import { LOCAL_STORAGE } from '$lib/constantes';

/**
 * A state class with informations wich need to be persisted.
 */
export class AppState {
    currentTimeline = $state<Timeline>(new Timeline());
    cards = $state<Card[]>([]);
    rights = $state<Rights>(new Rights());

/*     toJSON() {
        console.info("WXXXXXXXXXXXXXXXXXXXXX")
        return { 
			currentTimeline: this.currentTimeline, 
			cards: this.cards,
			rights: this.rights,
			lastUpdatedLocally: this.lastUpdatedLocally,
			lastCommitedRemotely: this.lastCommitedRemotely,
			_cancelRefreshLastUpdatedLocally: this._cancelRefreshLastUpdatedLocally
		};
    } */

}

// Instance réactive unique exportée pour toute l'application
export const appState = new AppState();

export function syncLocalStorage() {
	// 1. Déclencheurs réactifs : Svelte surveille les changements sur ces objets
	const currentTimeline = $state(appState.currentTimeline);
	const cards = [...appState.cards];
	
	// 2. Sauvegarde 

	let updatedCards = cards;

	if (currentTimeline && currentTimeline.isInitiate) {
		//updatedCards = FactoryCards.updateCardsWithTimeline(cards, currentTimeline);

		CustomLocalStorage.save(currentTimeline.key, currentTimeline);
	}

	//CustomLocalStorage.save(LOCAL_STORAGE.KEY_CARDS, updatedCards);

}