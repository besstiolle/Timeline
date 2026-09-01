import type { Milestone, Timeline } from "../struct.class.svelte";
import { MONTHS } from '$lib/constantes';
import { Helpers } from '$lib/helpers';

export class MilestoneViewModel{
    #milestone: Milestone
    #timeline: Timeline

    constructor(milestone: Milestone, timeline: Timeline){
        this.#milestone = milestone
        this.#timeline = timeline
    }

    /* Internal values */
    get id(): number{
        return this.#milestone.id
    }
    get label(): string{
        return this.#milestone.label
    }
    get dateTime(): number{
        return this.#milestone.getDate().getTime()
    }
    get dateDDMM(): string{
        return this.#milestone.getDate().getDate() + "-" + MONTHS[this.#milestone.getDate().getMonth()]
    }
    get isShow(): boolean{
        return this.#milestone.isShow
    }
    get xPosition():number{
        return Helpers.getViewportXFromDate(
            this.#milestone.getDate(),
			this.#timeline.start,
			this.#timeline.end
        )
        - 10
    }
}
