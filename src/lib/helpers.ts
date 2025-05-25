import { DIFF, GRID, TIMERS } from "./constantes";
import type { Struct } from "./struct.class";

export namespace Helpers {

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
     * @param x the value of the x position inside the full viewport ratio (GRID.ALL_WIDTH)
     * @param dmin the minimal date of the viewport 
     * @param dmax the maximal date of the viewport
     * @returns the Date equivalent
     */
    export function getDateFromViewportX(x: number, dmin: Date, dmax: Date) : Date{
        if(x < GRID.MIDDLE_X){
            x = GRID.MIDDLE_X
        }
        if(x > GRID.MIDDLE_X + GRID.MIDDLE_WIDTH){
            x = GRID.MIDDLE_X + GRID.MIDDLE_WIDTH
        }

        //Ceil value of x to avoid miscalculation
        let date = new Date(((Math.ceil(x)  - GRID.MIDDLE_X) * (dmax.getTime() - dmin.getTime()) / GRID.MIDDLE_WIDTH) + dmin.getTime())
        //Remove hours & co for the same reason
        //date.setHours(0, 0, 0, 0)
        return date
    }

    /** 
     * Give the x value equivalent to the date value inside the viewport
     * @param date the value of the date inside the full viewport ratio (GRID.ALL_WIDTH)
     * @param dmin the minimal date of the viewport 
     * @param dmax the maximal date of the viewport
     * @returns the x value equivalent
     **/
    export function getViewportXFromDate(date: Date, dmin: Date, dmax: Date) : number{
        let x = ((date.getTime() - dmin.getTime())  * GRID.MIDDLE_WIDTH / (dmax.getTime() - dmin.getTime()))
                + GRID.MIDDLE_X
        
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

    /**
     * return the enum value of DIFF wich represent the relative difference between 2 dates
     * @param dateMin the minimum date to compare
     * @param dateMax the max date to compare
     * @returns the value of the constante DIFF
     */
    export function getEstimationOfDiff(dateMin: Date, dateMax:Date):string{
        const diff = dateMax.getTime() - dateMin.getTime()
        if(diff > TIMERS.YEARS20){return DIFF.isMoreThan20Years}
        if(diff <= TIMERS.YEARS20 && diff > TIMERS.YEARS10){return DIFF.isBetween10YearsAnd20Years}
        if(diff <= TIMERS.YEARS10 && diff > TIMERS.YEARS6){return DIFF.isBetween6YearsAnd10Years}
        if(diff <= TIMERS.YEARS6 && diff > TIMERS.YEARS3){return DIFF.isBetween3YearsAnd6Years}
        if(diff <= TIMERS.YEARS3 && diff > TIMERS.MONTHS20){return DIFF.isBetween20MonthsAnd3Years}
        if(diff <= TIMERS.MONTHS20 && diff > TIMERS.MONTHS5){return DIFF.isBetween5MonthsAnd20Months}
        if(diff <= TIMERS.MONTHS5 && diff > TIMERS.DAYS31){return DIFF.isBetween1MonthAnd5Months}
        if(diff <= TIMERS.DAYS31){return DIFF.isBelow1Month}

        //Default return statement
        return DIFF.isMoreThan20Years
    }
}