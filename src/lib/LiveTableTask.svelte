<script lang="ts">

    import { store } from './stores';
    import { Helpers } from './helpers.class';
    import { Struct } from './struct.class';
    import { Constantes } from './constantes.class';
    import { HelperStructData } from './helperStructData.class';

    export let getIndex = (event) => {return 0}
    export let updateStore =  (event) => {}

    function b_delete(event){
        $store.tasks.splice(getIndex(event), 1)
        $store.tasks = $store.tasks
    }
    function b_up(event){
        let index = getIndex(event)
        if(index == 0){
            return;
        }
        let tmpTask: Struct.Task = $store.tasks[index]
        $store.tasks[index] = $store.tasks[index - 1]
        $store.tasks[index - 1] = tmpTask
        $store.tasks = $store.tasks
    }
    function b_down(event){
        let index = getIndex(event)
        if(index == ($store.tasks.length-1)){
            return;
        }
        let tmpTask: Struct.Task = $store.tasks[index]
        $store.tasks[index] = $store.tasks[index + 1]
        $store.tasks[index + 1] = tmpTask
        $store.tasks = $store.tasks
    }
    function b_show(event){
        let index = getIndex(event)
        $store.tasks[index].isShow = !$store.tasks[index].isShow 
    }
    function b_duplicate(event){
        let index = getIndex(event)
        let tmpTasks : Array<Struct.Task> = $store.tasks.splice(index+1, $store.tasks.length)
        let clone = {... $store.tasks[index]}
        clone.id = $store.getNextId()
        HelperStructData.addTask($store, clone)
        tmpTasks.forEach(tmpTask => {
            HelperStructData.addTask($store, tmpTask)
        });
        $store.tasks = $store.tasks
    }
    function b_add(){
        let diffSec : number = $store.end.getTime() - $store.start.getTime()
        HelperStructData.addTask($store, new Struct.Task(
                $store.getNextId(),
                "Some task", 
                new Date($store.start.getTime() + (0.1 * diffSec)), 
                new Date($store.end.getTime() - (0.1 * diffSec)),
                0,
                true,
                "",
                null))
        $store.tasks = $store.tasks
    }

</script>


{#each $store.tasks as task, i}
<div class="live__line show_{task.isShow}">
    
    <div name="M{i}"  class="live_cmd" on:click="{b_show}" title="hide/show this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_show"/>
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
    <div name="T{i}"  class="live_cmd" on:click="{b_duplicate}" title="duplicate this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_duplicate"/>
        </svg>
    </div>
    <div name="T{i}"  class="live_cmd live_cmd_red" on:click="{b_delete}" title="delete this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_delete"/>
        </svg>
    </div>
    <input type="text" bind:value="{task.label}" class="label"/>
    <input type="date" name="{Constantes.LIVE_PREFIX.TS}{i}" value="{Helpers.toISODateString(task.dateStart)}" min="1900-01-01" max="2999-12-31" on:blur="{updateStore}">
    <input type="date" name="{Constantes.LIVE_PREFIX.TE}{i}" value="{Helpers.toISODateString(task.dateEnd)}" min="1900-01-01" max="2999-12-31" on:blur="{updateStore}">
    <input type="number" bind:value="{task.progress}" min="0" max="100" class="progress" />
    <progress max="100" value="{task.progress}"> {task.progress}% </progress>
    <input type="text" bind:value="{task.swimline}" class="label"/>
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
   