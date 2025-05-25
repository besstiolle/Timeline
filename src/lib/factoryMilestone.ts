
import { Struct } from "./struct.class";
import { NotFoundException } from "./timelineException.class";

export namespace FactoryMilestone {

    /**
     * return the values of the Milestone concatenated for CSV with a custom separator
     * @param milestone the Milestone
     * @param car the separator
     * @returns a string with values concatenated for CSV
     */
    export function join(milestone: Struct.Milestone, car : string){
        return "milestone"
            + car + milestone.label
            + car + milestone.isShow
            + car + milestone.date
    }
    
    /**
     * Return the Milestone given by its own id
     * @param timeline the Struct.Timeline to look inside
     * @param id the id of the Milestone
     * @returns the Milestone found or an exception
     */
    export function getById(timeline : Struct.Timeline, id : number) : Struct.Milestone{
        //A simple loop to reach for the good item because it's cheaper
        // than trying to maintain a map with id => index of array each time 
        // we change something into the $store

        let found = null
        timeline.milestones.forEach(milestone => {
            if(milestone.id == id){
                found = milestone
            } 
        })

        if( found ){
            return found
        } 
        throw new NotFoundException('Struct.Milestone', id)
        
        
    }

    /**
     * Clone properly a <Struct.Milestone> with all its function.
     * @param task the milestone to clone
     * @param nextId the id to apply of the current milestone.id will be used
     * @param suffix the optionnal suffix for label of the cloned object
     * @returns the new milestone cloned
     */
        export function clone(milestone: Struct.Milestone, nextId?: number , suffix:string=""): Struct.Milestone{
            return new Struct.Milestone(nextId?nextId:milestone.id, 
                                    milestone.label + suffix,
                                    milestone.date, 
                                    milestone.isShow
                                    )
        }
}
