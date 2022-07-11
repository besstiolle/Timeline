
<script lang="ts">

import { store } from "./stores";

import type { Struct } from "./struct.class";
import { COLORS, GRID, MONTHS } from "./constantes";
import { Helpers } from "./helpers";

import Task from "./Task.svelte";
import { FactoryTask } from "./factoryTask";

let tasksToShow: Struct.Task[] = []
let swimlinesToShow: Map<number, Object> = new Map<number, Object>()
let previousSwimlineId:number = null
let height: number
let position: number = 0
$store.currentTimeline.tasks.forEach(task => {
    if(task.isShow || $store.currentTimeline.showAll){
        tasksToShow.push(task)

        if(task.swimlineId != null && previousSwimlineId != task.swimlineId){
            if(task.isShow && !$store.currentTimeline.showAll){
                height = $store.currentTimeline.swimlines[task.swimlineId].countVisibleTasks * GRID.ONE_TASK_H - 0.5
            } else {
                height = $store.currentTimeline.swimlines[task.swimlineId].countAllTasks * GRID.ONE_TASK_H - 0.5
            }   

            swimlinesToShow.set(task.id, {
                'timeline':$store.currentTimeline.swimlines[task.swimlineId],
                'position':position,
                'height':height
                })

            position++
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
    //Security : we can't manipulate data if we are a simple Reader
    if($store.rights.isReader()){return}

    realAction = ACTION.LEFT
    down(event)
}
function downRight(event){
    //Security : we can't manipulate data if we are a simple Reader
    if($store.rights.isReader()){return}
    
    realAction = ACTION.RIGHT
    down(event)
}
function downProgress(event){
    //Security : we can't manipulate data if we are a simple Reader
    if($store.rights.isReader()){return}
    
    realAction = ACTION.PROGRESS
    down(event)
}
function down(event){
    //Security : we can't manipulate data if we are a simple Reader
    if($store.rights.isReader()){return}
    
    //Find the initiale position of our buttons to reset it if necessary
    taskId = event.currentTarget.parentElement.parentElement.id
    rec = document.getElementById(`${taskId}_rec`)
    left = document.getElementById(`${taskId}_l`)
    right = document.getElementById(`${taskId}_r`)
    rightLabel = document.getElementById(`${taskId}_rlabel`)
    let ghostElement = document.getElementById(`ghost`)
    progress = document.getElementById(`${taskId}_p`)
    if(progress === null){
        progress = ghostElement
    }
    progressBar = document.getElementById(`${taskId}_progressBar`)
    progressBarLabel = document.getElementById(`${taskId}_plabel`)
    if(progressBarLabel === null ){
        progressBarLabel = ghostElement
    }
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
    //Security : we can't manipulate data if we are a simple Reader
    if($store.rights.isReader()){return}
    
    if(isDragging && hoverGroup){
        let task: Struct.Task = null
        try{
            task = FactoryTask.getById($store.currentTimeline, parseInt(taskId.substring(1))) //html id = T999 => 999
        } catch (NotFoundException){
            //Nothing to do, the rest of the function will clean everything
        }

        if( task ){
            if(realAction == ACTION.LEFT || realAction == ACTION.RIGHT) {
                let dateStart = Helpers.getDateFromViewportX(TActionBarCoord.REC_X, $store.currentTimeline.getStart(), $store.currentTimeline.getEnd())
                let dateEnd = Helpers.getDateFromViewportX(TActionBarCoord.REC_X2, $store.currentTimeline.getStart(), $store.currentTimeline.getEnd())

                dateStart.setHours(0,0,0,0)
                dateEnd.setHours(0,0,0,0)

                task.setStart(dateStart)
                task.setEnd(dateEnd)
            } else if(realAction == ACTION.PROGRESS) {
                let viewportX:number = event.clientX / window.innerWidth * GRID.ALL_WIDTH

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

            $store.currentTimeline.tasks = $store.currentTimeline.tasks
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

        if(progressBarLabel){
            progressBarLabel.innerHTML=defaultProgressBarLabelText
        }
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
    //Security : we can't manipulate data if we are a simple Reader
    if($store.rights.isReader()){return}
    
    if(!isDragging){
        return;
    }

    //Conversion event.clientX => svg viewport mouse x value
    let viewportX:number = event.clientX / window.innerWidth * GRID.ALL_WIDTH
    if(realAction == ACTION.LEFT || realAction == ACTION.RIGHT) {
        moveResizing(event, viewportX)
    } else if(realAction == ACTION.PROGRESS) {
        moveProgress(event, viewportX)
    }
}
function moveProgress(event, viewportX:number){
    //Security : we can't manipulate data if we are a simple Reader
    if($store.rights.isReader()){return}
    
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
    //Security : we can't manipulate data if we are a simple Reader
    if($store.rights.isReader()){return}
    
    hoverGroup = viewportX > recBox.left && viewportX < recBox.right 
                && event.clientY > recBox.top && event.clientY < recBox.bottom

    //Moving right/left HTMLElement on the axe <===> 
    if(hoverGroup){
        let width:number = 0
        if(realAction == ACTION.LEFT){
            //max x = right.x
            //min x = 150
            if(viewportX > TActionBarCoord.REC_X2 || viewportX < GRID.MIDDLE_X) {
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
            if(viewportX < TActionBarCoord.REC_X || viewportX > GRID.ALL_WIDTH) {
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
        let dateStart = Helpers.getDateFromViewportX(TActionBarCoord.REC_X, $store.currentTimeline.getStart(), $store.currentTimeline.getEnd())
        let dateEnd = Helpers.getDateFromViewportX(TActionBarCoord.REC_X2, $store.currentTimeline.getStart(), $store.currentTimeline.getEnd())
        
        rightLabel.innerHTML = (dateStart).getDate() + " " + MONTHS[(dateStart).getMonth()] 
                   + " - " + (dateEnd).getDate() + " " + MONTHS[(dateEnd).getMonth()]

    }
}

function showActionBar(event){
    //Security : we can't manipulate data if we are a simple Reader
    if($store.rights.isReader()){return}
    
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
    //Security : we can't manipulate data if we are a simple Reader
    if($store.rights.isReader()){return}
    
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

<svelte:window on:mouseup={up} on:mousemove="{move}"/>
<svg viewBox="{$store.currentTimeline.viewbox}" xmlns="http://www.w3.org/2000/svg" 
    x="0" y="{GRID.MILESTONE_H + GRID.ANNUAL_H - 5}"
    id='svgSwimlineAndTasks'>
    
{#each tasksToShow as task, i}
{#if swimlinesToShow.has(task.id)}

    <rect x="0" y="{i * GRID.ONE_TASK_H}" 
        width="{GRID.ALL_WIDTH}" height="{swimlinesToShow.get(task.id)['height']}"  
        fill="{COLORS[swimlinesToShow.get(task.id)['position'] % COLORS.length][0]}" id="c{task.swimlineId}" 
        on:mouseover={showToggle} on:focus={showToggle} on:mouseout={showToggle} on:blur={showToggle}/>

    <rect x="0" y="{i * GRID.ONE_TASK_H}" 
        width="{GRID.LEFT_WIDTH}" height="{swimlinesToShow.get(task.id)['height']}" fill="{COLORS[swimlinesToShow.get(task.id)['position'] % COLORS.length][1]}" id="d{task.swimlineId}" 
        on:mouseover={showToggle} on:focus={showToggle} on:mouseout={showToggle} on:blur={showToggle}/>
    
    <text text-anchor="middle" x="{GRID.LEFT_WIDTH / 2}" y="{i * GRID.ONE_TASK_H + 5 + swimlinesToShow.get(task.id)['height'] / 2}" 
        font-size="10" fill="{swimlinesToShow.get(task.id)['timeline'].isShow?"#ffffff":"#888888"}">{swimlinesToShow.get(task.id)['timeline'].label}</text>

    <image xlink:href="{swimlinesToShow.get(task.id)['timeline'].isShow?"/hide.png":"/see.png"}" x="0" y="{i * GRID.ONE_TASK_H}" height="24" width="24" 
        data-html2canvas-ignore="true" 
        on:click={toggleSwimlineVisibility} id="s{task.swimlineId}" class='toggleVisibility hidden'
        on:mouseover={showToggle} on:focus={showToggle} on:mouseout={showToggle} on:blur={showToggle} />
{:else}
    <rect x="0" y="{i * GRID.ONE_TASK_H}" 
        width="{GRID.ALL_WIDTH}" height="{GRID.ONE_TASK_H - 0.5}" fill="transparent"/>
{/if}
{/each}

</svg>

{#each tasksToShow as task, i}
    <Task currentTask={task} i={i} showActionBar={showActionBar} hideActionBar={hideActionBar} downRight={downRight} downLeft={downLeft} downProgress={downProgress}/>
{/each}
<tspan id='ghost' x='-1000'/>

<style>
    .toggleVisibility{
        cursor: pointer;
    }
</style>