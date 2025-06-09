import { derived } from 'svelte/store';
import { store } from './stores';
import { FactoryMilestone } from './factoryMilestone';
import { GRID } from './constantes';
import type { Swimline, Task } from './struct.class';

/**
 * A readonly store with all the Milestones to display
 **/
export const displayableMilestones = derived(store, ($store) => {
	const timeline = $store.currentTimeline;
	const showAll = timeline.showAll;

	return timeline.milestones
		.filter((milestone) => showAll || milestone.isShow)
		.sort(FactoryMilestone.compare);
});

/**
 * A readonly store with all the Tasks to display
 **/
export const displayableTasks = derived(store, ($store) => {
	const timeline = $store.currentTimeline;
	const showAll = timeline.showAll;

	return timeline.tasks.filter((task) => showAll || task.isShow);
});

/**
 * A readonly store with all the Swimline to display
 */
export const displayableSwimlines = derived(
	[store, displayableTasks],
	([$store, $displayableTasks]) => {
		const result = new Map<number, swimlinesToShowInterface>();

		let previousSwimlineId: number = -1;
		let position = 0;

		$displayableTasks.forEach((task: Task) => {
			const swimlineId = task.swimlineId;

			if (swimlineId !== -1 && previousSwimlineId !== swimlineId) {
				const swimline = $store.currentTimeline.swimlines[swimlineId];
				const currentCounter =
					task.isShow && !$store.currentTimeline.showAll
						? swimline.countVisibleTasks
						: swimline.countAllTasks;
				const height = currentCounter * GRID.ONE_TASK_H - 0.5;

				result.set(task.id, {
					swimline: swimline,
					position: position,
					height: height
				});

				position++;
			}

			previousSwimlineId = swimlineId;
		});
		return result;
	}
);

interface swimlinesToShowInterface {
	swimline: Swimline;
	position: number;
	height: number;
}
