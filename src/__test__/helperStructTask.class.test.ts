
import { HelperStructTask } from "$lib/helperStructTask.class";
import { Struct } from "$lib/struct.class";

let task: Struct.Task = new Struct.Task(1,"label",new Date("2020-01-01"), new Date("2020-01-02"), 99, true, "Swim1", 10)
let result:string = "task;label;true;2020-01-01;2020-01-02;99;Swim1"
test("HelperStructTask.join with nominal values", ()=> {
    expect(HelperStructTask.join(task,";")).toBe(result)
})
