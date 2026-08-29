<script lang="ts">
	import { appState } from '$lib/state/appState.svelte';
	import { volatileAppState } from '$lib/state/volatileAppState.svelte';
	import type { MilestoneViewModel } from '$lib/viewModel';

    interface Props {
        i: number;
        milestoneVM: MilestoneViewModel;
        isGhost: boolean
        down: (event: MouseEvent, taskId:number) => void;
    }

	let {
        i,
        milestoneVM,
        isGhost,
        down,
    }: Props = $props();
</script>


<svg
    viewBox={volatileAppState.viewbox}
    xmlns="http://www.w3.org/2000/svg"
    x={milestoneVM.xPosition}
    y={(i % 2) * 25}
    class:milestoneSVGSection={!appState.rights.isReader()}
    class:shouldBeHidden={!milestoneVM.isShow}
    class:grabbing={isGhost}
    onmousedown={(e) => down(e, milestoneVM.id)}
    id="M{milestoneVM.id}"
    role="presentation"
>
    <use
        x="0"
        y="0"
        href="#mapfiller"
        class="fill-transparent stroke-transparent toExcludeFromSnapshot"
    />
    <use x="0" y="0" href="#map" class="svgWithFiller primaryFill" />
    {#if i % 2 == 0}
        <line stroke-dasharray="1" x1="10" y1="20" x2="10" y2="50" class="primaryStroke" />
    {:else}
        <line stroke-dasharray="1" x1="10" y1="20" x2="10" y2="25" class="primaryStroke" />
    {/if}
    <text x="17" y="9" font-size="10" class="primaryFill">{milestoneVM.label}</text>
    <text x="17" y="18" class="primaryFill"
        >{milestoneVM.dateDDMM}</text
    >
</svg>

<style>
	.milestoneSVGSection {
		cursor: grab;
	}
	:global(.milestoneSVGSection.grabbing) {
		cursor: grabbing;
	}
</style>
