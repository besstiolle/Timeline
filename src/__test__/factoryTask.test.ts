
import { FactoryTask } from "$lib/factoryTask";
import { Struct } from "$lib/struct.class";
import { NotFoundException } from "$lib/timelineException.class";


function testJoin(){
    let task: Struct.Task = new Struct.Task(1,"label","2020-01-01", "2020-01-02", 99, true, "Swim1", 10)
    let result:string = "task;label;true;2020-01-01;2020-01-02;99;Swim1"
    test("FactoryTask.join with nominal values", ()=> {
        expect(FactoryTask.join(task,";")).toBe(result)
    })
}
testJoin()

function testGetById(){
    let task1 = new Struct.Task(1,"label 1", "2022-01-01", "2022-02-01", 100, true, "Swimline 1", 5)
    let task2 = new Struct.Task(2,"label 2", "2022-01-01", "2022-02-01", 100, true, "Swimline 1", 5)
    let task3 = new Struct.Task(3,"label 3", "2022-01-01", "2022-02-01", 100, true, "Swimline 1", 5)
    let task4 = new Struct.Task(4,"label 4", "2022-01-01", "2022-02-01", 100, true, "Swimline 1", 5)
    
    let timeline = new Struct.Timeline("key", "title")
    timeline.tasks.push(task1)
    timeline.tasks.push(task2)
    timeline.tasks.push(task3)
    timeline.tasks.push(task4)

    test("FactoryTask.getById with nominal values", ()=> {
        expect(FactoryTask.getById(timeline, 2)).toBe(task2)
    })

    //Mock console.error() to avoid jest panic
    jest.spyOn(console, 'error').mockImplementation(() => {});

    test("FactoryTask.getById with unknow values", ()=> {
        expect(() => {
            FactoryTask.getById(timeline, 10)
        }).toThrow(NotFoundException);
    })
}
testGetById()

function testClone(){
    let task1 = new Struct.Task(1,"label 1", "2022-01-01", "2022-02-01", 100, true, "Swimline 1", 5)
    let task2 = FactoryTask.clone(task1)

    test("FactoryTask.clone and check memory pointer", ()=> {
        expect(task1).not.toBe(task2)
        expect(task1).toStrictEqual(task2)
    })
}
testClone()