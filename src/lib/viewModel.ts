import type { Task, Timeline } from "./struct.class";
import { MONTHS } from '$lib/constantes';
import { Helpers } from '$lib/helpers';

export class TaskViewModel {

    #task: Task;
    #timeline: Timeline;

    constructor(task: Task, timeline: Timeline) {
        this.#task = task;
        this.#timeline = timeline;
    }

    /* Internal values */

    get id(): number{
        return this.#task.id
    }
    get progress(): number{
        return this.#task.progress
    }
    get hasProgress(): boolean{
        return this.#task.hasProgress
    }
    get isShow(): boolean{
        return this.#task.isShow
    }
    get label(): string{
        return this.#task.label
    }

    /* Calculated values */

    /**
     * Return the Left X position = StartDate of the task
     */
    get leftGrayXPosition(): number{
        return Helpers.getViewportXFromDate(
			this.#task.getStart(),
			this.#timeline.getStart(),
			this.#timeline.getEnd()
		)
    }

    /**
     * Return the Right X position = EndDate of the task
     */
    get rightGrayXPosition():number{
        const endDate = new Date(this.#task.getEnd().getTime());
        endDate.setDate(endDate.getDate() + 1);

        return Helpers.getViewportXFromDate(
            endDate,
			this.#timeline.getStart(),
			this.#timeline.getEnd()
        )
    }

     /**
     * Return the Width of the task = duration of the task
     */
    get grayWidth(): number{
        return this.rightGrayXPosition - this.leftGrayXPosition
    }

    /**
     * Return the Width of the progression 
     */
    get progressWidth(): number{
        return (this.#task.progress * this.grayWidth) / 100
    }

    get percentTextAnchor(): string{
        return this.#task.progress < 50 ? 'start' : 'end'
    }

     /**
     * Return the X position of the progress bar
     */
    get percentXPosition(): number{
        if(this.#task.progress < 50){
            return this.leftGrayXPosition + this.progressWidth + 5
        } else {
            return this.leftGrayXPosition + this.progressWidth - 5
        }
    }

     /**
     * Return something like '01 jan - 10 feb' with startDate & endDate
     */
    get labelRight(){
        return `${this.#task.getStart().getDate()} ${MONTHS[this.#task.getStart().getMonth()]} - ${this.#task.getEnd().getDate()} ${MONTHS[this.#task.getEnd().getMonth()]}`
    }

    get fillColor():string{

        const green = '#16A085';
        const blue = '#2980B9';

        if(this.#task.hasProgress && this.#task.progress < 100){
            return blue
        } else {
            return green
        }
    }
    get strokeColor():string{

        const greenStroke = '#117A65';
        const blueStroke = '#236B99';

        if(this.#task.hasProgress && this.#task.progress < 100){
            return blueStroke
        } else {
            return greenStroke
        }
    }

    get hasSwimline(): boolean{
        return Boolean(this.#task.swimline && this.#task.swimline !== '');
    }
}