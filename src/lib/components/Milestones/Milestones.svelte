<script lang="ts">
	import { FactoryMilestone } from '$lib/factoryMilestone';
	import { GRID } from '$lib/constantes';
	import { Milestone } from '$lib/struct.class.svelte';
	import MilestoneComponent from './Milestone.svelte';
	import { Helpers } from '$lib/helpers';
	import { displayableMilestones as milestonesToDerive } from './Milestones';
	import { appState } from '$lib/state/appState.svelte';
	import { MilestoneViewModel } from '$lib/viewModels/milestoneViewModel';

	interface ActiveDragInterface{
		milestoneId: number,
        currentX: number
	}
	let activeDrag = $state<ActiveDragInterface | null>(null)
	let selectedMilestone = $state<Milestone|null>(null)

	const displayableMilestones = $derived(
		milestonesToDerive(appState.currentTimeline)
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
		if (appState.rights.isReader()) {
			return;
		}

		//Avoid selecting text. source : https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
		event.preventDefault();

		// Create a Ghost
		let currentSelection:Milestone
		try{
			currentSelection = FactoryMilestone.getById(appState.currentTimeline, milestoneId)
		} catch (NotFoundException) {
			//Nothing to do, the rest of the function will clean everything
			console.debug('catch a NotFoundExeption but everything is normal', NotFoundException);
			return
		}

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
	 */
	function up() {
		//Security : we can't manipulate data if we are a simple Reader
		if (appState.rights.isReader() || activeDrag === null) {
			return;
		}
	
		try {
			let milestoneToUpdate = FactoryMilestone.getById(appState.currentTimeline,activeDrag.milestoneId);
			
			const newDate = Helpers.getDateFromViewportX(
				activeDrag.currentX,
				appState.currentTimeline.start,
				appState.currentTimeline.end)

			milestoneToUpdate.date = Helpers.toYYYY_MM_DD(newDate)

			appState.currentTimeline = FactoryMilestone.updateById(appState.currentTimeline, milestoneToUpdate);
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
		if (appState.rights.isReader() || activeDrag === null) {
			return;
		}

		//Conversion Xposition => Date
		let currentDate = Helpers.getDateFromViewportX(
				getSvgX(event),
				appState.currentTimeline.start,
				appState.currentTimeline.end)

		//Avoid going to far left/right
		if(currentDate > appState.currentTimeline.end){
			currentDate = appState.currentTimeline.end
		}
		if(currentDate < appState.currentTimeline.start){
			currentDate = appState.currentTimeline.start
		}

		const currentXpos = Helpers.getViewportXFromDate(currentDate,
					appState.currentTimeline.start,
					appState.currentTimeline.end)

		//Moving ghost on the axe <====>
		activeDrag.currentX = currentXpos
	}


	// return MilestoneViewModel of the activeDrag one
	function getActiveDrag(): Milestone|null {

		if(activeDrag !== null && selectedMilestone !== null){
			
			const newDate = Helpers.getDateFromViewportX(
				activeDrag.currentX,
				appState.currentTimeline.start,
				appState.currentTimeline.end)

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
	class:onhover={activeDrag !== null && !appState.rights.isReader()}
/>
{#each displayableMilestones as milestone, index (milestone.id)}
	<MilestoneComponent down={down} i={index} isGhost={false}
		milestoneVM={new MilestoneViewModel(milestone, appState.currentTimeline)}/>
{/each}
{#if activeDrag !== null}	
	<MilestoneComponent down={down} i={displayableMilestones.length} isGhost={true}
		milestoneVM={new MilestoneViewModel(getActiveDrag() as Milestone, appState.currentTimeline)}/>
{/if}

