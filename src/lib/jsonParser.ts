import { Card, Milestone, Task, Timeline } from './struct.class';
import { JsonParserException } from './timelineException.class';

export class JsonParser {
	/**
	 * Reviver used for JSON.parse(Timeline)
	 * @param key the key for reviver
	 * @param value the value for reviver
	 * @returns the same value of the value processed
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static timelineReviver(key: string, value: any) {
		const COMMONS: string[] = [
			'isInitiate',
			'maxId',
			'viewbox',
			'showAll', // Primitive type field of Timeline
			'position',
			'isShow',
			'label',
			'id',
			'swimline',
			'hasProgress',
			'progress',
			'showToday',
			'showOutOfBounds',
			'dateStartFocus',
			'dateEndFocus',
			'swimlineId',
			'countVisibleTasks',
			'countAllTasks',
			'key',
			'title',
			'differencial',
			'isOnline',
			'ownerKey',
			'writeKey',
			'readKey',
			'tasks',
			'milestones',
			'swimlines', //Nothing to do, it's an array
			'date',
			'dateStart',
			'dateEnd', // date inside object in string format
			'start',
			'end', // date outside object in string format

			//Old key, not used anymore
			'commitInProgress'
		];
		if (COMMONS.includes(key)) {
			return value;
		}

		//Case of object Timeline
		if (key === '') {
			const structTimeline: Timeline = Object.assign(new Timeline(value.key, value.title), value);
			return structTimeline;
		}

		if (typeof value === 'object' && value !== null && (value.label || value.label === '')) {
			//Un object contenant un label => nos objects Task & Milestone
			if (value.date) {
				return new Milestone(value.id as number, value.label, value.date, value.isShow as boolean);
			} else if (value.dateStart) {
				return new Task(
					value.id,
					value.label,
					value.dateStart,
					value.dateEnd,
					value.hasProgress,
					value.progress,
					value.isShow,
					value.swimline,
					value.swimlineId
				);
			} else {
				//This is a re-processed value, we don't need to reprocessing it right now
				return value;
			}
		}

		//We need to test this in last position to be sur to catch object in map & array
		if (/^\d+$/.exec(key)) {
			return value;
		}

		if (value == null) {
			console.info('value was null for key `%o` in JsonReviver.timelineReviver() function', key);
			return value;
		}

		//For security we throw exception if a unexpected duple key/value is detected
		throw new JsonParserException(key, value, 'jsonPaser.timelineReviver');
	}

	/**
	 * Reviver used for JSON.parse(Cards)
	 * @param key the key for reviver
	 * @param value the value for reviver
	 * @returns the same value of the value processed
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static cardsReviver(key: string, value: any) {
		const COMMONS: string[] = [
			'key',
			'title',
			'isOnline' // Primitive type field of Timeline
		];
		if (COMMONS.includes(key)) {
			return value;
		}

		//Case of array Array<Card>
		if (key === '') {
			return value;
		}

		//Case of Date (lastUpdated, ...)
		if (['lastUpdated'].includes(key)) {
			if (value == null) {
				return null;
			}
			return new Date(value as string);
		}

		if (typeof value === 'object' && value !== null && value.key) {
			//Un object contenant un key => notre object Card
			// Because of Date we can't do
			//  > Object.assign(new Card, value)
			const structCard: Card = Object.assign(new Card(value.key, value.title), value);
			return structCard;
		}

		//We need to test this in last position to be sur to catch object in map & array
		if (/^\d+$/.exec(key)) {
			return value;
		}

		if (value == null) {
			console.info('value was null for key `%o` in JsonReviver.cardsReviver() function', key);
			return value;
		}

		//For security we throw exception if a unexpected duple key/value is detected
		throw new JsonParserException(key, value, 'jsonPaser.cardsReviver');
	}
}
