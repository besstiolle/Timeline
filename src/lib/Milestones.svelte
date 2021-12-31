<script lang="ts">
    
    import { Constantes } from './constantes.class';
    import type { Graph } from "./graph.class";
    import Milestone from './Milestone.svelte';

    export let start: Date;
    export let end: Date;
    export let milestones: Array<Graph.Milestone>;

</script>

    
<defs>
    <g id="milestones">
        {#each milestones as milestone, i}
            <Milestone start={start} end={end} i={i} milestone={milestone}/>
        {/each}
    </g>
</defs>

<use x="{Constantes.GridConstantes.MIDDLE_X}" y="0" href="#milestones"/>

