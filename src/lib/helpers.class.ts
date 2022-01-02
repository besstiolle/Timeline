import type { Graph } from "./graph.class";

export module Helpers {

    export function toISODateString(date: Date): string {
		return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0');
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

	export function dateTimeReviver(key, value) {
		if (typeof value === 'string') {
			if (/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.exec(value)) {
				return new Date(value);
			}
		}
		return value;
	}

}