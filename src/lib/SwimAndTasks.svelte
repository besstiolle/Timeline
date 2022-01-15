
<script lang="ts">
import { browser } from "$app/env";

import { Constantes } from "./constantes.class";
import { Helpers } from "./helpers.class";
import { store } from "./stores";
import type { Struct } from "./struct.class";
import Task from "./Task.svelte";

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
$store.tasks.forEach(task => {
    if(task.isShow){
        tasksShown.push(task)
    }
});
let mapSwimlines = Helpers.computeMapSwimlines(tasksShown)


let taskId: string = null
let rightLabel: HTMLElement = null
let defaultRightLabelText: string = null
let defaultRightLabelX: string = null
let hoverGroup: boolean = false
let recBox: DOMRect = null
const ACTION = {LEFT:"L", RIGHT:"R"}
let realAction:String = null
let rec:HTMLElement, left:HTMLElement, right:HTMLElement = null
let TActionBarCoord = {REC_X:0, REC_X2:0, L_X:0, R_X:0}
let TActionBarCoordDefault = {REC_X:0, REC_X2:0, L_X:0, R_X:0}
let isDragging:boolean = false

function downLeft(event){
    realAction = ACTION.LEFT
    down(event)
}
function downRight(event){
    realAction = ACTION.RIGHT
    down(event)
}
function down(event){

    //Find the initiale position of our buttons to reset it if necessary
    taskId = event.currentTarget.parentElement.parentElement.id
    rec = document.getElementById(`${taskId}_rec`)
    left = document.getElementById(`${taskId}_l`)
    right = document.getElementById(`${taskId}_r`)
    rightLabel = document.getElementById(`${taskId}_rlabel`)
    recBox = document.getElementById('svgSwimlineAndTasks').getBoundingClientRect()
    
    defaultRightLabelText = rightLabel.innerHTML
    defaultRightLabelX = rightLabel.getAttribute("x")

    TActionBarCoord.REC_X = parseInt(rec.getAttribute("x"))
    TActionBarCoord.REC_X2 = parseInt(rec.getAttribute("x")) + parseInt(rec.getAttribute("width"))
    TActionBarCoord.L_X = parseInt(left.getAttribute("x"))
    TActionBarCoord.R_X = parseInt(right.getAttribute("x"))

    TActionBarCoordDefault.REC_X = parseInt(rec.getAttribute("x"))
    TActionBarCoordDefault.REC_X2 = parseInt(rec.getAttribute("x")) + parseInt(rec.getAttribute("width"))
    TActionBarCoordDefault.L_X = parseInt(left.getAttribute("x"))
    TActionBarCoordDefault.R_X = parseInt(right.getAttribute("x"))
    

    isDragging = true
}
function up(event){
    if(isDragging && hoverGroup){
        let startMS = ((TActionBarCoord.L_X  - Constantes.GRID.MIDDLE_X) * ($store.end.getTime() - $store.start.getTime()) / Constantes.GRID.MIDDLE_WIDTH) + $store.start.getTime()
        let endMS = (TActionBarCoord.REC_X2 - TActionBarCoord.REC_X) * ($store.end.getTime() - $store.start.getTime()) / Constantes.GRID.MIDDLE_WIDTH + startMS

        let task: Struct.Task = $store.getTasksById(parseInt(taskId.substring(1))) //html id = T999 => 999
        if( task ){
            let dateStart: Date = new Date(startMS)
            dateStart.setHours(0,0,0,0)
            
            let dateEnd: Date = new Date(endMS)
            dateEnd.setHours(0,0,0,0)

            task.dateStart = dateStart
            task.dateEnd = dateEnd

            //Re-affection to refresh Svelte
            $store.tasks = $store.tasks
        }
    }
    if(isDragging){
        //hide action bar
        rec.classList.add("hidden")
        left.classList.add("hidden")
        right.classList.add("hidden")

        //Reset default value of the overlay
        rec.setAttribute("x", TActionBarCoordDefault.REC_X.toString())
        rec.setAttribute("width", (TActionBarCoordDefault.REC_X2 - TActionBarCoordDefault.REC_X).toString())
        left.setAttribute("x", TActionBarCoordDefault.L_X.toString())
        right.setAttribute("x", TActionBarCoordDefault.R_X.toString())
    }

    //in all cases  : Reset vars
    taskId = null
    realAction = null
    TActionBarCoord = {REC_X:0, REC_X2:0, L_X:0, R_X:0}
    TActionBarCoordDefault = {REC_X:0, REC_X2:0, L_X:0, R_X:0}
    isDragging = false
    rec = null
    left = null
    right = null
    if(rightLabel){
        rightLabel.innerHTML = defaultRightLabelText
        rightLabel.setAttribute("x", defaultRightLabelX)
    }
    rightLabel = null
    defaultRightLabelText = null

}
function move(event){
    if(!isDragging){
        return;
    }

    //Conversion event.clientX => svg viewport mouse x value
    let mouseX = event.clientX / window.innerWidth * Constantes.GRID.ALL_WIDTH

    hoverGroup = mouseX > recBox.left && mouseX < recBox.right 
                && event.clientY > recBox.top && event.clientY < recBox.bottom

    //Moving right/left HTMLElement on the axe <===> 
    if(hoverGroup){
        let width:number = 0
        if(realAction == ACTION.LEFT){
            //max x = right.x
            //min x = 150
            if(mouseX > TActionBarCoord.R_X || mouseX < Constantes.GRID.MIDDLE_X) {
                return
            }
            //Update left HTMLElement position
            left.setAttribute("x", (mouseX - 5).toString()) 
            TActionBarCoord.L_X = mouseX - 5
            //Update x & width of rec HTMLposition
            width = TActionBarCoord.REC_X2 - mouseX
            rec.setAttribute("x", mouseX.toString())
            rec.setAttribute("width", width.toString())
            TActionBarCoord.REC_X = mouseX
        } else {
            //min x = left.x
            //max x = full size
            if(mouseX < TActionBarCoord.L_X || mouseX > Constantes.GRID.ALL_WIDTH) {
                return
            }
            //Update right HTMLElement position
            right.setAttribute("x", (mouseX - 10).toString()) 
            TActionBarCoord.R_X = mouseX - 10
            //Update width of rec HTMLposition
            width = mouseX - TActionBarCoord.REC_X
            rec.setAttribute("width", (width).toString())
            TActionBarCoord.REC_X2 = mouseX
            //Update right label with new X position
            rightLabel.setAttribute("x", (mouseX + 5).toString())
        }
        // update content of right label
        let dateStart = ((TActionBarCoord.L_X  - Constantes.GRID.MIDDLE_X) * ($store.end.getTime() - $store.start.getTime()) / Constantes.GRID.MIDDLE_WIDTH) + $store.start.getTime()
        let dateEnd = width * ($store.end.getTime() - $store.start.getTime()) / Constantes.GRID.MIDDLE_WIDTH + dateStart
        
        rightLabel.innerHTML = (new Date(dateStart)).getDate() + " " + Constantes.MONTHS[(new Date(dateStart)).getMonth()] 
                   + " - " + (new Date(dateEnd)).getDate() + " " + Constantes.MONTHS[(new Date(dateEnd)).getMonth()]

    }
}

