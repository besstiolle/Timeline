import { GRID } from "$lib/constantes";
import { FactoryMilestone } from "$lib/factoryMilestone";
import { FactorySwimline } from "$lib/factorySwimline";
import { appState } from "$lib/state/appState.svelte";
import { Swimline, type Milestone, type Task, type Timeline } from "$lib/struct.class.svelte";

export interface swimlinesToShowInterface {
    swimline: Swimline;
    position: number;
    height: number;
}

/**
 * return all the Milestones to display
 **/
export function displayableMilestones():Milestone[] {
    const showAll = appState.currentTimeline.showAll;

    return appState.currentTimeline.milestones
        .filter((milestone) => showAll || milestone.isShow)
        .sort(FactoryMilestone.compare);
};

/**
 * return all the Tasks to display
 **/
export function displayableTasks():Task[] {
    const showAll = appState.currentTimeline.showAll;
    return appState.currentTimeline.tasks.filter((task) => showAll || task.isShow);
};

/**
 * return all the Swimline to display
 */
export function displayableSwimlines(){
    console.info("displayableSwimlines")
    const showAll = appState.currentTimeline.showAll;
    const result = new Map<number, swimlinesToShowInterface>();
    const tasks = appState.currentTimeline.tasks.filter((task) => showAll || task.isShow);

    console.info("displayableSwimlines tasks", tasks)

    let previousSwimlineId: number = -1;
    let position = 0;


    tasks.forEach((task: Task) => {
        const swimlineId = task.swimlineId;
        console.info("displayableSwimlines task id = ", task.id, "swimlineId = ", task.swimlineId)
        if (previousSwimlineId == -1 || (swimlineId !== -1 && previousSwimlineId !== swimlineId)) {
            console.info("displayableSwimlines add swimline")
            const swimline = appState.currentTimeline.swimlines[swimlineId];
            const countVisibleTasks = 
                FactorySwimline.countVisibleTasksInListForSwimlineName(tasks, swimline.label)
            const currentCounter = 
                appState.currentTimeline.showAll
                ? swimline.countAllTasks
                : countVisibleTasks;

            const height = currentCounter * GRID.ONE_TASK_H - 0.5;

            result.set(task.id, {
                swimline: swimline,
                position: position,
                height: height
            });

            position++;
        } else {
            console.info("displayableSwimlines reuse swimline id", previousSwimlineId)
        }

        previousSwimlineId = swimlineId;
    });
    console.info("displayableSwimlines", result)
    return result;
};
