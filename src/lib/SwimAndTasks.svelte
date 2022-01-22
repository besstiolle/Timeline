
<script lang="ts">

import { store } from "./stores";
import type { Struct } from "./struct.class";
import { Constantes } from "./constantes.class";
import { Helpers } from "./helpers.class";
import { HelperStructData } from "./helperStructData.class";

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
let swimlinesShown: Map<number, Struct.Swimline> = new Map<number, Struct.Swimline>()
let swimlinesHeight: Map<number, number> = new Map<number, number>()
let previousSwimlineId:number = null
let height: number
$store.tasks.forEach(task => {
    if(task.isShow || $store.showAll){
        tasksShown.push(task)

        if(task.swimlineId != null && previousSwimlineId != task.swimlineId){
            swimlinesShown.set(task.id, $store.swimlines[task.swimlineId])
            if(task.isShow && !$store.showAll){
                height = $store.swimlines[task.swimlineId].countVisibleTasks * Constantes.GRID.ONE_TASK_H - 0.5
            } else {
                height = $store.swimlines[task.swimlineId].countAllTasks * Constantes.GRID.ONE_TASK_H - 0.5
            }   
            swimlinesHeight.set(task.id,height)
        }

        previousSwimlineId = task.swimlineId
    }
});

let taskId: string = null
let rightLabel: HTMLElement = null
let defaultRightLabelText: string = null
let defaultRightLabelX: string = null
let progressBar: HTMLElement = null
let progressBarLabel: HTMLElement = null
let defaultProgressBarLabelText: string = null
let defaultProgressBarWidth: number = null
let hoverGroup: boolean = false
let recBox: DOMRect = null
const ACTION = {LEFT:"L", RIGHT:"R", PROGRESS:"P"}
let realAction:String = null
let rec:HTMLElement, left:HTMLElement, right:HTMLElement , progress:HTMLElement = null
let TActionBarCoord = {REC_X:0, REC_X2:0, L_X:0, R_X:0, P_X:0}
let TActionBarCoordDefault = {REC_X:0, REC_X2:0, L_X:0, R_X:0, P_X:0}
let isDragging:boolean = false

