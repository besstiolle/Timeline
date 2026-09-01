import { GRID } from "$lib/constantes";
import { FactoryMilestone } from "$lib/factoryMilestone";
import { FactorySwimline } from "$lib/factorySwimline";
import { FactoryTask } from "$lib/factoryTask";
import { appState } from "$lib/state/appState.svelte";
import { Swimline, type Milestone, type Task } from "$lib/struct.class.svelte";

export interface swimlinesToShowInterface {
    swimline: Swimline;
    position: number;
    height: number;
}

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
    const showAll = appState.currentTimeline.showAll;
    const result = new Map<number, swimlinesToShowInterface>();
    const tasks = appState.currentTimeline.tasks.filter((task) => showAll || task.isShow);

    let previousSwimlineName: string='';
    let position = 0;


    tasks.forEach((task: Task) => {
        const swimlineName = task.swimline;
        if (previousSwimlineName == '' || previousSwimlineName !== swimlineName) {
            previousSwimlineName = swimlineName
            let swimline:Swimline|null = null;
            appState.currentTimeline.swimlines.forEach(aSwimline => {
                
                if(aSwimline.label === swimlineName && aSwimline.tasksIds.includes(task.id)){
                    swimline = aSwimline;
                }
            });

            if(swimline !== null){
                const groupOfSameTask = FactoryTask.getSimilarTasksWithSameSwimline(task)

                const countVisibleTasks = 
                FactorySwimline.countVisibleTasksInListForSwimlineName(groupOfSameTask, (swimline as Swimline).label)
                const currentCounter = 
                    appState.currentTimeline.showAll
                    ? (swimline as Swimline).countAllTasks
                    : countVisibleTasks;

                const height = currentCounter * GRID.ONE_TASK_H - 0.5;

                result.set(task.id, {
                    swimline: swimline,
                    position: position,
                    height: height
                });

                position++;
            }            
            
        } 

        previousSwimlineName = swimlineName;
    });
    return result;
};
