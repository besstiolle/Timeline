import { HelperStructSwimline } from "$lib/helperStructSwimline.class";
import { Struct } from "$lib/struct.class";

function testCreate(){

    let timeline = new Struct.Timeline("key", "title")
    HelperStructSwimline.create(timeline, "swimline1")
    let index2 = HelperStructSwimline.create(timeline, "swimline2")
    HelperStructSwimline.create(timeline, "swimline3")

    test("HelperStructSwimline.create with nominal values", ()=> {
        expect(index2).toBe(1)
        expect(timeline.swimlines.length).toBe(3)
        expect(timeline.swimlines[index2].label).toBe("swimline2")
    })

}
testCreate()