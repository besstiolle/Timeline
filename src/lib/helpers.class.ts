import { Struct } from "./struct.class";

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

	export function getMin(tasks : Array<Struct.Task>, milestones : Array<Struct.Milestone>): Date{
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
            return Object.assign(new Struct.Data(), value)
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
                console.error("Case unexpected in dateTimeReviver with value : ")
            }
        }

        if(key === 'tasks'){
            //Nothing to do, it's an array
        }
        if(key === 'milestones'){
            //Nothing to do, it's an array
        }

        //Case of Date (date, datemin, datemax, min, max, ...)
		if (typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.exec(value)) {
            return new Date(value);
		}

		return value;
	}

	export function ObjectToTask(o: any) {
        return new Struct.Task(o.label,new Date(o.dateStart), new Date(o.dateEnd), o.progress, o.isShow)
	}
	export function ObjectToMilestone(o: any) {
		return new Struct.Milestone(o.label,new Date(o.date), o.isShow)
	}


}