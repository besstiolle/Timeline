import { Constantes } from "./constantes";
import type { Struct } from "./struct.class";

export module Helpers {

    /**
     * Return the date to a string validating the format YYYYMMDD_HHmm
     * @param date the date to parse into a ISO date format YYYYMMDD_HHmm
     * @returns string the format YYYYMMDD_HHmm
     */
    export function toYYYYMMDD_hhmm(date:Date):string{
        return date.getFullYear().toString().padStart(4, '0')
            + (date.getMonth()+1).toString().padStart(2, '0')
            + date.getDate().toString().padStart(2, '0')
            + '_'
            + date.getHours().toString().padStart(2, '0')
            + date.getMinutes().toString().padStart(2, '0')
    }

    /**
     * Return the date to a string validating the format YYYY-MM-DD
     * @param date the date to parse into a ISO date format YYYY-MM-DD
     * @returns string the format YYYY-MM-DD
     */
    export function toYYYY_MM_DD(date: Date): string {
        const DATE_SEPARATOR = "-"
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

    /**
     * Generate a pseudo-random string
     * @param length the length of the id to generate
     * @returns the id
     */
    export function randomeString(length: number) {
        let result: string = '';
        const characters : string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }

    /**
     * Simulate the unix function printf()
     * @param str the string with inner parameters formated like this : {number}
     * @param args a simple list of parameters
     * @returns a string formated like the unix printf
     */
    export function printf(str:string, args:any[]) {
        return str.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
        })
    }
}