function showActionBar(event){
    //Avoid showing more overlay when we already dragging something
    if(isDragging) {
        return
    } 
    let collection:HTMLCollection = event.currentTarget.getElementsByClassName("showable")
    Array.from(collection).forEach((element) => {
        element.classList.remove("hidden")
    });        
}
function hideActionBar(event){
    //Avoid hiding overlay when we already dragging something
    if(isDragging) {
        return
    }
    let collection:HTMLCollection = event.currentTarget.getElementsByClassName("showable")
    Array.from(collection).forEach((element) => {
        element.classList.add("hidden")
    });
}

</script>         

<svelte:window on:mouseup={up} on:mousemove="{move}"/>
<svg viewBox="{$store.viewbox}" xmlns="http://www.w3.org/2000/svg" 
    x="0" y="{Constantes.GRID.MILESTONE_H + Constantes.GRID.ANNUAL_H - 5}"
    id='svgSwimlineAndTasks'>
    
{#each tasksShown as task, i}
    {#if mapSwimlines.has(i)}

        <rect x="0" y="{i * Constantes.GRID.ONE_TASK_H}" 
            width="{Constantes.GRID.ALL_WIDTH}" height="{mapSwimlines.get(i).countVisibleTasks * Constantes.GRID.ONE_TASK_H - 0.5}" 
            fill="{colors[i % colors.length][0]}"/>

        <rect x="0" y="{i * Constantes.GRID.ONE_TASK_H}" 
            width="{Constantes.GRID.LEFT_WIDTH}" height="{mapSwimlines.get(i).countVisibleTasks * Constantes.GRID.ONE_TASK_H - 0.5}" 
            fill="{colors[i % colors.length][1]}"/>

        <text text-anchor="middle" x="{Constantes.GRID.LEFT_WIDTH / 2}" y="{i * Constantes.GRID.ONE_TASK_H + mapSwimlines.get(i).countVisibleTasks * Constantes.GRID.ONE_TASK_H / 2}" 
            font-size="10" fill="#FFFFFF">{mapSwimlines.get(i).label}</text>

    {/if}
{/each}
</svg>

{#each tasksShown as task, i}
    <Task currentTask={task} i={i} showActionBar={showActionBar} hideActionBar={hideActionBar} downRight={downRight} downLeft={downLeft} />
{/each}

