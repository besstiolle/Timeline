<script lang="ts">

    

    import { datas } from './stores';
    import { Helpers } from './helpers.class';
    import { Graph } from './graph.class';
    import { Constantes } from './constantes.class';

    export let getIndex = (event) => {return 0}
    export let updateStore =  (event) => {}

    export let start: Date;
    export let end: Date;


    function b_delete(event){
        $datas.tasks.splice(getIndex(event), 1)
        $datas.tasks = $datas.tasks
    }
    function b_up(event){
        let index = getIndex(event)
        if(index == 0){
            return;
        }
        let tmpTask: Graph.Task = $datas.tasks[index]
        $datas.tasks[index] = $datas.tasks[index - 1]
        $datas.tasks[index - 1] = tmpTask
    }
    function b_down(event){
        let index = getIndex(event)
        if(index == ($datas.tasks.length-1)){
            return;
        }
        let tmpTask: Graph.Task = $datas.tasks[index]
        $datas.tasks[index] = $datas.tasks[index + 1]
        $datas.tasks[index + 1] = tmpTask
    }
    function b_show(event){
        let index = getIndex(event)
        $datas.tasks[index].isShow = !$datas.tasks[index].isShow 
    }
    function b_duplicate(event){
        let index = getIndex(event)
        let tmpTasks : Array<Graph.Task> = $datas.tasks.splice(index+1, $datas.tasks.length)
        $datas.tasks.push( $datas.tasks[index].clone() )
        tmpTasks.forEach(tmpTask => {
            $datas.tasks.push( tmpTask )
        });
        $datas.tasks = $datas.tasks
    }
    function b_add(){
        let diffSec : number = end.getTime() - start.getTime()
        $datas.tasks.push(new Graph.Task(
                "Some task", 
                new Date(start.getTime() + (0.1 * diffSec)), 
                new Date(end.getTime() - (0.1 * diffSec))))
        $datas.tasks = $datas.tasks
    }

</script>


{#each $datas.tasks as task, i}
<div class="live__line show_{task.isShow}">
    <div name="T{i}"  class="live_cmd live_cmd_red" on:click="{b_delete}" title="delete this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_delete"/>
        </svg>
    </div>
    <div name="T{i}"  class="live_cmd" on:click="{b_up}" title="go down this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_up"/>
        </svg>
    </div>
    <div name="T{i}"  class="live_cmd" on:click="{b_down}" title="go up this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_down"/>
        </svg>
    </div>
    <div name="T{i}"  class="live_cmd" on:click="{b_show}" title="hide/show this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_show"/>
        </svg>
    </div>
    <div name="T{i}"  class="live_cmd" on:click="{b_duplicate}" title="duplicate this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_duplicate"/>
        </svg>
    </div>
    <input type="text" bind:value="{task.label}" class="label"/>
    <input type="date" name="{Constantes.LIVE_PREFIX.TS}{i}" value="{Helpers.toISODateString(task.dateStart)}" min="1900-01-01" max="2999-12-31" on:change="{updateStore}">
    <input type="date" name="{Constantes.LIVE_PREFIX.TE}{i}" value="{Helpers.toISODateString(task.dateEnd)}" min="1900-01-01" max="2999-12-31" on:change="{updateStore}">
    <input type="number" bind:value="{task.progress}" min="0" max="100" class="progress" />
    <progress max="100" value="{task.progress}"> {task.progress}% </progress>
</div>
{/each}
<div class="live__action">
    <div class="live__action__button" on:click="{b_add}" >
        <svg class="svg-icon" viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_add"/>
        </svg>
        <span>Add a new Task</span>
    </div>
</div>
   