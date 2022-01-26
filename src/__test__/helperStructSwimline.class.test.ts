import { HelperStructSwimline } from "$lib/helperStructSwimline.class";
import { Struct } from "$lib/struct.class";

function testCreate(){

    let data = new Struct.Timeline("key", "title")
    HelperStructSwimline.create(data, "swimline1")
    let index2 = HelperStructSwimline.create(data, "swimline2")
    HelperStructSwimline.create(data, "swimline3")

    test("HelperStructSwimline.create with nominal values", ()=> {
        expect(index2).toBe(1)
        expect(data.swimlines.length).toBe(3)
        expect(data.swimlines[index2].label).toBe("swimline2")
    })

}
testCreate()