<script lang="ts">
    import type { Graph } from "./graph.class";
    import { Constantes } from './constantes.class';

    export let start: Date;
    export let end: Date;
    export let milestone: Graph.Milestone;
    export let i : number;

    let xMilestonePosition =  (milestone.date.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * Constantes.GRID.MIDDLE_WIDTH
</script>

    
<defs>
    <g id="M{i}">
        <use x="0" y="0" href="#map"/>
        <line stroke-dasharray="1" x1="10" y1="20" x2="10" y2="50" stroke="#000" />
        <text x="17" y="9" font-family="Verdana" font-size="10" fill="#000">{milestone.label}</text>
        <text x="17" y="18" font-family="Verdana" font-size="8" fill="#44546A">{milestone.date.getDate()} {Constantes.MONTHS[milestone.date.getMonth()]}</text>
    </g>
        
</defs>
<use x="{xMilestonePosition - 10}" y="0" href="#M{i}"/>