import { Timeline, Card } from '$lib/struct.class.svelte';
import { Rights } from '$lib/rights.class';
import { untrack } from 'svelte';
import { FactoryCards } from '$lib/factoryCards';
import { FactoryTimeline } from '$lib/factoryTimeline';
import { CustomLocalStorage } from '$lib/customLocalStorage';
import { GRID, LOCAL_STORAGE } from '$lib/constantes';
import { Helpers } from '$lib/helpers';

/**
 * A state class with informations wich need to be persisted.
 */
export class AppState {
    currentTimeline = $state<Timeline>(new Timeline());
    cards = $state<Card[]>([]);
    rights = $state<Rights>(new Rights());
}

// Instance réactive unique exportée pour toute l'application
export const appState = new AppState();

export function syncLocalStorage() {
	let cards = [...appState.cards];

	if (appState.currentTimeline && appState.currentTimeline.isInitiate) {

		CustomLocalStorage.save(appState.currentTimeline.key, appState.currentTimeline);
		cards = FactoryCards.updateCardsWithTimeline(cards, appState.currentTimeline);
	}

	CustomLocalStorage.save(LOCAL_STORAGE.KEY_CARDS, cards);

}