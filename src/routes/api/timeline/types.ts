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

export interface ResponseWithMeta {
	meta: {
		ts: number;
	};
	data: object;
}
