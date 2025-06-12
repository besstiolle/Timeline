// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: Database;
			startTimer: number; //Used for internal timer (for speed analytics)
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
