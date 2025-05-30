
import { Swimline, Timeline } from "./struct.class";

export class FactorySwimline {

    /**
     * create à insert a new Swimline based on its label. Return the new id/index
     * @param timeline the Timeline to insert to
     * @param label the label of the Swimline to create
     * @returns the id/index of the new Swimline.
     */
    static create(timeline : Timeline, label : string):number{
        timeline.swimlines.push(new Swimline(label))
        return timeline.swimlines.length -1
    }
}