import { Timeline, Card } from '$lib/struct.class.svelte';
import { Rights } from '$lib/rights.class';
import { CustomLocalStorage } from '$lib/customLocalStorage';
import { volatileAppState } from './volatileAppState.svelte';
import { LOCAL_STORAGE } from '$lib/constantes';

/**
 * A state class with informations wich need to be persisted.
 */
export class AppState {
    currentTimeline = $state<Timeline>(new Timeline());
    cards = $state<Card[]>(CustomLocalStorage.getCards());
    rights = $state<Rights>(new Rights());
}

// Instance réactive unique exportée pour toute l'application
export const appState = new AppState();

export function syncLocalStorage() {

	if (appState.currentTimeline && appState.currentTimeline.isInitiate) {
		CustomLocalStorage.save(appState.currentTimeline.key, appState.currentTimeline);
	}

	CustomLocalStorage.save(LOCAL_STORAGE.KEY_CARDS, appState.cards);

	//Update volatileState
	volatileAppState.lastUpdatedLocally = (new Date()).getTime()

}