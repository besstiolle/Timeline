import { GRID } from "$lib/constantes";
import { FactoryMilestone } from "$lib/factoryMilestone";
import { FactorySwimline } from "$lib/factorySwimline";
import { FactoryTask } from "$lib/factoryTask";
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
    //console.info("displayableSwimlines")
    const showAll = appState.currentTimeline.showAll;
    const result = new Map<number, swimlinesToShowInterface>();
    const tasks = appState.currentTimeline.tasks.filter((task) => showAll || task.isShow);

    //console.info("displayableSwimlines tasks", tasks)

    let previousSwimlineName: string;
    let position = 0;


    tasks.forEach((task: Task) => {
        const swimlineName = task.swimline;
        //console.info("displayableSwimlines --------------")
        //console.info("displayableSwimlines task id = ", task.id, "swimlineName = ", task.swimline)
        if (previousSwimlineName == undefined || (previousSwimlineName && previousSwimlineName !== swimlineName)) {
            //console.info("displayableSwimlines add swimline")
            let swimline:Swimline|null = null;
            appState.currentTimeline.swimlines.forEach(aSwimline => {
                
                if(aSwimline.label === swimlineName && aSwimline.tasksIds.includes(task.id)){
                    //console.info("displayableSwimlines boucle affectation", aSwimline)
                    swimline = aSwimline;
                }
            });

            if(swimline !== null){
                const groupOfSameTask = FactoryTask.getSimilarTasksWithSameSwimline(task)
                //console.info("displayableSwimlines groupOfSameTask", groupOfSameTask, task)

                const countVisibleTasks = 
                FactorySwimline.countVisibleTasksInListForSwimlineName(groupOfSameTask, (swimline as Swimline).label)
                const currentCounter = 
                    appState.currentTimeline.showAll
                    ? (swimline as Swimline).countAllTasks
                    : countVisibleTasks;

                //console.info("displayableSwimlines countVisibleTasks", countVisibleTasks)

                const height = currentCounter * GRID.ONE_TASK_H - 0.5;

                result.set(task.id, {
                    swimline: swimline,
                    position: position,
                    height: height
                });

                position++;
            }            
            
        } else {
            //console.info("displayableSwimlines reuse swimline id", previousSwimlineName)
        }

        previousSwimlineName = swimlineName;
    });
    //console.info("displayableSwimlines", result)
    return result;
};
