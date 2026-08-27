<script lang="ts">
	import { store } from '$lib/stores';

	import { FactoryMilestone } from '$lib/factoryMilestone';
	import { GRID } from '$lib/constantes';
	import { MilestoneViewModel } from '$lib/viewModel';
	import { Milestone } from '$lib/struct.class';
	import MilestoneComponent from './Milestone.svelte';
	import { Helpers } from '$lib/helpers';
	import { displayableMilestones as milestonesToDerive } from './Milestones';

	interface ActiveDragInterface{
		milestoneId: number,
        currentX: number
	}
	let activeDrag = $state<ActiveDragInterface | null>(null)
	let selectedMilestone = $state<Milestone|null>(null)

	const displayableMilestones = $derived(
		milestonesToDerive($store.currentTimeline)
	)

	function getSvgX(event: MouseEvent):number{
		return (event.clientX / window.innerWidth) * GRID.ALL_WIDTH
	}

	/**
	 * Triggered every time user try to "grab" an svg group of Milestone
	 * @param event the event mousedown
	 */
	function down(event: MouseEvent, milestoneId:number) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		//Avoid selecting text. source : https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
		event.preventDefault();

		// Create a Ghost
		let currentSelection:Milestone
		try{
			currentSelection = FactoryMilestone.getById($store.currentTimeline, milestoneId)
		} catch (NotFoundException) {
			//Nothing to do, the rest of the function will clean everything
			console.debug('catch a NotFoundExeption but everything is normal', NotFoundException);
			return
		}

		const viewModel = new MilestoneViewModel(currentSelection, $store.currentTimeline)

		//construction of activeDrag
		activeDrag = {
			milestoneId: milestoneId,
			currentX: getSvgX(event)
		}
		//Preservation of selected Milestone
		selectedMilestone = currentSelection
	}

	/**
	 * Triggered every time user release the left clic of the mouse
	 * @param event the event mouseup
	 */
	function up(event: MouseEvent) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader() || activeDrag === null) {
			return;
		}
	
		try {
			let milestoneToUpdate = FactoryMilestone.getById($store.currentTimeline,activeDrag.milestoneId);
			
			const newDate = Helpers.getDateFromViewportX(
				activeDrag.currentX,
				$store.currentTimeline.getStart(),
				$store.currentTimeline.getEnd())

			milestoneToUpdate.date = Helpers.toYYYY_MM_DD(newDate)

			store.update((s) => {
				s.currentTimeline = FactoryMilestone.updateById(s.currentTimeline, milestoneToUpdate);
				return { ...s };
			});
		} catch (NotFoundException) {
			//Nothing to do, the rest of the function will clean everything
			console.debug('catch a NotFoundExeption but everything is normal', NotFoundException);
		}

		//Reset vars
		activeDrag=null
		selectedMilestone=null
	}

	/**
	 * Triggered every time user move the mouse
	 * @param event the event mousemove
	 */
	function move(event: MouseEvent) {

		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader() || activeDrag === null) {
			return;
		}

		//Conversion Xposition => Date
		let currentDate = Helpers.getDateFromViewportX(
				getSvgX(event),
				$store.currentTimeline.getStart(),
				$store.currentTimeline.getEnd())

		//Avoid going to far left/right
		if(currentDate > $store.currentTimeline.getEnd()){
			currentDate = $store.currentTimeline.getEnd()
		}
		if(currentDate < $store.currentTimeline.getStart()){
			currentDate = $store.currentTimeline.getStart()
		}

		const currentXpos = Helpers.getViewportXFromDate(currentDate,
					$store.currentTimeline.getStart(),
					$store.currentTimeline.getEnd())

		//Moving ghost on the axe <====>
		activeDrag.currentX = currentXpos
	}


	// return MilestoneViewModel of the activeDrag one
	function getActiveDrag(): Milestone|null {

		if(activeDrag !== null && selectedMilestone !== null){
			
			const newDate = Helpers.getDateFromViewportX(
				activeDrag.currentX,
				$store.currentTimeline.getStart(),
				$store.currentTimeline.getEnd())

			let previewMilestone = selectedMilestone.clone();
			previewMilestone.date = Helpers.toYYYY_MM_DD(newDate)

			return previewMilestone
		}

		return null;
	}
</script>

<svelte:window onmouseup={up} onmousemove={move} />
<rect
	id="milestonesSection"
	x={GRID.MIDDLE_X}
	y="0"
	width={GRID.MIDDLE_WIDTH}
	height={GRID.MILESTONE_H}
	stroke-dasharray="0.5 2"
	fill="transparent"
	class:onhover={activeDrag !== null && !$store.rights.isReader()}
/>
{#each displayableMilestones as milestone, index (milestone.id)}
	<MilestoneComponent down={down} i={index} isGhost={false}
		milestoneVM={new MilestoneViewModel(milestone, $store.currentTimeline)}/>
{/each}
{#if activeDrag !== null}	
	<MilestoneComponent down={down} i={displayableMilestones.length} isGhost={true}
		milestoneVM={new MilestoneViewModel(getActiveDrag() as Milestone, $store.currentTimeline)}/>
{/if}

