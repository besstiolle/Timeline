import { DIFF, GRID } from "$lib/constantes";
import { FactoryTimeline } from "$lib/factoryTimeline";
import { Helpers } from "$lib/helpers";
import { appState } from "$lib/state/appState.svelte";
import { volatileAppState } from "$lib/state/volatileAppState.svelte";

/**
 * 
 */
export function processVolatile():void {
    //console.info("processVolatile", appState.currentTimeline)
    const start = FactoryTimeline.getMin(appState.currentTimeline);
    const end = FactoryTimeline.getMax(appState.currentTimeline);

    volatileAppState.timelineDifferencial = Helpers.getEstimationOfDiff(start, end);

    switch (volatileAppState.timelineDifferencial) {
        case DIFF.isMoreThan20Years:
        case DIFF.isBetween10YearsAnd20Years:
            start.setFullYear(start.getFullYear() - 1);
            end.setFullYear(end.getFullYear() + 1);
            start.setDate(1);
            end.setDate(1);
            break;
        case DIFF.isBetween6YearsAnd10Years:
        case DIFF.isBetween3YearsAnd6Years:
        case DIFF.isBetween20MonthsAnd3Years:
        case DIFF.isBetween5MonthsAnd20Months:
            if (start.getDate() < 15) {
                start.setMonth(start.getMonth() - 1);
            }
            if (end.getDate() > 15) {
                end.setMonth(end.getMonth() + 2);
            } else {
                end.setMonth(end.getMonth() + 1);
            }
            start.setDate(1);
            end.setDate(1);
            break;
        case DIFF.isBetween1MonthAnd5Months:
            start.setDate(start.getDate() - 5);
            end.setDate(end.getDate() + 5);
            break;
        case DIFF.isBelow1Month:
            start.setDate(start.getDate() - 2);
            end.setDate(end.getDate() + 2);
            break;
    }

    volatileAppState.timelineStart = start;
    volatileAppState.timelineEnd = end

    //Reprocess viewbox sizing
    let len = appState.currentTimeline.tasks.length;
    if (!appState.currentTimeline.showAll) {
        len = Helpers.countVisibleTasksInList(appState.currentTimeline.tasks);
    }
    volatileAppState.viewbox = `0 0 ${GRID.ALL_WIDTH} ${GRID.MILESTONE_H + GRID.ANNUAL_H + GRID.ONE_TASK_H * len + GRID.TODAY_H}`;

	
    //console.info("processVolatile volatileAppState", volatileAppState)
}