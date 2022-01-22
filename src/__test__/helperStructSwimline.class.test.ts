
import { HelperStructMilestone } from "$lib/helperStructMilestone.class";
import { Struct } from "$lib/struct.class";

let milestone: Struct.Milestone = new Struct.Milestone(1,"label",new Date("2020-01-01"), true)
let result:string = "milestone;label;true;2020-01-01"
test("HelperStructMilestone.join with nominal values", ()=> {
    expect(HelperStructMilestone.join(milestone,";")).toBe(result)
})
