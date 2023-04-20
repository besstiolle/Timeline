<script lang="ts">

import { store } from './stores';
import { Helpers } from './helpers';
import { Struct } from './struct.class';
import { FactoryTimeline } from './factoryTimeline';
import { LIVE_PREFIX } from './constantes';
import { FactoryTask } from './factoryTask';

export let getIndex = (event:Event) => {return 0}
export let updateStore =  (prefix:string, position:number) => {}

function updateProgression(position:number){
    let elm = document.getElementById(LIVE_PREFIX.PR + position) as HTMLInputElement
    let value = 0 
    if(elm.value.match(/^([0-9]+)$/g)) {
        value = parseInt(elm.value)
    }

    if(value > 100){
        value = 100
    } 
    
    $store.currentTimeline.tasks[position].progress = value
    //$store.currentTimeline.tasks = $store.currentTimeline.tasks
        
}

function b_delete(event:Event){
    $store.currentTimeline.tasks.splice(getIndex(event), 1)
    $store.currentTimeline.tasks = $store.currentTimeline.tasks
}
function b_up(event:Event){
    let index = getIndex(event)
    if(index == 0){
        return;
    }
    let tmpTask: Struct.Task = $store.currentTimeline.tasks[index]
    $store.currentTimeline.tasks[index] = $store.currentTimeline.tasks[index - 1]
    $store.currentTimeline.tasks[index - 1] = tmpTask
    $store.currentTimeline.tasks = $store.currentTimeline.tasks
}
function b_down(event:Event){
    let index = getIndex(event)
    if(index == ($store.currentTimeline.tasks.length-1)){
        return;
    }
    let tmpTask: Struct.Task = $store.currentTimeline.tasks[index]
    $store.currentTimeline.tasks[index] = $store.currentTimeline.tasks[index + 1]
    $store.currentTimeline.tasks[index + 1] = tmpTask
    $store.currentTimeline.tasks = $store.currentTimeline.tasks
}
function b_show(event:Event){
    let index = getIndex(event)
    $store.currentTimeline.tasks[index].isShow = !$store.currentTimeline.tasks[index].isShow 
}
function b_duplicate(event:Event){
    let index = getIndex(event)
    let tmpTasks : Array<Struct.Task> = $store.currentTimeline.tasks.splice(index+1, $store.currentTimeline.tasks.length)

    FactoryTimeline.addTask($store.currentTimeline, 
                            FactoryTask.clone($store.currentTimeline.tasks[index],
                                              $store.currentTimeline.getNextId()))
    tmpTasks.forEach(tmpTask => {
        FactoryTimeline.addTask($store.currentTimeline, tmpTask)
    });
    $store.currentTimeline.tasks = $store.currentTimeline.tasks
}
function b_add(){
    let diffSec : number = $store.currentTimeline.getEndTime() - $store.currentTimeline.getStartTime()
    FactoryTimeline.addTask($store.currentTimeline, new Struct.Task(
            $store.currentTimeline.getNextId(),
            "Some task", 
            Helpers.toYYYY_MM_DD(new Date($store.currentTimeline.getStartTime() + (0.1 * diffSec))), 
            Helpers.toYYYY_MM_DD(new Date($store.currentTimeline.getEndTime() - (0.1 * diffSec))),
            true,
            0,
            true,
            "",
            -1))
    $store.currentTimeline.tasks = $store.currentTimeline.tasks
}

</script>


{#each $store.currentTimeline.tasks as task, i}
<div class="live__line show_{task.isShow}">
    <div class='live__input_top'>
        <div data-name="M{i}"  class="live_cmd" on:click="{b_show}" on:keydown="{b_show}" title="hide/show this line">
            <svg viewBox="0 0 20 20">
                <use x="0" y="0" href="#b_show"/>
            </svg>
        </div>
        <div data-name="T{i}"  class="live_cmd" on:click="{b_up}" on:keydown="{b_up}" title="go down this line">
            <svg viewBox="0 0 20 20">
                <use x="0" y="0" href="#b_up"/>
            </svg>
        </div>
        <div data-name="T{i}"  class="live_cmd" on:click="{b_down}" on:keydown="{b_down}" title="go up this line">
            <svg viewBox="0 0 20 20">
                <use x="0" y="0" href="#b_down"/>
            </svg>
        </div>
        <div data-name="T{i}"  class="live_cmd" on:click="{b_duplicate}" on:keydown="{b_duplicate}" title="duplicate this line">
            <svg viewBox="0 0 20 20">
                <use x="0" y="0" href="#b_duplicate"/>
            </svg>
        </div>
        <div data-name="T{i}"  class="live_cmd live_cmd_red" on:click="{b_delete}" on:keydown="{b_delete}" title="delete this line">
            <svg viewBox="0 0 20 20">
                <use x="0" y="0" href="#b_delete"/>
            </svg>
        </div>
        <input type="text" bind:value="{task.label}" class="label"/>
        <input type="date" id="{LIVE_PREFIX.TS}{i}" value="{task.dateStart}" min="1900-01-01" max="2999-12-31" on:change={() => updateStore(LIVE_PREFIX.TS, i)} on:blur={() => updateStore(LIVE_PREFIX.TS, i)}>
        <input type="date" id="{LIVE_PREFIX.TE}{i}" value="{task.dateEnd}" min="1900-01-01" max="2999-12-31" on:change={() => updateStore(LIVE_PREFIX.TE, i)} on:blur={() => updateStore(LIVE_PREFIX.TE, i)}>
        <input type="text" bind:value="{task.swimline}" class="label"/>
        <input type="number" id={LIVE_PREFIX.PR}{i} value="{task.progress}" min="0" max="100" class="progress" on:change={() => updateProgression(i)} on:blur={() => updateProgression(i)}/>
        <progress max="100" value="{task.progress}"> {task.progress}% </progress>
    </div>
    <div class='live__input_bottom'>
        <label for="hasProgress{i}">Show Progression : </label><input type="checkbox" bind:checked="{task.hasProgress}"  name="hasProgress{i}" id="hasProgress{i}" />
    </div>
</div>
{/each}
<div class="live__action">
    <div class="live__action__button" on:click="{b_add}" on:keydown="{b_add}" >
        <svg class="svg-icon" viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_add"/>
        </svg>
        <span>Add a new Task</span>
    </div>
</div>
   