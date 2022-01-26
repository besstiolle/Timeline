
import { Struct } from "./struct.class";

export module HelperStructSwimline {

    /**
     * create à insert a new Swimline based on its label. Return the new id/index
     * @param data the Struct.Timeline to insert to
     * @param label the label of the Swimline to create
     * @returns the id/index of the new Swimline.
     */
    export function create(data : Struct.Timeline, label : string):number{
        data.swimlines.push(new Struct.Swimline(label))
        return data.swimlines.length -1
    }
}