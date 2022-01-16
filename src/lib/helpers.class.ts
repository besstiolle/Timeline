import { Constantes } from "./constantes.class";
import { Struct } from "./struct.class";

export module Helpers {

    const DATE_SEPARATOR = "-"

    export function toISODateString(date: Date): string {
		return date.getFullYear() + DATE_SEPARATOR + (date.getMonth() + 1).toString().padStart(2, '0') + DATE_SEPARATOR + date.getDate().toString().padStart(2, '0');
	}

	export function getMin(tasks : Array<Struct.Task>, milestones : Array<Struct.Milestone>): Date{
        if(tasks.length === 0 && milestones.length === 0){
            return new Date()
        }
        
        let min : Date = new Date("2999-12-31");
        tasks.forEach(task => {
            if(min > task.dateStart){
                min = task.dateStart
            }
        });
        milestones.forEach(milestone => {
            if(min > milestone.date){
                min = milestone.date
            }
        });
        
        return new Date(min)
    }

    export function getMax(tasks : Array<Struct.Task>, milestones : Array<Struct.Milestone>): Date{
        
        if(tasks.length === 0 && milestones.length === 0){
            return new Date()
        }

        let max : Date = new Date("1900-01-01");
        tasks.forEach(task => {
            if(max < task.dateEnd){
                max = task.dateEnd
            }
        });
        milestones.forEach(milestone => {
            if(max < milestone.date){
                max = milestone.date
            }
        });
        return new Date(max)
    }

	export function dataReviver(key : string, value : any) {
        
        //Case of object Data
        if(key === ''){
            let structData = Object.assign(new Struct.Data(), value)
            structData.reorderIds()
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
                console.error("Case unexpected in dateTimeReviver with value : %o", value)
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
        if(key === 'mapperIdIndex'){
            return  ObjectToMap(value)
        }

        //Case of Date (date, datemin, datemax, min, max, ...)
		if (typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.exec(value)) {
            return new Date(value);
		}

        //console.info("key : %o" , key)
        //console.info("value : %o" , value)

		return value;
	}

	function ObjectToTask(o: any) {
        return new Struct.Task(-1, o.label,new Date(o.dateStart), new Date(o.dateEnd), o.progress, o.isShow, o.swimline)
	}
	function ObjectToMilestone(o: any) {
		return new Struct.Milestone(-1, o.label,new Date(o.date), o.isShow)
	}
	function ObjectToMap(o: any) {
		let map : Map<number, number> = new Map<number, number>()
        let k : string
        for (k of Object.keys(o)) {
            map.set(parseInt(k), o[parseInt(k)])
        }
        return map
	}

    export function computeMapSwimlines(tasks : Array<Struct.Task>):  Map<number, Struct.TmpStructSwimline>{
        let task: Struct.Task;
        let combo: number = 0
        let tmpStructSwimline: Struct.TmpStructSwimline
        let swimlines : Map<number, Struct.TmpStructSwimline> = new Map()
    
        let len: number = tasks.length
    
        for(let i: number=0; i < len; i++){
            task = tasks[i]
            //console.info("start with task " + i)
            
            //No swimline on current task
            if(!task.swimline || task.swimline ===""){
                //If a swimline was already open : close it
                if(tmpStructSwimline){
                    //Set combo in array/map/struct
                    tmpStructSwimline.setCountVisibleTasks(combo)
                    swimlines.set(tmpStructSwimline.id, tmpStructSwimline)
    
                    //console.info("closing swimline " + tmpStructSwimline.label + " with " + tmpStructSwimline.countVisibleTasks + " tasks inside (A)")
                    tmpStructSwimline = null
                    //Reset combo
                    combo = 0
                }
                continue
            }
    
            //Increase combo if this tasks have same swimline than previous tasks
            if(tmpStructSwimline && tmpStructSwimline.label === task.swimline){
                combo++
                //console.info("increase swimline " + tmpStructSwimline.label + " with 1 more task inside (currently : " + tmpStructSwimline.countVisibleTasks + " )")
                
            //If there is no swimline open or no a similare swimline open : create a new one 
            } else if(!tmpStructSwimline || tmpStructSwimline.label !== task.swimline){
    
                // if a different swimline is already open
                if(tmpStructSwimline && tmpStructSwimline.label !== task.swimline){
                    //Set combo in array/map/struct
                    tmpStructSwimline.setCountVisibleTasks(combo)
                    swimlines.set(tmpStructSwimline.id, tmpStructSwimline)
    
                   // console.info("closing swimline " + tmpStructSwimline.label + " with " + tmpStructSwimline.countVisibleTasks + " tasks inside (B)")
                    tmpStructSwimline = null
                    //Reset combo
                    combo = 0
                }   
                combo++
                tmpStructSwimline = new Struct.TmpStructSwimline(i, task.swimline)
                //console.info("starting swimline " + tmpStructSwimline.label)
            }    
        }
    
        //Last line : Set combo in array/map/struct
        if(tmpStructSwimline){
            tmpStructSwimline.setCountVisibleTasks(combo)
            swimlines.set(tmpStructSwimline.id, tmpStructSwimline)
            //console.info("closing swimline " + tmpStructSwimline.label + " with " + tmpStructSwimline.countVisibleTasks + " tasks inside (C)")
        }
        
        //console.info(swimlines)
        return swimlines
    }

    export function countVisibleTask(allTasks: Struct.Task[]) : number{
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