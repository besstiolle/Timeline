
import { Helpers } from "./helpers.class";
import type { Struct } from "./struct.class";

export module HelperStructTask {

    
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
            + car + Helpers.toISODateString(task.dateStart)
            + car + Helpers.toISODateString(task.dateEnd)
            + car + task.progress
            + car + task.swimline
    }

    /**
     * Return the Task given by its own id
     * @param data the Struct.Timeline to look inside
     * @param id the id of the Task
     * @returns the Task found or an exception
     */
    export function getById(data : Struct.Timeline, id : number) : Struct.Task{
        //A simple loop to reach for the good item because it's cheaper
        // than trying to maintain a map with id => index of array each time 
        // we change something into the $store
        let result:Struct.Task = null
        data.tasks.forEach(task => {
            if(task.id == id){
                result = task
            } 
        });
        if(result) {
            return result
        }
        
        //TODO : better thtow a real exception
        throw "Struct.Task with id "+id+" was not found"
    }
}