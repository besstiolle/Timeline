import { GRID } from '$lib/constantes';
import type { Timeline } from '$lib/struct.class';

export interface markerInterface {
	toDisplay: boolean;
	todayColor: string;
	widthToday: number;
}

export function getMarker(timeline: Timeline): markerInterface {
	const toDisplay: boolean =
		timeline.getStart() <= new Date() && timeline.getEnd() >= new Date() && timeline.showToday;

	const todayColor = '#D41E24';

	const widthToday =
		((new Date().getTime() - timeline.getStartTime()) /
			(timeline.getEndTime() - timeline.getStartTime())) *
		GRID.MIDDLE_WIDTH;

	return {
		toDisplay: toDisplay,
		todayColor: todayColor,
		widthToday: widthToday
	};
}
