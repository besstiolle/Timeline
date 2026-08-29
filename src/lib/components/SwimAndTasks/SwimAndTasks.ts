import { GRID } from "$lib/constantes";
import { FactoryMilestone } from "$lib/factoryMilestone";
import type { Milestone, Swimline, Task, Timeline } from "$lib/struct.class.svelte";

interface swimlinesToShowInterface {
    swimline: Swimline;
    position: number;
    height: number;
}

/**
 * A readonly store with all the Milestones to display
 **/
export function displayableMilestones(timeline: Timeline):Milestone[] {
    const showAll = timeline.showAll;

    return timeline.milestones
        .filter((milestone) => showAll || milestone.isShow)
        .sort(FactoryMilestone.compare);
};

/**
 * A readonly store with all the Tasks to display
 **/
export function displayableTasks(timeline: Timeline):Task[] {
    const showAll = timeline.showAll;

    return timeline.tasks.filter((task) => showAll || task.isShow);
};

/**
 * A readonly store with all the Swimline to display
 */
export function displayableSwimlines(timeline: Timeline, displayableTasks: Task[]){

    const result = new Map<number, swimlinesToShowInterface>();

    let previousSwimlineId: number = -1;
    let position = 0;

    displayableTasks.forEach((task: Task) => {
        const swimlineId = task.swimlineId;

        if (swimlineId !== -1 && previousSwimlineId !== swimlineId) {
            const swimline = timeline.swimlines[swimlineId];
            const currentCounter =
                task.isShow && timeline.showAll
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
};
