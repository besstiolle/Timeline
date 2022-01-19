
import { Helpers } from "./helpers.class";
import { Struct } from "./struct.class";

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

    export function clone(task: Struct.Task){
        return new Struct.Task(-1, task.label, task.dateStart, task.dateEnd,task.progress, task.isShow, task.swimline)
    }
}