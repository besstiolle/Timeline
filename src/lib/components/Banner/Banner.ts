import { DAYS, DIFF, GRID, MONTHS } from '$lib/constantes';
import { appState } from '$lib/state/appState.svelte';

export interface jalonInterface {
	left: number;
	label: string;
	classCss: string;
}

export function getJalons(): jalonInterface[] {
	let dateIncremental = new Date(appState.currentTimeline.start);
	const msStart = appState.currentTimeline.start.getTime();
	const msEnd = appState.currentTimeline.end.getTime();
	const differencial = appState.currentTimeline.differencial;

	let i = 0;
	const jalons: jalonInterface[] = [];
	let innerClassCss: string;
	let innerLabel: number | string = '';
	let left: number;

	while (i < 100 && appState.currentTimeline.end.getTime() >= dateIncremental.getTime()) {
	
		i++;
		left = ((dateIncremental.getTime() - msStart) / (msEnd - msStart)) * GRID.MIDDLE_WIDTH;
		innerClassCss = '';

		if (differencial === DIFF.isMoreThan20Years) {
			innerLabel = dateIncremental.getUTCFullYear();
			dateIncremental = new Date(dateIncremental.setFullYear(dateIncremental.getFullYear() + 2));
		} else if (differencial === DIFF.isBetween10YearsAnd20Years) {
			innerLabel = dateIncremental.getUTCFullYear();
			dateIncremental = new Date(dateIncremental.setFullYear(dateIncremental.getFullYear() + 1));
		} else if (differencial === DIFF.isBetween6YearsAnd10Years) {
			innerLabel =
				dateIncremental.getMonth() == 0
					? dateIncremental.getUTCFullYear()
					: MONTHS[dateIncremental.getMonth()];
			dateIncremental = new Date(dateIncremental.setMonth(dateIncremental.getMonth() + 6));
		} else if (differencial === DIFF.isBetween3YearsAnd6Years) {
			innerLabel =
				dateIncremental.getMonth() == 0
					? dateIncremental.getUTCFullYear()
					: MONTHS[dateIncremental.getMonth()];
			innerClassCss = dateIncremental.getMonth() == 0 ? 'newYear' : '';
			dateIncremental = new Date(dateIncremental.setMonth(dateIncremental.getMonth() + 3));
		} else if (differencial === DIFF.isBetween20MonthsAnd3Years) {
			innerLabel =
				dateIncremental.getMonth() == 0
					? dateIncremental.getUTCFullYear()
					: MONTHS[dateIncremental.getMonth()];
			innerClassCss = dateIncremental.getMonth() == 0 ? 'newYear' : '';
			dateIncremental = new Date(dateIncremental.setMonth(dateIncremental.getMonth() + 2));
		} else if (differencial === DIFF.isBetween5MonthsAnd20Months) {
			innerLabel =
				dateIncremental.getMonth() == 0
					? dateIncremental.getUTCFullYear()
					: MONTHS[dateIncremental.getMonth()];
			innerClassCss = dateIncremental.getMonth() == 0 ? 'newYear' : '';
			dateIncremental = new Date(dateIncremental.setMonth(dateIncremental.getMonth() + 1));
		} else if (differencial === DIFF.isBetween1MonthAnd5Months) {
			innerLabel = dateIncremental.getDate() + '/' + (dateIncremental.getMonth() + 1);
			innerClassCss = dateIncremental.getDate() < 8 ? 'newYear' : '';
			dateIncremental = new Date(dateIncremental.setDate(dateIncremental.getDate() + 7));
		} else if (differencial === DIFF.isBelow1Month) {
			innerLabel = dateIncremental.getDay() == 0 ? DAYS[0] : dateIncremental.getDate();
			innerClassCss = dateIncremental.getDay() == 0 ? 'newYear' : '';
			dateIncremental = new Date(dateIncremental.setDate(dateIncremental.getDate() + 1));
		}

		jalons.push({
			left: left,
			label: innerLabel as string,
			classCss: innerClassCss
		});
	}

	return jalons;
}
