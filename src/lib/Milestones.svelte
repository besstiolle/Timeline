<script lang="ts">
    
    import { Constantes } from './constantes.class';
    import type { Struct } from "./struct.class";
    import Milestone from './Milestone.svelte';

    export let milestones: Array<Struct.Milestone>;

</script>

    
<defs>
    <g id="milestones">
        {#each milestones as milestone, i}
            <Milestone i={i} milestone={milestone}/>
        {/each}
    </g>
</defs>

<use x="{Constantes.GRID.MIDDLE_X}" y="0" href="#milestones"/>

