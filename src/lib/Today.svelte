<script lang="ts">

    import { Constantes } from './constantes.class';
    export let start: Date;
    export let end: Date;

    let toDisplay = (start <= new Date() && end >= new Date())

    const todayColor = "#D41E24"
    const todayLabelColor = "#000000"
    
    let widthToday = (new Date().getTime() - start.getTime()) / (end.getTime() - start.getTime()) * Constantes.GRID.MIDDLE_WIDTH
 
</script>

{#if toDisplay}
    <defs>
        <g id="today">
            <rect x="0" y="20" width="{widthToday}" height="5" style="fill: {todayColor}"/>
            <polygon points='{widthToday},25 {widthToday + 5},40 {widthToday - 5},40' style='fill: {todayColor}' />
            <text x="{widthToday - 10}" y="50" font-family="Verdana" font-size="7" fill="{todayLabelColor}">Today</text>
            <line stroke-dasharray="0.5 2" x1="{widthToday}" y1="40" x2="{widthToday}" y2="100%" stroke="{todayColor}" />
        </g>
    </defs>

    <use x="{Constantes.GRID.MIDDLE_X}" y="50" href="#today"/>
{/if}