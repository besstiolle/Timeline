<script lang="ts">

    import { Constantes } from './constantes.class';
    import { store } from './stores';
    import type { Struct } from './struct.class';

    export let i: number;
    export let currentTask: Struct.Task
    
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


    let styleColor = `fill: ${green}; stroke: ${greenStroke};` //default : full
    if(currentTask.progress < 100){
        styleColor = `fill: ${blue}; stroke: ${blueStroke};`
    }

    let labelRight:string = currentTask.dateStart.getDate() + " " + Constantes.MONTHS[currentTask.dateStart.getMonth()] 
                    + " - " + currentTask.dateEnd.getDate() + " " + Constantes.MONTHS[currentTask.dateEnd.getMonth()]
    
    let widthGray = (currentTask.dateEnd.getTime() - currentTask.dateStart.getTime()) / ($store.end.getTime() - $store.start.getTime()) * Constantes.GRID.MIDDLE_WIDTH
    let widthProgress = currentTask.progress * widthGray / 100
    
    let xGrayPosition =  (currentTask.dateStart.getTime() - $store.start.getTime()) / ($store.end.getTime() - $store.start.getTime()) * Constantes.GRID.MIDDLE_WIDTH + Constantes.GRID.MIDDLE_X
    let xPercentPosition = xGrayPosition + widthProgress - 5
    let percentTextAnchor = "end"
    if(currentTask.progress < 50){
        xPercentPosition = xGrayPosition + widthProgress + 5
        percentTextAnchor = "start"
    }

    let hasSwimline = currentTask.swimline && currentTask.swimline !== ""

</script>
<defs>
    <g id="T{i}">
        {#if hasSwimline}
        <text text-anchor="end" x="{xGrayPosition - 5}" y="10.5" font-family="Verdana" font-size="9" fill="{leftLabel}">{currentTask.label}</text>
        {:else}
        <text text-anchor="end" x="{Constantes.GRID.MIDDLE_X - 5}" y="10.5" font-family="Verdana" font-size="9" fill="{leftLabel}">{currentTask.label}</text>
        <line stroke-dasharray="0.5 2" x1="{Constantes.GRID.MIDDLE_X}" y1="8" x2="{xGrayPosition - 5}" y2="8" stroke="{dottedLine}" />
        {/if}
        {#if currentTask.progress < 100}
        <rect x="{xGrayPosition}" y="0" width="{widthGray}" height="15" rx="5" ry="5" style="fill: {grey}; stroke: {greyStroke}; stroke-width: 0.05em;"/>    
        {/if}
        <rect x="{xGrayPosition}" y="0" width="{widthProgress}" height="15" rx="5" ry="5" style="{styleColor} stroke-width: 0.05em;"/>
        <text text-anchor="{percentTextAnchor}" x="{xPercentPosition}" y="10.5" font-family="Verdana" font-size="8" fill="{white}">{currentTask.progress}%</text>
        <text x="{xGrayPosition + widthGray + 5}" y="10.5" font-family="Verdana" font-size="8" fill="{rightLabel}">{labelRight}</text>
    </g>
</defs>
<use x="0" y="{i * Constantes.GRID.ONE_TASK_H + Constantes.GRID.MILESTONE_H + Constantes.GRID.BANNER_H}" href="#T{i}"/>
