<script lang="ts">
	import { browser } from '$app/environment';
	import { store } from '$lib/stores';

	import { FactoryMilestone } from '$lib/factoryMilestone';
	import { GRID, MONTHS } from '$lib/constantes';
	import type { Milestone } from '$lib/struct.class';

	function compareMilestone(a: Milestone, b: Milestone) {
		if (a.date > b.date) {
			return 1;
		}
		if (a.date < b.date) {
			return -1;
		}
		return 0;
	}

	let milestones: Milestone[] = [];
	$store.currentTimeline.milestones.forEach((milestone: Milestone) => {
		if (milestone.isShow || $store.currentTimeline.showAll) {
			milestones.push(milestone);
		}
	});
	//Sort by date ASC
	milestones = milestones.sort(compareMilestone);

	let ghostSVGNode: HTMLElement | null = null;
	let currentTarget: HTMLElement | null = null;
	let hoverGroup: boolean = false;
	let recBox: DOMRect;

	const GHOST_SVG_NODE_ID: string = 'ghostSVGNode';
	/**
	 * Triggered every time user try to "grab" an svg group of Milestone
	 * @param event the event mousedown
	 */
	function down(event: Event) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		//Avoid selecting text. source : https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
		event.preventDefault();
		currentTarget = event.currentTarget as HTMLElement; //currentTarget => svg, target => sub element of svg
		ghostSVGNode = currentTarget.cloneNode(true) as HTMLElement;
		ghostSVGNode.setAttribute('id', GHOST_SVG_NODE_ID);

		//Find the last node of our SVG group
		let endMilestoneNode = document.getElementById('endMilestoneNode') as HTMLElement;

		//create ghost node <svg> after the last node of our SVG group
		if (endMilestoneNode.parentNode) {
			endMilestoneNode.parentNode.insertBefore(ghostSVGNode, endMilestoneNode);
		}

		//Refresh our ghost Node reference
		ghostSVGNode = document.getElementById(GHOST_SVG_NODE_ID) as HTMLElement;

		ghostSVGNode.classList.add('grabbing');
	}

	/**
	 * Triggered every time user release the left clic of the mouse
	 * @param event the event mouseup
	 */
	function up(event: MouseEvent) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		if (ghostSVGNode && hoverGroup && currentTarget) {
			let newX = (event.clientX / window.innerWidth) * GRID.ALL_WIDTH;
			let date = processNewDate(newX - GRID.MIDDLE_X);
			let idMilestone = (currentTarget.getAttribute('id') as string).substring(1); // M999 => 999
			let milestones = null;
			try {
				milestones = FactoryMilestone.getById($store.currentTimeline, parseInt(idMilestone));
				milestones.setDate(date);
				$store.currentTimeline.milestones = $store.currentTimeline.milestones;
			} catch (NotFoundException) {
				//Nothing to do, the rest of the function will clean everything
				console.debug('catch a NotFoundExeption but everything is normal', NotFoundException);
			}
		}

		//Reset vars
		if (ghostSVGNode) {
			ghostSVGNode.remove();
			ghostSVGNode = null;
		}
		currentTarget = null;
	}

	/**
	 * Triggered every time user move the mouse
	 * @param event the event mousemove
	 */
	function move(event: MouseEvent) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		if (!recBox && browser) {
			recBox = (
				document.getElementById('milestonesSection') as HTMLElement
			).getBoundingClientRect();
		}

		if (
			hoverGroup &&
			(event.clientX <= recBox.left ||
				event.clientX >= recBox.right ||
				event.clientY <= recBox.top ||
				event.clientY >= recBox.bottom)
		) {
			hoverGroup = false;
		}

		if (
			!hoverGroup &&
			event.clientX > recBox.left &&
			event.clientX < recBox.right &&
			event.clientY > recBox.top &&
			event.clientY < recBox.bottom
		) {
			hoverGroup = true;
		}

		//Moving ghostUseNode on the axe <===>
		if (ghostSVGNode && hoverGroup) {
			let newX = (event.clientX / window.innerWidth) * GRID.ALL_WIDTH;
			ghostSVGNode.setAttribute('x', `${newX - 10}`);

			//Get new Date
			let newDate: Date = processNewDate(newX - GRID.MIDDLE_X);
			let newDateLabel = newDate.getDate() + '-' + MONTHS[newDate.getMonth()];
			let svgGDateLabelNode: HTMLElement = <HTMLElement>ghostSVGNode.lastChild;
			if (svgGDateLabelNode) {
				svgGDateLabelNode.innerHTML = newDateLabel;
			}
		}
	}

	function processNewDate(newX: number) {
		let ratio =
			$store.currentTimeline.getStart().getTime() +
			(newX / GRID.MIDDLE_WIDTH) *
				($store.currentTimeline.getEnd().getTime() - $store.currentTimeline.getStart().getTime());
		return new Date(ratio);
	}
</script>

<svelte:window on:mouseup={up} on:mousemove={move} />
<rect
	id="milestonesSection"
	x={GRID.MIDDLE_X}
	y="0"
	width={GRID.MIDDLE_WIDTH}
	height={GRID.MILESTONE_H}
	stroke-dasharray="0.5 2"
	fill="transparent"
	class:onhover={ghostSVGNode && hoverGroup && !$store.rights.isReader()}
/>
{#each milestones as milestone, index (index)}
	<svg
		viewBox={$store.currentTimeline.viewbox}
		xmlns="http://www.w3.org/2000/svg"
		x={GRID.MIDDLE_X +
			((milestone.getDate().getTime() - $store.currentTimeline.getStart().getTime()) /
				($store.currentTimeline.getEnd().getTime() - $store.currentTimeline.getStart().getTime())) *
				GRID.MIDDLE_WIDTH -
			10}
		y={(index % 2) * 25}
		class:milestoneSVGSection={!$store.rights.isReader()}
		class:shouldBeHidden={!milestone.isShow}
		on:mousedown={down}
		id="M{milestone.id}"
		role="presentation"
	>
		<use
			x="0"
			y="0"
			href="#mapfiller"
			class="fill-transparent stroke-transparent toExcludeFromSnapshot"
		/>
		<use x="0" y="0" href="#map" class="svgWithFiller primaryFill" />
		{#if index % 2 == 0}
			<line stroke-dasharray="1" x1="10" y1="20" x2="10" y2="50" class="primaryStroke" />
		{:else}
			<line stroke-dasharray="1" x1="10" y1="20" x2="10" y2="25" class="primaryStroke" />
		{/if}
		<text x="17" y="9" font-size="10" class="primaryFill">{milestone.label}</text>
		<text x="17" y="18" class="primaryFill"
			>{milestone.getDate().getDate()}-{MONTHS[milestone.getDate().getMonth()]}</text
		>
	</svg>
	<line id="endMilestoneNode" x1="0" y1="0" x2="0" y2="0" stroke="transparent" />
{/each}

<style>
	.milestoneSVGSection {
		cursor: grab;
	}
	:global(.milestoneSVGSection.grabbing) {
		cursor: grabbing;
	}
	:global(#GHOST_SVG_NODE_ID) {
		opacity: 1;
	}
</style>
