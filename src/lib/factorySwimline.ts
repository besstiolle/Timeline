
import { Struct } from "./struct.class";

export namespace FactorySwimline {

    /**
     * create à insert a new Swimline based on its label. Return the new id/index
     * @param timeline the Struct.Timeline to insert to
     * @param label the label of the Swimline to create
     * @returns the id/index of the new Swimline.
     */
    export function create(timeline : Struct.Timeline, label : string):number{
        timeline.swimlines.push(new Struct.Swimline(label))
        return timeline.swimlines.length -1
    }
}