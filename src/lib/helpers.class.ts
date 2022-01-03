import { Constantes } from "./constantes.class";
import { Graph } from "./graph.class";

export module Helpers {

    const DATE_SEPARATOR = "-"

    export function toISODateString(date: Date): string {
		return date.getFullYear() + DATE_SEPARATOR + (date.getMonth() + 1).toString().padStart(2, '0') + DATE_SEPARATOR + date.getDate().toString().padStart(2, '0');
	}

    /**
     * 
     * @param string 
     */
    export function IsoStringtoDate(string: string): Date{
        let parts = string.split("/")
        return new Date(parts[2] + DATE_SEPARATOR + parts[1] + DATE_SEPARATOR + parts[0])
    }

	export function getMin(tasks : Array<Graph.Task>, milestones : Array<Graph.Milestone>): Date{
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

    export function getMax(tasks : Array<Graph.Task>, milestones : Array<Graph.Milestone>): Date{
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

	export function dateTimeReviver(key : string, value : any) {
        
        if(key === ''){
            let obj = Object.assign(new Graph.Data(), value)
            console.info("> global data : %o", obj)
            return obj
        }

        if(typeof value === 'object' && value.label) { //Un object contenant un label => nos objects
            if(value.date){
                return ObjectToMilestone(value)
            } else if (value.dateStart) {
                return ObjectToTask(value)
            } else {
                console.error("Case unexpected in dateTimeReviver with value : ")
            }
        }

        if(key === 'tasks'){
            // Can't do 
            //  > Object.assign(new Graph.Task, value) 
            // because of Date
            //return ObjectToTask(value)
            console.info("> tasks : %o", value)
        }
        if(key === 'milestones'){
            // Can't do 
            //  > Object.assign(new Graph.Milestone, value) 
            // because of Date
            //return ObjectToMilestone(value)
            console.info("> milestone : %o", value)
        }

		if (typeof value === 'string') {
			if (/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.exec(value)) {
                return new Date(value);
			}
		}

        //console.info("key : " + key)

		return value;
	}

	export function ObjectToTask(o: any) {
        //console.info("o")
        //console.info(o)
        //console.info("o")
		let foo = new Graph.Task(o.label,new Date(o.dateStart), new Date(o.dateEnd), o.progress, o.isShow)
        //console.info(foo)
        //console.info("foo")
        return foo
	}
	export function ObjectToMilestone(o: any) {
		return new Graph.Milestone(o.label,new Date(o.date), o.isShow)
	}


}