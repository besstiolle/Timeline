<script lang="ts">
	import { store } from '$lib/stores';

	import { GRID } from '$lib/constantes';
	import { Helpers } from '$lib/helpers';
	import { FactoryTask } from '$lib/factoryTask';
	import TaskComponent from './Task.svelte';
	import { displayableTasks } from '$lib/derivedStore';
	import Swimlines from './Swimlines.svelte';
	import { TaskViewModel } from '$lib/viewModel';
	import type { Task } from '$lib/struct.class';


	interface ActiveDragInterface{
		taskId: number,
        action: ACTION,
        currentX: number,
        initialProgress: number,
        initialStart: Date,
        initialEnd: Date,
		initialLeftXPosition:number,
		initialRightXPosition:number,
	}

	type ACTION = 'L' | 'R' | 'P';

	let activeDrag = $state<ActiveDragInterface | null>(null)

	function getSvgX(event: MouseEvent):number{
		return (event.clientX / window.innerWidth) * GRID.ALL_WIDTH
	}

	function downLeft(event: MouseEvent, taskId:number): void {
		down(event, taskId, 'L');
	}
	function downRight(event: MouseEvent, taskId:number): void {
		down(event, taskId, 'R');
	}
	function downProgress(event: MouseEvent, taskId:number): void {
		down(event, taskId, 'P');
	}
	function down(event: MouseEvent, taskId:number, action: ACTION): void {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		let task = null
		try {
			task = FactoryTask.getById(
				$store.currentTimeline,taskId
			); 
		} catch (NotFoundException) {
			//Nothing to do, the rest of the function will clean everything
			console.debug('catch a NotFoundExeption but everything is normal', NotFoundException);
			return
		}

		//Using viewModels to calculate X/Y Coord
		const viewModel = new TaskViewModel(task, $store.currentTimeline, activeDrag?.taskId ?? null)

		//construction of activeDrag
		activeDrag = {
			taskId: taskId,
			action,
			currentX: getSvgX(event),
			initialProgress: viewModel.progress,
			initialStart: new Date(task.getStart()),
			initialEnd: new Date(task.getEnd()),
			initialLeftXPosition:viewModel.leftGrayXPosition,
			initialRightXPosition:viewModel.rightGrayXPosition,
		}

		//console.info("Down", activeDrag.taskId, activeDrag.initialLeftXPosition, activeDrag.initialRightXPosition, activeDrag.currentX)
		
	}
	function up(event: MouseEvent): void {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		if (!activeDrag) return;

		const taskToUpdate = FactoryTask.getById($store.currentTimeline, activeDrag.taskId);
		const updatedTask = getDisplayTask(taskToUpdate); // Récupère la tâche avec ses valeurs finales

		store.update((s) => {
			s.currentTimeline = FactoryTask.updateById(s.currentTimeline, updatedTask);
			return { ...s };
		});

		//Clearing current Task Dragged 
		activeDrag = null
		
	}
	function move(event: MouseEvent): void {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader()) {
			return;
		}

		if (!activeDrag) return;
		activeDrag.currentX = getSvgX(event);
		//console.info("Move", activeDrag.taskId, activeDrag.initialLeftXPosition, activeDrag.initialRightXPosition, activeDrag.currentX)
	}

	// If task passed is the activeDrag one, we apply the modifications
	function getDisplayTask(task: Task): Task {
		//Security : we can't manipulate data if we are a simple Reader
		if ($store.rights.isReader() || !activeDrag || activeDrag.taskId !== task.id) {
			return task; // No activeDrag, we return the non modificated one
		}

		const previewTask = task.clone();

		if (activeDrag.action === 'P') {
			const newProgress = calculateProgressFromActiveDrag(activeDrag);
			previewTask.progress = newProgress;
		} else if (activeDrag.action === 'R') {
			const newDate = calculateNewEndDateFromActiveDrag(activeDrag)
			previewTask.setEnd(newDate)
		} else if (activeDrag.action === 'L') {
			const newDate = calculateNewStartDateFromActiveDrag(activeDrag)
			previewTask.setStart(newDate)
		} else {
			console.warn("unknown action : ", activeDrag.action)
		}

		return previewTask;
	}

	function calculateProgressFromActiveDrag(activeDrag: ActiveDragInterface): number {
		
		let currentX = activeDrag.currentX
		if(activeDrag.currentX > activeDrag.initialRightXPosition){
			currentX = activeDrag.initialRightXPosition
		}
		if(activeDrag.currentX < activeDrag.initialLeftXPosition){
			currentX = activeDrag.initialLeftXPosition
		}

		const progress = 100 - Math.round(
			(activeDrag.initialRightXPosition - currentX) /
			(activeDrag.initialRightXPosition - activeDrag.initialLeftXPosition) *
			100)
		return progress

	}

	function calculateNewStartDateFromActiveDrag(activeDrag: ActiveDragInterface):Date{
		
		let currentX = activeDrag.currentX
		if(activeDrag.currentX > activeDrag.initialRightXPosition){
			currentX = activeDrag.initialRightXPosition
		}

		//Conversion Xposition => Date
		let currentDate = Helpers.getDateFromViewportX(
				currentX,
				$store.currentTimeline.getStart(),
				$store.currentTimeline.getEnd())

		if(currentDate < $store.currentTimeline.getStart()){
			currentDate = $store.currentTimeline.getStart()
		}
		
		return currentDate
	}

	function calculateNewEndDateFromActiveDrag(activeDrag: ActiveDragInterface):Date{
		

		let currentX = activeDrag.currentX
		if(activeDrag.currentX < activeDrag.initialLeftXPosition){
			currentX = activeDrag.initialLeftXPosition
		}

		//Conversion Xposition => Date
		let currentDate = Helpers.getDateFromViewportX(
				currentX,
				$store.currentTimeline.getStart(),
				$store.currentTimeline.getEnd())

		if(currentDate > $store.currentTimeline.getEnd()){
			currentDate = $store.currentTimeline.getEnd()
		}
		
		return currentDate
	}


</script>

<svelte:window onmouseup={up} onmousemove={move} />
<Swimlines />

	{#each $displayableTasks as task, index (task.id)}
		<TaskComponent
			i={index}
			taskVM={new TaskViewModel(
				getDisplayTask(task), 
				$store.currentTimeline, 
				activeDrag?.taskId ?? null)}
			{downRight}
			{downLeft}
			{downProgress}
		/>
	{/each}
