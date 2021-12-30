<script lang="ts">

    import type { Graph } from "./graph.class";

    export let task: Graph.Task;
    export let start: Date;
    export let end: Date;
    export let i: Number;

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
    const Months = ['Jan.','Fev.','Mar.','Avr.','Mai','Juin','Juil.','Aout','Sept.','Oct.','Nov.','Dec.']
    const maxWidth = 1000 - 150

    let styleColor = `fill: ${green}; stroke: ${greenStroke};` //default : full
    if(task.progress < 100){
        styleColor = `fill: ${blue}; stroke: ${blueStroke};`
    }

    let labelRight:string = task.dateStart.getDate() + " " + Months[task.dateStart.getMonth()] + " - " + task.dateEnd.getDate() + " " + Months[task.dateEnd.getMonth()]
    
    let widthGray = (task.dateEnd.getTime() - task.dateStart.getTime()) / (end.getTime() - start.getTime()) * maxWidth
    let widthProgress = Math.floor(task.progress as number * widthGray / 100)
    
    let xGrayPosition =  (task.dateStart.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * maxWidth + 150
    let xPercentPosition = xGrayPosition + widthProgress - 5
    let percentTextAnchor = "end"
    if(task.progress < 50){
        xPercentPosition = xGrayPosition + widthProgress + 5
        percentTextAnchor = "start"
    }

</script>
<defs>
    <g id="T{i}">
        <text text-anchor="end" x="150" y="10.5" font-family="Verdana" font-size="9" fill="{leftLabel}">{task.label}</text>
        <line stroke-dasharray="0.5 2" x1="155" y1="8" x2="{xGrayPosition - 5}" y2="8" stroke="{dottedLine}" />
        {#if task.progress < 100}
        <rect x="{xGrayPosition}" y="0" width="{widthGray}" height="15" rx="5" ry="5" style="fill: {grey}; stroke: {greyStroke}; stroke-width: 0.05em;"/>    
        {/if}
        <rect x="{xGrayPosition}" y="0" width="{widthProgress}" height="15" rx="5" ry="5" style="{styleColor} stroke-width: 0.05em;"/>
        <text text-anchor="{percentTextAnchor}" x="{xPercentPosition}" y="10.5" font-family="Verdana" font-size="8" fill="{white}">{task.progress}%</text>
        <text x="{xGrayPosition + widthGray + 10}" y="10.5" font-family="Verdana" font-size="8" fill="{rightLabel}">{labelRight}</text>
    </g>
</defs>
