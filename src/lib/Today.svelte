<script lang="ts">
import { GRID } from './constantes';
    import { store } from './stores';

    let toDisplay: boolean = ($store.currentTimeline.getStart() <= new Date() && $store.currentTimeline.getEnd() >= new Date())
                                && $store.currentTimeline.showToday

    const todayColor = "#D41E24"
    const todayLabelColor = "#000000"
    
    let widthToday: number = (new Date().getTime() - $store.currentTimeline.getStart().getTime()) / ($store.currentTimeline.getEnd().getTime() - $store.currentTimeline.getStart().getTime()) * GRID.MIDDLE_WIDTH
 
</script>

{#if toDisplay}
<svg viewBox="{$store.currentTimeline.viewbox}" xmlns="http://www.w3.org/2000/svg" 
    x="{GRID.MIDDLE_X}" y="{GRID.MILESTONE_H}"  >

            <rect x="0" y="20" width="{widthToday}" height="5" fill={todayColor}/>
            <polygon points='{widthToday},25 {widthToday + 5},40 {widthToday - 5},40' fill={todayColor} />
            <text x="{widthToday - 10}" y="50" font-size="7" fill="{todayLabelColor}">Today</text>
            <line stroke-dasharray="0.5 2" x1="{widthToday}" y1="40" x2="{widthToday}" y2="100%" stroke="{todayColor}" />
        
</svg>
{/if}