import { FactoryMilestone } from "./factoryMilestone";
import { FactoryTask } from "./factoryTask";
import type { Struct } from "./struct.class";

const RC:string = '\r\n'
const SEPARATOR:string = ';'
const VERSION:string = '1.1'

export function goCsv(currentTimeline: Struct.Timeline):string{
    let buffer = ''
    
    buffer += 'version' + SEPARATOR + VERSION + RC
    buffer += 'title' + SEPARATOR + currentTimeline.title + RC
    buffer += currentTimeline.tasks.map(e => FactoryTask.join(e, SEPARATOR)).join(RC) + RC
    buffer += currentTimeline.milestones.map(e => FactoryMilestone.join(e, SEPARATOR)).join(RC) + RC
    console.info(buffer)
    return buffer
}
