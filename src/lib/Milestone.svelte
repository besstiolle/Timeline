<script lang="ts">
    import type { Struct } from "./struct.class";
    import { Constantes } from './constantes.class';
    import { store } from "./stores";

    export let milestone: Struct.Milestone;
    export let i : number;

    let xMilestonePosition =  (milestone.date.getTime() - $store.start.getTime()) / ($store.end.getTime() - $store.start.getTime()) * Constantes.GRID.MIDDLE_WIDTH
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