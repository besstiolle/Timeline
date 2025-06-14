<script lang="ts">
	import { store } from '$lib/stores';

	import { GRID, MONTHS } from '$lib/constantes';
	import { Helpers } from '$lib/helpers';
	import { FactoryTask } from '$lib/factoryTask';
	import TaskComponent from './Task.svelte';
	import { displayableTasks } from '$lib/derivedStore';
	import Swimlines from './Swimlines.svelte';

	let taskId: string = '';
	let rightLabel: HTMLElement;
	let defaultRightLabelText: string = '';
	let defaultRightLabelX: string = '';
	let progressBar: HTMLElement;
	let progressBarLabel: HTMLElement;
	let defaultProgressBarLabelText: string = '';
	let defaultProgressBarWidth: number = -1;
	let hoverGroup: boolean = false;
	let recBox: DOMRect;
	const ACTION = { LEFT: 'L', RIGHT: 'R', PROGRESS: 'P' };
	let realAction: string = '';
	let rec: HTMLElement, left: HTMLElement, right: HTMLElement, progress: HTMLElement;
	let TActionBarCoord = { REC_X: 0, REC_X2: 0, L_X: 0, R_X: 0, P_X: 0 };
	let TActionBarCoordDefault = { REC_X: 0, REC_X2: 0, L_X: 0, R_X: 0, P_X: 0 };
	let isDragging: boolean = false;

	function downLeft(event: Event) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		realAction = ACTION.LEFT;
		down(event);
	}
	function downRight(event: Event) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		realAction = ACTION.RIGHT;
		down(event);
	}
	function downProgress(event: Event) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		realAction = ACTION.PROGRESS;
		down(event);
	}
	function down(event: Event) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		//Find the initiale position of our buttons to reset it if necessary
		taskId = (event.currentTarget as HTMLElement)?.parentElement?.parentElement?.id as string;
		rec = document.getElementById(`${taskId}_rec`) as HTMLElement;
		left = document.getElementById(`${taskId}_l`) as HTMLElement;
		right = document.getElementById(`${taskId}_r`) as HTMLElement;
		rightLabel = document.getElementById(`${taskId}_rlabel`) as HTMLElement;
		let ghostElement = document.getElementById(`ghost`) as HTMLElement;
		progress = document.getElementById(`${taskId}_p`) as HTMLElement;
		if (progress === null) {
			progress = ghostElement;
		}
		progressBar = document.getElementById(`${taskId}_progressBar`) as HTMLElement;
		progressBarLabel = document.getElementById(`${taskId}_plabel`) as HTMLElement;
		if (progressBarLabel === null) {
			progressBarLabel = ghostElement;
		}
		recBox = (
			document.getElementById('svgSwimlineAndTasks') as HTMLElement
		).getBoundingClientRect();

		defaultRightLabelText = rightLabel.innerHTML;
		defaultRightLabelX = rightLabel.getAttribute('x') as string;

		defaultProgressBarLabelText = progressBarLabel.innerHTML;
		defaultProgressBarWidth = parseInt(progressBar.getAttribute('width') as string);

		TActionBarCoord.REC_X = parseInt(rec.getAttribute('x') as string);
		TActionBarCoord.REC_X2 =
			parseInt(rec.getAttribute('x') as string) + parseInt(rec.getAttribute('width') as string);
		TActionBarCoord.L_X = parseInt(left.getAttribute('x') as string);
		TActionBarCoord.R_X = parseInt(right.getAttribute('x') as string);
		TActionBarCoord.P_X = parseInt(progress.getAttribute('x') as string);
		TActionBarCoordDefault.REC_X = parseInt(rec.getAttribute('x') as string);
		TActionBarCoordDefault.REC_X2 =
			parseInt(rec.getAttribute('x') as string) + parseInt(rec.getAttribute('width') as string);
		TActionBarCoordDefault.L_X = parseInt(left.getAttribute('x') as string);
		TActionBarCoordDefault.R_X = parseInt(right.getAttribute('x') as string);
		TActionBarCoordDefault.P_X = parseInt(progress.getAttribute('x') as string);

		//Update CSS of buttons
		left.classList.add('grabbing');
		right.classList.add('grabbing');
		progress.classList.add('grabbing');

		isDragging = true;
	}
	function up(event: MouseEvent) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		if (isDragging && hoverGroup) {
			try {
				const taskToUpdate = FactoryTask.getById(
					$store.currentTimeline,
					parseInt(taskId.substring(1))
				); //html id = T999 => 999
				if (realAction == ACTION.LEFT || realAction == ACTION.RIGHT) {
					let dateStart = Helpers.getDateFromViewportX(
						TActionBarCoord.REC_X,
						$store.currentTimeline.getStart(),
						$store.currentTimeline.getEnd()
					);
					let dateEnd = Helpers.getDateFromViewportX(
						TActionBarCoord.REC_X2,
						$store.currentTimeline.getStart(),
						$store.currentTimeline.getEnd()
					);

					dateStart.setHours(0, 0, 0, 0);
					dateEnd.setHours(0, 0, 0, 0);

					taskToUpdate.setStart(dateStart);
					taskToUpdate.setEnd(dateEnd);
				} else if (realAction == ACTION.PROGRESS) {
					let viewportX: number = (event.clientX / window.innerWidth) * GRID.ALL_WIDTH;

					//We allow an "hover" zone all left/right but we don't want really "dragging" things too left or too right
					if (viewportX > TActionBarCoord.REC_X2) {
						viewportX = TActionBarCoord.REC_X2;
					}
					if (viewportX < TActionBarCoord.REC_X) {
						viewportX = TActionBarCoord.REC_X;
					}

					let progressValue: number =
						((viewportX - TActionBarCoord.REC_X) /
							(TActionBarCoord.REC_X2 - TActionBarCoord.REC_X)) *
						100;
					taskToUpdate.progress = Math.round(progressValue);
				}
				store.update((s) => {
					s.currentTimeline = FactoryTask.updateById(
						s.currentTimeline,
						taskToUpdate
					);
					return { ...s };
				});
			} catch (NotFoundException) {
				//Nothing to do, the rest of the function will clean everything
				console.debug('catch a NotFoundExeption but everything is normal', NotFoundException);
			}
		}
		if (isDragging) {
			//hide action bar
			rec.classList.add('hidden');
			left.classList.add('hidden');
			right.classList.add('hidden');
			progress.classList.add('hidden');

			//Reset default value of the overlay
			rec.setAttribute('x', TActionBarCoordDefault.REC_X.toString());
			rec.setAttribute(
				'width',
				(TActionBarCoordDefault.REC_X2 - TActionBarCoordDefault.REC_X).toString()
			);
			left.setAttribute('x', TActionBarCoordDefault.L_X.toString());
			right.setAttribute('x', TActionBarCoordDefault.R_X.toString());
			progress.setAttribute('x', TActionBarCoordDefault.P_X.toString());

			//Update CSS of buttons
			left.classList.remove('grabbing');
			right.classList.remove('grabbing');
			progress.classList.remove('grabbing');

			if (progressBarLabel) {
				progressBarLabel.innerHTML = defaultProgressBarLabelText;
			}
			progressBar.setAttribute('width', defaultProgressBarWidth.toString());
		}

		//in all cases  : Reset vars
		taskId = '';
		realAction = '';
		TActionBarCoord = { REC_X: 0, REC_X2: 0, L_X: 0, R_X: 0, P_X: 0 };
		TActionBarCoordDefault = { REC_X: 0, REC_X2: 0, L_X: 0, R_X: 0, P_X: 0 };
		isDragging = false;
		//rec = null
		//left = null
		//right = null
		if (rightLabel) {
			rightLabel.innerHTML = defaultRightLabelText;
			rightLabel.setAttribute('x', defaultRightLabelX);
		}
		//rightLabel = null
		defaultRightLabelText = '';

		//progressBar = null
		//progressBarLabel = null
		defaultProgressBarLabelText = '';
		defaultProgressBarWidth = -1;
	}
	function move(event: MouseEvent) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		if (!isDragging) {
			return;
		}

		//Conversion event.clientX => svg viewport mouse x value
		let viewportX: number = (event.clientX / window.innerWidth) * GRID.ALL_WIDTH;
		if (realAction == ACTION.LEFT || realAction == ACTION.RIGHT) {
			moveResizing(event, viewportX);
		} else if (realAction == ACTION.PROGRESS) {
			moveProgress(event, viewportX);
		}
	}
	function moveProgress(event: MouseEvent, viewportX: number) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		hoverGroup =
			viewportX > recBox.left &&
			viewportX < recBox.right &&
			event.clientY > recBox.top &&
			event.clientY < recBox.bottom;

		if (hoverGroup) {
			//We allow an "hover" zone all left/right but we don't want really "dragging" things too left or too right
			if (viewportX > TActionBarCoord.REC_X2) {
				viewportX = TActionBarCoord.REC_X2;
			}
			if (viewportX < TActionBarCoord.REC_X) {
				viewportX = TActionBarCoord.REC_X;
			}

			let progressValue: number =
				((viewportX - TActionBarCoord.REC_X) / (TActionBarCoord.REC_X2 - TActionBarCoord.REC_X)) *
				100;
			let widthProgress: number = viewportX - TActionBarCoord.REC_X;
			progress.setAttribute('x', viewportX.toString());
			TActionBarCoord.P_X = viewportX;
			progressBar.setAttribute('width', widthProgress.toString());
			let percentTextAnchor: string = 'end';
			let varX: number = -5;
			if (progressValue < 50) {
				percentTextAnchor = 'start';
				varX = 5;
			}
			progressBarLabel.setAttribute('x', (viewportX + varX).toString());
			progressBarLabel.setAttribute('text-anchor', percentTextAnchor);
			progressBarLabel.innerHTML = Math.round(progressValue).toString() + '%';
		}
	}
	function moveResizing(event: MouseEvent, viewportX: number) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		hoverGroup =
			viewportX > recBox.left &&
			viewportX < recBox.right &&
			event.clientY > recBox.top &&
			event.clientY < recBox.bottom;

		//Moving right/left HTMLElement on the axe <===>
		if (hoverGroup) {
			let width: number = 0;
			if (realAction == ACTION.LEFT) {
				//max x = right.x
				//min x = 150
				if (viewportX > TActionBarCoord.REC_X2 || viewportX < GRID.MIDDLE_X) {
					return;
				}
				//Update left HTMLElement position
				left.setAttribute('x', (viewportX - 5).toString());
				TActionBarCoord.L_X = viewportX - 5;
				//Update x & width of rec HTMLposition
				width = TActionBarCoord.REC_X2 - viewportX;
				rec.setAttribute('x', viewportX.toString());
				rec.setAttribute('width', width.toString());
				TActionBarCoord.REC_X = viewportX;
			} else if (realAction == ACTION.RIGHT) {
				//min x = left.x
				//max x = full size
				if (viewportX < TActionBarCoord.REC_X || viewportX > GRID.ALL_WIDTH) {
					return;
				}
				//Update right HTMLElement position
				right.setAttribute('x', (viewportX - 10).toString());
				TActionBarCoord.R_X = viewportX - 10;
				//Update width of rec HTMLposition
				width = viewportX - TActionBarCoord.REC_X;
				rec.setAttribute('width', width.toString());
				TActionBarCoord.REC_X2 = viewportX;
				//Update right label with new X position
				rightLabel.setAttribute('x', (viewportX + 5).toString());
			}
			// update content of right label
			let dateStart = Helpers.getDateFromViewportX(
				TActionBarCoord.REC_X,
				$store.currentTimeline.getStart(),
				$store.currentTimeline.getEnd()
			);
			let dateEnd = Helpers.getDateFromViewportX(
				TActionBarCoord.REC_X2,
				$store.currentTimeline.getStart(),
				$store.currentTimeline.getEnd()
			);

			rightLabel.innerHTML =
				dateStart.getDate() +
				' ' +
				MONTHS[dateStart.getMonth()] +
				' - ' +
				dateEnd.getDate() +
				' ' +
				MONTHS[dateEnd.getMonth()];
		}
	}

	function showActionBar(event: Event) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		//Avoid showing more overlay when we already grabbing something
		if (isDragging) {
			return;
		}
		let collection: HTMLCollection = (event.currentTarget as HTMLElement).getElementsByClassName(
			'showable'
		);
		Array.from(collection).forEach((element) => {
			element.classList.remove('hidden');
		});
	}
	function hideActionBar(event: Event) {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		//Avoid hiding overlay when we already grabbing something
		if (isDragging) {
			return;
		}
		let collection: HTMLCollection = (event.currentTarget as HTMLElement).getElementsByClassName(
			'showable'
		);
		Array.from(collection).forEach((element) => {
			element.classList.add('hidden');
		});
	}
</script>

<svelte:window onmouseup={up} onmousemove={move} />
<Swimlines />

{#key $displayableTasks}
	{#each $displayableTasks as task, index (task.id)}
		<TaskComponent
			currentTask={task}
			i={index}
			{showActionBar}
			{hideActionBar}
			{downRight}
			{downLeft}
			{downProgress}
		/>
	{/each}
{/key}
<tspan id="ghost" x="-1000" />
