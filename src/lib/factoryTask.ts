
import { Helpers } from "./helpers"
import type { Struct } from "./struct.class";
import { NotFoundException } from "./timelineException.class";

export module FactoryTask {

    
    /**
     * return the values of the Task concatenated for CSV with a custom separator
     * @param milestone the Task
     * @param car the separator
     * @returns a string with values concatenated for CSV
     */
    export function join(task: Struct.Task, car : string){
		
        return "task"
            + car + task.label
            + car + task.isShow
            + car + task.dateStart
            + car + task.dateEnd
            + car + task.progress
            + car + task.swimline
    }

    /**
     * Return the Task given by its own id
     * @param timeline the Struct.Timeline to look inside
     * @param id the id of the Task
     * @returns the Task found or an exception
     */
    export function getById(timeline : Struct.Timeline, id : number) : Struct.Task{
        //A simple loop to reach for the good item because it's cheaper
        // than trying to maintain a map with id => index of array each time 
        // we change something into the $store
        let result:Struct.Task = null
        timeline.tasks.forEach(task => {
            if(task.id == id){
                result = task
            } 
        });
        if(result) {
            return result
        }

        throw new NotFoundException('Struct.Task', id)
    }
}