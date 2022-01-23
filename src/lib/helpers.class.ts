import { Constantes } from "./constantes.class";
import { Struct } from "./struct.class";

export module Helpers {

    const DATE_SEPARATOR = "-"

    export function toISODateString(date: Date): string {
		return date.getFullYear() + DATE_SEPARATOR + (date.getMonth() + 1).toString().padStart(2, '0') + DATE_SEPARATOR + date.getDate().toString().padStart(2, '0');
	}

	export function dataReviver(key : string, value : any) {
        
        const COMMONS: string[] = ['isInitiate', 'maxId', 'viewbox', 'showAll', // Primitive type field of Data
                                 'position','isShow','label', 'id', 'swimline', 'progress',
                                 'swimlineId', 'countVisibleTasks', 'countAllTasks',
                                 'tasks', 'milestones', 'swimlines', //Nothing to do, it's an array
                                 'date', 'datemin', 'datemax' // date inside object, will be cast by new Date when reviver the object
                                ]
        if(COMMONS.includes(key)){
            return value
        }

        //Case of object Data
        if(key === ''){
            let structData: Struct.Data = Object.assign(new Struct.Data(), value)
            return structData
        }

        if(typeof value === 'object' && value.label) { //Un object contenant un label => nos objects Task & Milestone
            if(value.date){
                // Because of Date we can't do 
                //  > Object.assign(new Struct.Task, value) 
                return new Struct.Milestone(value.id, value.label,new Date(value.date), value.isShow)
            } else if (value.dateStart) {
                // Because of Date we can't do 
                //  > Object.assign(new Struct.Task, value) 
                return new Struct.Task(value.id, value.label,new Date(value.dateStart), new Date(value.dateEnd), 
                                value.progress, value.isShow, value.swimline, value.swimlineId)
            } else {
                //This is a re-processed value, we don't need to reprocessing it right now
                return value
            }
        }

        //Case of Date (min, max, ...)
		if (typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.exec(value)) {
            return new Date(value)
		}

        //We need to test this in last position to be sur to catch object in map & array 
        if(/^\d+$/.exec(key)){
            return value
        }


        if(value == null){
            console.info("value was null for key `%o` in Helpers.dataReviver() function", key)
            return null
        }
        
        console.warn("key : `%o` with value `%o` was not caught in Helpers.dataReviver() function" , key, value)

		return value;
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
        if(x < Constantes.GRID.MIDDLE_X){
            x = Constantes.GRID.MIDDLE_X
        }
        if(x > Constantes.GRID.MIDDLE_X + Constantes.GRID.MIDDLE_WIDTH){
            x = Constantes.GRID.MIDDLE_X + Constantes.GRID.MIDDLE_WIDTH
        }

        //Ceil value of x to avoid miscalculation
        let date = new Date(((Math.ceil(x)  - Constantes.GRID.MIDDLE_X) * (dmax.getTime() - dmin.getTime()) / Constantes.GRID.MIDDLE_WIDTH) + dmin.getTime())
        //Remove hours & co for the same reason
        //date.setHours(0, 0, 0, 0)
        return date
    }
    export function getViewportXFromDate(date: Date, dmin: Date, dmax: Date) : number{
        let x = ((date.getTime() - dmin.getTime())  * Constantes.GRID.MIDDLE_WIDTH / (dmax.getTime() - dmin.getTime()))
                + Constantes.GRID.MIDDLE_X
        
        //Ceil value of x to avoid miscalculation
        return Math.ceil(x)
    }
}