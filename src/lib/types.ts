
/**
 * This file must only contain type definitions used for the Svelte server-side AND client-side portion. 
 * Use $lib/server/types.ts if the code is specific to the server
 */

export interface ResponseWithMeta {
	meta: {
		ts: number;
		duration: number; //duration of execution on the server side in milliseconds
	};
	data: object;
}
