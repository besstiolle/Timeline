import { Struct } from "./struct.class";
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
            + car + task.hasProgress
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
        
        let found = null
        timeline.tasks.forEach(task => {
            if(task.id == id){
                found = task
            } 
        })
        
        if(found){
            return found
        }
        throw new NotFoundException('Struct.Task', id)
    }

    /**
     * Clone properly a <Struct.Task> with all its function.
     * @param task the task to clone
     * @param nextId the id to apply of the current task.id will be used
     * @returns the new task cloned
     */
    export function clone(task: Struct.Task, nextId?: number): Struct.Task{
        return new Struct.Task(nextId?nextId:task.id, 
                                task.label,
                                task.dateStart,
                                task.dateEnd,
                                task.hasProgress,
                                task.progress,
                                task.isShow,
                                task.swimline,
                                task.swimlineId
                                )
    }
}