function downLeft(event){
    realAction = ACTION.LEFT
    down(event)
}
function downRight(event){
    realAction = ACTION.RIGHT
    down(event)
}
function downProgress(event){
    realAction = ACTION.PROGRESS
    down(event)
}
function down(event){


    //Find the initiale position of our buttons to reset it if necessary
    taskId = event.currentTarget.parentElement.parentElement.id
    rec = document.getElementById(`${taskId}_rec`)
    left = document.getElementById(`${taskId}_l`)
    right = document.getElementById(`${taskId}_r`)
    rightLabel = document.getElementById(`${taskId}_rlabel`)
    progress = document.getElementById(`${taskId}_p`)
    progressBar = document.getElementById(`${taskId}_progressBar`)
    progressBarLabel = document.getElementById(`${taskId}_plabel`)
    recBox = document.getElementById('svgSwimlineAndTasks').getBoundingClientRect()
    
    defaultRightLabelText = rightLabel.innerHTML
    defaultRightLabelX = rightLabel.getAttribute("x")

    defaultProgressBarLabelText = progressBarLabel.innerHTML
    defaultProgressBarWidth = parseInt(progressBar.getAttribute("width"))

    TActionBarCoord.REC_X = parseInt(rec.getAttribute("x"))
    TActionBarCoord.REC_X2 = parseInt(rec.getAttribute("x")) + parseInt(rec.getAttribute("width"))
    TActionBarCoord.L_X = parseInt(left.getAttribute("x"))
    TActionBarCoord.R_X = parseInt(right.getAttribute("x"))
    TActionBarCoord.P_X = parseInt(progress.getAttribute("x"))
    TActionBarCoordDefault.REC_X = parseInt(rec.getAttribute("x"))
    TActionBarCoordDefault.REC_X2 = parseInt(rec.getAttribute("x")) + parseInt(rec.getAttribute("width"))
    TActionBarCoordDefault.L_X = parseInt(left.getAttribute("x"))
    TActionBarCoordDefault.R_X = parseInt(right.getAttribute("x"))
    TActionBarCoordDefault.P_X = parseInt(progress.getAttribute("x"))

    //Update CSS of buttons
    left.classList.add("grabbing")
    right.classList.add("grabbing")
    progress.classList.add("grabbing")

    isDragging = true
}
function up(event){
    if(isDragging && hoverGroup){

        let task: Struct.Task = HelperStructData.getTasksById($store, parseInt(taskId.substring(1))) //html id = T999 => 999
        if( task ){
            if(realAction == ACTION.LEFT || realAction == ACTION.RIGHT) {
                let dateStart = Helpers.getDateFromViewportX(TActionBarCoord.REC_X, $store.start, $store.end)
                let dateEnd = Helpers.getDateFromViewportX(TActionBarCoord.REC_X2, $store.start, $store.end)

                dateStart.setHours(0,0,0,0)
                dateEnd.setHours(0,0,0,0)

                task.dateStart = dateStart
                task.dateEnd = dateEnd
            } else if(realAction == ACTION.PROGRESS) {
                let viewportX:number = event.clientX / window.innerWidth * Constantes.GRID.ALL_WIDTH

                //We allow an "hover" zone all left/right but we don't want really "dragging" things too left or too right
                if(viewportX > TActionBarCoord.REC_X2){
                    viewportX = TActionBarCoord.REC_X2
                }
                if(viewportX < TActionBarCoord.REC_X){
                    viewportX = TActionBarCoord.REC_X
                }

                let progressValue:number = (viewportX - TActionBarCoord.REC_X) / (TActionBarCoord.REC_X2 - TActionBarCoord.REC_X) * 100
                task.progress = Math.round(progressValue)
            }

            $store.tasks = $store.tasks
        }
    }
    if(isDragging){
        //hide action bar
        rec.classList.add("hidden")
        left.classList.add("hidden")
        right.classList.add("hidden")
        progress.classList.add("hidden")

        //Reset default value of the overlay
        rec.setAttribute("x", TActionBarCoordDefault.REC_X.toString())
        rec.setAttribute("width", (TActionBarCoordDefault.REC_X2 - TActionBarCoordDefault.REC_X).toString())
        left.setAttribute("x", TActionBarCoordDefault.L_X.toString())
        right.setAttribute("x", TActionBarCoordDefault.R_X.toString())
        progress.setAttribute("x", TActionBarCoordDefault.P_X.toString())
        
        //Update CSS of buttons
        left.classList.remove("grabbing")
        right.classList.remove("grabbing")
        progress.classList.remove("grabbing")

        progressBarLabel.innerHTML=defaultProgressBarLabelText
        progressBar.setAttribute("width", defaultProgressBarWidth.toString())
    }

    //in all cases  : Reset vars
    taskId = null
    realAction = null
    TActionBarCoord = {REC_X:0, REC_X2:0, L_X:0, R_X:0, P_X:0}
    TActionBarCoordDefault = {REC_X:0, REC_X2:0, L_X:0, R_X:0, P_X:0}
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
    
    progressBar = null
    progressBarLabel = null
    defaultProgressBarLabelText = null
    defaultProgressBarWidth = null

}
function move(event){
    if(!isDragging){
        return;
    }

    //Conversion event.clientX => svg viewport mouse x value
    let viewportX:number = event.clientX / window.innerWidth * Constantes.GRID.ALL_WIDTH
    if(realAction == ACTION.LEFT || realAction == ACTION.RIGHT) {
        moveResizing(event, viewportX)
    } else if(realAction == ACTION.PROGRESS) {
        moveProgress(event, viewportX)
    }
}
function moveProgress(event, viewportX:number){
    hoverGroup = viewportX > recBox.left && viewportX < recBox.right
                && event.clientY > recBox.top && event.clientY < recBox.bottom
    
    if(hoverGroup){

        //We allow an "hover" zone all left/right but we don't want really "dragging" things too left or too right
        if(viewportX > TActionBarCoord.REC_X2){
            viewportX = TActionBarCoord.REC_X2
        }
        if(viewportX < TActionBarCoord.REC_X){
            viewportX = TActionBarCoord.REC_X
        }

        let progressValue:number = (viewportX - TActionBarCoord.REC_X) / (TActionBarCoord.REC_X2 - TActionBarCoord.REC_X) * 100
        let widthProgress:number = viewportX - TActionBarCoord.REC_X
        progress.setAttribute("x", viewportX.toString())
        TActionBarCoord.P_X = viewportX
        progressBar.setAttribute("width", widthProgress.toString())
        let percentTextAnchor:string = "end"
        let varX: number = -5
        if(progressValue < 50){
            percentTextAnchor = "start"
            varX = 5
        }
        progressBarLabel.setAttribute("x", (viewportX + varX).toString())
        progressBarLabel.setAttribute("text-anchor", percentTextAnchor)
        progressBarLabel.innerHTML = Math.round(progressValue).toString() + "%"

    } else {

    }
}
function moveResizing(event, viewportX:number){
    hoverGroup = viewportX > recBox.left && viewportX < recBox.right 
                && event.clientY > recBox.top && event.clientY < recBox.bottom

    //Moving right/left HTMLElement on the axe <===> 
    if(hoverGroup){
        let width:number = 0
        if(realAction == ACTION.LEFT){
            //max x = right.x
            //min x = 150
            if(viewportX > TActionBarCoord.REC_X2 || viewportX < Constantes.GRID.MIDDLE_X) {
                return
            }
            //Update left HTMLElement position
            left.setAttribute("x", (viewportX - 5).toString()) 
            TActionBarCoord.L_X = viewportX - 5
            //Update x & width of rec HTMLposition
            width = TActionBarCoord.REC_X2 - viewportX
            rec.setAttribute("x", viewportX.toString())
            rec.setAttribute("width", width.toString())
            TActionBarCoord.REC_X = viewportX
        } else if(realAction == ACTION.RIGHT) {
            //min x = left.x
            //max x = full size
            if(viewportX < TActionBarCoord.REC_X || viewportX > Constantes.GRID.ALL_WIDTH) {
                return
            }
            //Update right HTMLElement position
            right.setAttribute("x", (viewportX - 10).toString()) 
            TActionBarCoord.R_X = viewportX - 10
            //Update width of rec HTMLposition
            width = viewportX - TActionBarCoord.REC_X
            rec.setAttribute("width", (width).toString())
            TActionBarCoord.REC_X2 = viewportX
            //Update right label with new X position
            rightLabel.setAttribute("x", (viewportX + 5).toString())
        }
        // update content of right label
        let dateStart = Helpers.getDateFromViewportX(TActionBarCoord.REC_X, $store.start, $store.end)
        let dateEnd = Helpers.getDateFromViewportX(TActionBarCoord.REC_X2, $store.start, $store.end)
        
        rightLabel.innerHTML = (dateStart).getDate() + " " + Constantes.MONTHS[(dateStart).getMonth()] 
                   + " - " + (dateEnd).getDate() + " " + Constantes.MONTHS[(dateEnd).getMonth()]

    }
}

