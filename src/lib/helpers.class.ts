import { Constantes } from "./constantes.class";
import type { Struct } from "./struct.class";

export module Helpers {

    const DATE_SEPARATOR = "-"

    /**
     * Return the date to a string validating the format YYYY-MM-DD
     * @param date the date to parse into a ISO date format YYYY-MM-DD
     * @returns string the format YYYY-MM-DD
     */
    export function toISODateString(date: Date): string {
		return date.getFullYear() + DATE_SEPARATOR + (date.getMonth() + 1).toString().padStart(2, '0') + DATE_SEPARATOR + date.getDate().toString().padStart(2, '0');
	}

    /**
     * Return the number of tasks visible (task.isShow=true) inside the list of tasks
     * @param tasks The list of Struct.Task to look inside
     * @returns number of tasks visibles
     */
    export function countVisibleTasksInList(tasks: Struct.Task[]) : number{
        let count : number = 0
        tasks.forEach(task => {
            if(task.isShow){
                count++
            }
        })
        return count
    }

    /**
     * Give the date equivalent to the x value inside the viewport
     * @param x the value of the x position inside the full viewport ratio (Constantes.GRID.ALL_WIDTH)
     * @param dmin the minimal date of the viewport 
     * @param dmax the maximal date of the viewport
     * @returns the Date equivalent
     */
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

    /** 
     * Give the x value equivalent to the date value inside the viewport
     * @param date the value of the date inside the full viewport ratio (Constantes.GRID.ALL_WIDTH)
     * @param dmin the minimal date of the viewport 
     * @param dmax the maximal date of the viewport
     * @returns the x value equivalent
     **/
    export function getViewportXFromDate(date: Date, dmin: Date, dmax: Date) : number{
        let x = ((date.getTime() - dmin.getTime())  * Constantes.GRID.MIDDLE_WIDTH / (dmax.getTime() - dmin.getTime()))
                + Constantes.GRID.MIDDLE_X
        
        //Ceil value of x to avoid miscalculation
        return Math.ceil(x)
    }
}