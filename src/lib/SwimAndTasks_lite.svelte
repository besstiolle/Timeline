
<script lang="ts">

import { store } from "./stores";

import type { Struct } from "./struct.class";
import { Constantes } from "./constantes";
import TaskLite from "./Task_lite.svelte";

let colors = [
    ["#90BBD8", "#2980B9"],
    ["#86CBBE", "#16A085"],
    ["#C9D9A8", "#9BBB59"],
    ["#F5C984", "#F39C12"],
    ["#DB9891", "#C0392B"],
    ["#C6CECE", "#95A5A6"],
    ["#A191A3", "#4B2C50"]
]


let tasksShown: Struct.Task[] = []
let swimlinesShown: Map<number, Struct.Swimline> = new Map<number, Struct.Swimline>()
let swimlinesHeight: Map<number, number> = new Map<number, number>()
let previousSwimlineId:number = null
let height: number
$store.currentTimeline.tasks.forEach(task => {
    if(task.isShow || $store.currentTimeline.showAll){
        tasksShown.push(task)

        if(task.swimlineId != null && previousSwimlineId != task.swimlineId){
            swimlinesShown.set(task.id, $store.currentTimeline.swimlines[task.swimlineId])
            if(task.isShow && !$store.currentTimeline.showAll){
                height = $store.currentTimeline.swimlines[task.swimlineId].countVisibleTasks * Constantes.GRID.ONE_TASK_H - 0.5
            } else {
                height = $store.currentTimeline.swimlines[task.swimlineId].countAllTasks * Constantes.GRID.ONE_TASK_H - 0.5
            }   
            swimlinesHeight.set(task.id,height)
        }

        previousSwimlineId = task.swimlineId
    }
});

function toggleSwimlineVisibility(event){
    let id = event.currentTarget.id.substring(1)
    let value = !$store.currentTimeline.swimlines[id].isShow
    $store.currentTimeline.tasks.forEach(task => {
        if(task.swimlineId == id) {
            task.isShow = value
        }
    });
    $store.currentTimeline.tasks = $store.currentTimeline.tasks
}
function showToggle(event){
    let id = event.currentTarget.id.substring(1)
    document.getElementById("s"+id).classList.toggle("hidden")
}
    
</script>         

<svg viewBox="{$store.currentTimeline.viewbox}" xmlns="http://www.w3.org/2000/svg" 
    x="0" y="{Constantes.GRID.MILESTONE_H + Constantes.GRID.ANNUAL_H - 5}"
    id='svgSwimlineAndTasks'>
    
{#each tasksShown as task, i}
{#if swimlinesShown.has(task.id)}

    <rect x="0" y="{i * Constantes.GRID.ONE_TASK_H}" 
        width="{Constantes.GRID.ALL_WIDTH}" height="{swimlinesHeight.get(task.id)}"  fill="{colors[i % colors.length][0]}" id="c{task.swimlineId}" 
        on:mouseover={showToggle} on:focus={showToggle} on:mouseout={showToggle} on:blur={showToggle}/>

    <rect x="0" y="{i * Constantes.GRID.ONE_TASK_H}" 
        width="{Constantes.GRID.LEFT_WIDTH}" height="{swimlinesHeight.get(task.id)}" fill="{colors[i % colors.length][1]}" id="d{task.swimlineId}" 
        on:mouseover={showToggle} on:focus={showToggle} on:mouseout={showToggle} on:blur={showToggle}/>
    
    <text text-anchor="middle" x="{Constantes.GRID.LEFT_WIDTH / 2}" y="{i * Constantes.GRID.ONE_TASK_H + 5 + swimlinesHeight.get(task.id) / 2}" 
        font-size="10" fill="{swimlinesShown.get(task.id).isShow?"#ffffff":"#888888"}">{swimlinesShown.get(task.id).label}</text>

    <image xlink:href="{swimlinesShown.get(task.id).isShow?"/hide.png":"/see.png"}" x="0" y="{i * Constantes.GRID.ONE_TASK_H}" height="24" width="24" 
        data-html2canvas-ignore="true" 
        on:click={toggleSwimlineVisibility} id="s{task.swimlineId}" class='toggleVisibility hidden'
        on:mouseover={showToggle} on:focus={showToggle} on:mouseout={showToggle} on:blur={showToggle} />

{/if}
{/each}
</svg>

{#each tasksShown as task, i}
    <TaskLite currentTask={task} i={i}/>
{/each}

<style>
    .toggleVisibility{
        cursor: pointer;
    }
</style>