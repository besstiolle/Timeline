/**
 * This file must only contain type definitions for the Svelte server-side portion. 
 * Any sharing in the client-side portion of this code will result in an warn & an error during production build 
 *    	Warn => [plugin vite:resolve] Module "node:async_hooks" has been externalized for browser compatibility,
 * 		Error => Could not load /app/src/hooks.server.ts [...]
 */

/**
 * Represent the database structure to storage a StructTimeline (in a raw json format) + few information
 *
 * The raw structure allow us to work with sqlite like a key/value database as we don't need to operate query with a lot of informations.
 * In the same time, having a raw json let us imagine changing structure of new Timeline in the futur.
 */
export interface StructTimelineInDbInterface {
	key: string;
	ownerkey: string | null;
	writekey: string | null;
	readKey: string | null;
	createdDateTime: number;
	json: string;
}