function showActionBar(event){
    //Avoid showing more overlay when we already grabbing something
    if(isDragging) {
        return
    } 
    let collection:HTMLCollection = event.currentTarget.getElementsByClassName("showable")
    Array.from(collection).forEach((element) => {
        element.classList.remove("hidden")
    });        
}
function hideActionBar(event){
    //Avoid hiding overlay when we already grabbing something
    if(isDragging) {
        return
    }
    let collection:HTMLCollection = event.currentTarget.getElementsByClassName("showable")
    Array.from(collection).forEach((element) => {
        element.classList.add("hidden")
    });
}

function toggleSwimlineVisibility(event){
    let id = event.currentTarget.id.substring(1)
    let value = !$store.swimlines[id].isShow
    $store.tasks.forEach(task => {
        if(task.swimlineId == id) {
            task.isShow = value
        }
    });
    $store.tasks = $store.tasks
}
function showToggle(event){
    let id = event.currentTarget.id.substring(1)
    document.getElementById("s"+id).classList.toggle("hidden")
}
    
</script>         

<svelte:window on:mouseup={up} on:mousemove="{move}"/>
<svg viewBox="{$store.viewbox}" xmlns="http://www.w3.org/2000/svg" 
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
    <Task currentTask={task} i={i} showActionBar={showActionBar} hideActionBar={hideActionBar} downRight={downRight} downLeft={downLeft} downProgress={downProgress}/>
{/each}

<style>
    .toggleVisibility{
        cursor: pointer;
    }
</style>