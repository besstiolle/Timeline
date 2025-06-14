import type { Milestone, Task, Timeline } from './struct.class';

export function timelineToObject(timeline: Timeline): object {
	return {
		version: VERSION,
		title: timeline.title,
		tasks: purgeTasksToToml(timeline.tasks),
		milestones: purgeMilestoneToToml(timeline.milestones)
	};
}

function purgeTasksToToml(tasks: Array<Task>) {
	const res: object[] = [];
	tasks.forEach((task) => {
		res.push({
			label: task.label,
			start: task.dateStart,
			end: task.dateEnd,
			hasProgress: task.hasProgress,
			progress: task.progress,
			swimline: task.swimline,
			isShow: task.isShow
		});
	});
	return res;
}
function purgeMilestoneToToml(milestones: Array<Milestone>) {
	const res: object[] = [];
	milestones.forEach((milestone) => {
		res.push({
			label: milestone.label,
			date: milestone.date,
			isShow: milestone.isShow
		});
	});
	return res;
}

export function goToml(o: object): string {
	const type: string = getType(o);
	if (type !== TYPE.OBJECT) {
		throw 'goToml need a object to work. type ' + type + ' was provided : ';
	}
	return __goTomlObject(null, o, 's');
}

const RC: string = '\r\n';
const QUOTES: string = '"';
const REGEX_QUOTES = new RegExp('"', 'g');
const VERSION: string = '1.0';

function __goTomlObject(
	objectKey: string | null = null,
	o: object,
	previousKeys: string = ''
): string {
	let type = null;
	let buffer = '';
	let buffer2 = '';

	if (previousKeys !== '') {
		previousKeys += '.';
	}

	if (objectKey) {
		buffer += `[${previousKeys}${objectKey}]` + RC;
	}

	let anyValue: number | string | boolean | object;
	Object.keys(o).map((key) => {
		// @ts-expect-error Obviously, it's exist...
		anyValue = o[key];
		type = getType(anyValue);
		switch (type) {
			case TYPE.ARRAY:
				buffer += __goTomlArray(key, <Array<number | string | boolean | object>>anyValue) + RC;
				break;
			case TYPE.NUMBER:
				buffer += __goTomlNumber(key, <string>anyValue) + RC;
				break;
			case TYPE.BOOLEAN:
				buffer += __goTomlBoolean(key, <string>anyValue) + RC;
				break;
			case TYPE.STRING:
				buffer += __goTomlString(key, <string>anyValue) + RC;
				break;
			case TYPE.DATE:
				buffer += __goTomlDate(key, <Date>anyValue) + RC;
				break;
			case TYPE.OBJECT:
				buffer +=
					__goTomlObject(key, <object>anyValue, objectKey ? previousKeys + objectKey : '') + RC;
				break;
			case TYPE.ARRAY_OF_OBJECTS:
				buffer2 +=
					__goTomlArrayOfObjects(
						key,
						<Array<object>>anyValue,
						objectKey ? previousKeys + objectKey : ''
					) + RC;
				break;
			case TYPE.NULL:
				break;
			default:
				console.error("type %o wasn't expected", type);
		}
	});
	return buffer + buffer2;
}

function __goTomlArray(key: string, o: Array<number | string | boolean | object>): string {
	let first = true;
	let type = null;
	let buffer = '';
	o.forEach((item: number | string | boolean | object) => {
		if (!first) {
			buffer += ' , ';
		}
		first = false;
		type = getType(item);
		switch (type) {
			case TYPE.NUMBER:
			case TYPE.BOOLEAN:
				buffer += item;
				break;
			case TYPE.STRING:
				buffer += QUOTES + (item as string).replace(REGEX_QUOTES, '\\"') + QUOTES;
				break;
			case TYPE.DATE:
				buffer += QUOTES + new Date(item as string).toISOString() + QUOTES;
				break;
			case TYPE.ARRAY:
				buffer += __goTomlArray('', <Array<number | string | boolean | object>>item);
				break;
			default:
				console.error("type %o wasn't expected in a simple Array", type);
		}
	});
	if (key !== '') {
		return `${key} = [ ${buffer} ]`;
	} else {
		return `[ ${buffer} ]`;
	}
}
function __goTomlNumber(key: string, o: string): string {
	return `${key} = ${o}`;
}
function __goTomlBoolean(key: string, o: string): string {
	return `${key} = ${o}`;
}
function __goTomlString(key: string, o: string): string {
	return `${key} = ${QUOTES}${o.replace(REGEX_QUOTES, '\\"')}${QUOTES}`;
}
function __goTomlDate(key: string, o: Date): string {
	return `${key} = ${QUOTES}${o.toISOString()}${QUOTES}`;
}

function __goTomlArrayOfObjects(key: string, o: Array<object>, previousKeys: string = ''): string {
	let buffer: string = '';

	if (previousKeys !== '') {
		previousKeys += '.';
	}

	o.forEach((item) => {
		buffer += `[[${previousKeys}${key}]]` + RC;
		buffer += __goTomlObject(null, item) + RC;
	});
	buffer += RC;
	return buffer;
}

const TYPE = {
	STRING: 'STRING',
	ARRAY: 'ARRAY',
	ARRAY_OF_OBJECTS: 'NESTED_OBJET_IN_ARRAY',
	NUMBER: 'NUMBER',
	BOOLEAN: 'BOOLEAN',
	OBJECT: 'OBJECT',
	DATE: 'DATE',
	NULL: 'NULL'
};

function getType(
	o: number | string | boolean | object | Array<number | string | boolean | object>
): string {
	if (o === null) {
		return TYPE.NULL;
	} else if (
		Array.isArray(o) &&
		(<Array<number | string | boolean | object>>o).length &&
		getType(<Array<number | string | boolean | object>>o[0]) === TYPE.OBJECT
	) {
		return TYPE.ARRAY_OF_OBJECTS;
	} else if (Array.isArray(o)) {
		return TYPE.ARRAY;
	} else {
		const type = typeof o;
		switch (type) {
			case 'number':
				return TYPE.NUMBER;
			case 'string':
				return TYPE.STRING;
			case 'boolean':
				return TYPE.BOOLEAN;
			case 'object':
				if (o instanceof Date) {
					return TYPE.DATE;
				}
				return TYPE.OBJECT;
			default:
				console.error("type %o wasn't expected", type);
		}
	}

	//Default statement
	return TYPE.NULL;
}
