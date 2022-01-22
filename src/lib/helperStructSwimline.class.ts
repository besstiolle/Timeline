
import { Struct } from "./struct.class";

export module HelperStructSwimline {

    export function create(data : Struct.Data, label : string):number{
        data.swimlines.push(new Struct.Swimline(label))
        return data.swimlines.length -1
    }
}