import { Constantes } from "./constantes.class";
import { HelperStructData } from "./helperStructData.class";
import { Struct } from "./struct.class";

export module Helpers {

    const DATE_SEPARATOR = "-"

    export function toISODateString(date: Date): string {
		return date.getFullYear() + DATE_SEPARATOR + (date.getMonth() + 1).toString().padStart(2, '0') + DATE_SEPARATOR + date.getDate().toString().padStart(2, '0');
	}

	export function dataReviver(key : string, value : any) {
        
        let commons: string[] = [//'value', 'dataType', // Technical field for Map
                                 'isInitiate', 'maxId', 'viewbox', 'showAll', // Primitive type field of Data
                                 'position','isShow','label', 'id', 'swimline', 'progress',
                                 'swimlineId',
                                ]
        if(commons.includes(key)){
            return value
        }

        if(value == null){
            return null
        }

        //Case of object Data
        if(key === ''){
            let structData: Struct.Data = Object.assign(new Struct.Data(), value)
            return structData
        }

        if(typeof value === 'object' && value.label) { //Un object contenant un label => nos objects Task & Milestone
            if(value.date){
                // Can't do 
                //  > Object.assign(new Struct.Milestone, value) 
                // because of Date
                return ObjectToMilestone(value)
            } else if (value.dateStart) {
                // Can't do 
                //  > Object.assign(new Struct.Task, value) 
                // because of Date
                return ObjectToTask(value)
            } else {
                //This is a re-processed value, we don't need to reprocessing it right now
                return value
            }
        }

        if(key === 'tasks'){
            //Nothing to do, it's an array
            return value
        }
        if(key === 'milestones'){
            //Nothing to do, it's an array
            return value
        }

        //Case of Date (date, datemin, datemax, min, max, ...)
		if (typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.exec(value)) {
            return new Date(value);
		}

        //We need to test this in last position to be sur to catch object in map with 
        if(/^\d+$/.exec(key)){
            return value
        }
        
        console.warn("key : %o with value %o was not caught in jsonReviverReplacer.reviver() function" , key, value)

		return value;
	}

	function ObjectToTask(o: any) {
        return new Struct.Task(o.id, o.label,new Date(o.dateStart), new Date(o.dateEnd), o.progress, o.isShow, o.swimline, o.swimlineId)
	}
	function ObjectToMilestone(o: any) {
		return new Struct.Milestone(o.id, o.label,new Date(o.date), o.isShow)
	}
	function ObjectToMap(o: any) {
		let map : Map<number, number> = new Map<number, number>()
        let k : string
        for (k of Object.keys(o)) {
            map.set(parseInt(k), o[parseInt(k)])
        }
        return map
	}


    export function countVisibleTasksInList(allTasks: Struct.Task[]) : number{
        let count : number = 0
        allTasks.forEach(task => {
            if(task.isShow){
                count++
            }
        })
        return count
    }


    export function getDateFromViewportX(x: number, dmin: Date, dmax: Date) : Date{
        //Ceil value of x to avoid miscalculation
        let date = new Date(((Math.ceil(x)  - Constantes.GRID.MIDDLE_X) * (dmax.getTime() - dmin.getTime()) / Constantes.GRID.MIDDLE_WIDTH) + dmin.getTime())
        //Remove hours & co for the same reason
        date.setHours(0, 0, 0, 0)
        return date
    }
    export function getViewportXFromDate(date: Date, dmin: Date, dmax: Date) : number{
        let x = ((date.getTime() - dmin.getTime())  * Constantes.GRID.MIDDLE_WIDTH / (dmax.getTime() - dmin.getTime()))
                + Constantes.GRID.MIDDLE_X
        
        //Ceil value of x to avoid miscalculation
        return Math.ceil(x)
    }
}