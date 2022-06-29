<script lang="ts">
import { GRID, MONTHS } from './constantes';


    import { Helpers } from './helpers';
    import { store } from './stores';
    import type { Struct } from './struct.class';

    export let i: number
    export let currentTask: Struct.Task
    export let showActionBar
    export let hideActionBar
    export let downLeft
    export let downRight
    export let downProgress
    
    
    const green = "#16A085";
    const greenStroke = "#117A65";
    const blue = "#2980B9";
    const blueStroke = "#236B99";
    const grey = "#95A5A6";
    const greyStroke = "#9B9B9B";
    const white = "#FFFFFF";
    const rightLabel = "#44546A";
    const leftLabel = "#000000";
    const dottedLine = "#44546A";

    let styleColor = {fill : green, stroke: greenStroke} //default : full
    if(currentTask.hasProgress && currentTask.progress < 100){
        styleColor = {fill : blue, stroke: blueStroke}
    }

    let labelRight:string = currentTask.getStart().getDate() + " " + MONTHS[currentTask.getStart().getMonth()] 
                    + " - " + currentTask.getEnd().getDate() + " " + MONTHS[currentTask.getEnd().getMonth()]
    
    
    let xGrayPosition =  Helpers.getViewportXFromDate(currentTask.getStart(), $store.currentTimeline.getStart(), $store.currentTimeline.getEnd())

    //A quick fix to alterate visualy the end date
    // It will 'fill' the day event if date start = date end
    let fakeEndDate = currentTask.getEnd()
    fakeEndDate.setDate(fakeEndDate.getDate() + 1)

    let x2GrayPosition = Helpers.getViewportXFromDate(fakeEndDate, $store.currentTimeline.getStart(), $store.currentTimeline.getEnd())
    
    let widthGray = x2GrayPosition - xGrayPosition 
    let widthProgress = currentTask.progress * widthGray / 100
    
    let xPercentPosition = xGrayPosition + widthProgress - 5
    let percentTextAnchor = "end"
    if(currentTask.progress < 50){
        xPercentPosition = xGrayPosition + widthProgress + 5
        percentTextAnchor = "start"
    }

    let hasSwimline = currentTask.swimline && currentTask.swimline !== ""
    

</script>
<svg viewBox="{$store.currentTimeline.viewbox}" xmlns="http://www.w3.org/2000/svg" 
    x="0" y="{i * GRID.ONE_TASK_H + GRID.MILESTONE_H + GRID.ANNUAL_H}"
    class="taskSVGSection" id="T{currentTask.id}" on:mouseover={showActionBar} on:focus={showActionBar} on:mouseout={hideActionBar} on:blur={hideActionBar} class:shouldBeHidden={!currentTask.isShow} >
    
        {#if hasSwimline}
        <text text-anchor="end" x="{xGrayPosition - 5}" y="10.5" font-size="9" fill="{leftLabel}" >{currentTask.label}</text>
        {:else}
        <text text-anchor="end" x="{GRID.MIDDLE_X - 5}" y="10.5" font-size="9" fill="{leftLabel}">{currentTask.label}</text>
        <line stroke-dasharray="0.5 2" x1="{GRID.MIDDLE_X}" y1="8" x2="{xGrayPosition - 5}" y2="8" stroke="{dottedLine}" />
        {/if}

        {#if currentTask.hasProgress}
            {#if currentTask.progress < 100}
            <rect x="{xGrayPosition}" y="0" width="{widthGray}" height="15" rx="5" ry="5" fill="{grey}" stroke="{greyStroke}" stroke-width="0.05em"/>    
            {/if}

            <rect id="T{currentTask.id}_progressBar" x="{xGrayPosition}" y="0" width="{widthProgress}" height="15" rx="5" ry="5" fill="{styleColor.fill}" stroke="{styleColor.stroke}" stroke-width="0.05em"/>
            <text id="T{currentTask.id}_plabel" text-anchor="{percentTextAnchor}" x="{xPercentPosition}" y="10.5" fill="{white}">{currentTask.progress}%</text>
        {:else}
        <rect id="T{currentTask.id}_progressBar" x="{xGrayPosition}" y="0" width="{widthGray}" height="15" rx="5" ry="5" fill="{styleColor.fill}" stroke="{styleColor.stroke}" stroke-width="0.05em"/>    
        {/if}

        <text id="T{currentTask.id}_rlabel" x="{x2GrayPosition + 5}" y="10.5" fill="{rightLabel}">{labelRight}</text>
        <!-- Draggable overlay -->
        <rect id="T{currentTask.id}_rec" x="{xGrayPosition}" y="0" width="{widthGray}" class="showable hidden" height="15" rx="5" ry="5" fill="url(#pattern_A)"/> 

        <svg  id="T{currentTask.id}_l" x="{xGrayPosition - 5}" y="10" width="15px" height="15px" viewBox="0 0 20 20" class="grabbable showable hidden">
            <use href="#filler" on:mousedown={downLeft} />
            <use href="#drag_left" fill="{rightLabel}" class="  " on:mousedown={downLeft}/>
        </svg>
        <svg  id="T{currentTask.id}_r" x="{x2GrayPosition - 10}" y="10" width="15px" height="15px" viewBox="0 0 20 20" class="grabbable showable hidden">
            <use href="#filler" on:mousedown={downRight} />
            <use href="#drag_right" fill="{rightLabel}" class="  "  on:mousedown={downRight}/>    
        </svg>
        {#if currentTask.hasProgress}
        <svg  id="T{currentTask.id}_p" x="{xGrayPosition + ((x2GrayPosition - xGrayPosition) / 2) - 10}" y="10" width="15px" height="15px" viewBox="0 0 20 20" class="grabbable showable hidden">
            <use href="#filler"  on:mousedown={downProgress} />
            <use href="#drag_progress" fill="{rightLabel}" class="  "  on:mousedown={downProgress}/>    
        </svg>
        {/if}
        <!-- END overlay-->
</svg>

<style>

    .grabbable{
        cursor:grab;
        display: block;
    }
    :global(.grabbable.grabbing){
        cursor:grabbing;
    }

</style>