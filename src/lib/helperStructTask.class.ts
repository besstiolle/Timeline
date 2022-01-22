
import { Helpers } from "./helpers.class";
import type { Struct } from "./struct.class";

export module HelperStructTask {

    export function join(task: Struct.Task, car : string){
		
        return "task"
            + car + task.label
            + car + task.isShow
            + car + Helpers.toISODateString(task.dateStart)
            + car + Helpers.toISODateString(task.dateEnd)
            + car + task.progress
            + car + task.swimline
    }

    export function getById(data : Struct.Data, id : number) : Struct.Task{
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
        throw "Struct.Task with id "+id+" was not found"
    }
}