
import { HelperStructMilestone } from "$lib/helperStructMilestone.class";
import { Struct } from "$lib/struct.class";

function testJoin(){
    let milestone: Struct.Milestone = new Struct.Milestone(1,"label",new Date("2020-01-01"), true)
    let result:string = "milestone;label;true;2020-01-01"
    test("HelperStructMilestone.join with nominal values", ()=> {
        expect(HelperStructMilestone.join(milestone,";")).toBe(result)
    })
}
testJoin()

function testGetById(){
    let milestone1: Struct.Milestone = new Struct.Milestone(1,"label 1",new Date("2020-01-01"), true)
    let milestone2: Struct.Milestone = new Struct.Milestone(2,"label 2",new Date("2020-01-01"), true)
    let milestone3: Struct.Milestone = new Struct.Milestone(3,"label 3",new Date("2020-01-01"), true)
    let milestone4: Struct.Milestone = new Struct.Milestone(4,"label 4",new Date("2020-01-01"), true)
    let data = new Struct.Timeline("key", "title")
    data.milestones.push(milestone1)
    data.milestones.push(milestone2)
    data.milestones.push(milestone3)
    data.milestones.push(milestone4)

    test("HelperStructMilestone.getById with nominal values", ()=> {
        expect(HelperStructMilestone.getById(data, 2)).toBe(milestone2)
    })

    test("HelperStructMilestone.getById with unknow values", ()=> {
        try {
            HelperStructMilestone.getById(data, 10)
        } catch (e) {
            expect(e).toBe("Struct.Milestone with id 10 was not found")
        }
    })
}
testGetById()