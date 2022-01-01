<script lang="ts">
    import { datas } from './stores';
    import { Helpers } from './helpers.class';
    import { Graph } from './graph.class';

    const TS : string = "taskStart_"
    const TE : string = "taskEnd_"
    const MD : string = "milestoneDate_"

    export let start: Date;
    export let end: Date;

    function updateStore(event){
        
        let position : number = null;
        if(event.target.name.startsWith(TS)){
            position = parseInt(event.target.name.substring(TS.length, event.target.name.length))
            $datas.tasks[position].dateStart = new Date(event.target.value)
        }
        
        if(event.target.name.startsWith(TE)){
            position = parseInt(event.target.name.substring(TE.length, event.target.name.length))
            $datas.tasks[position].dateEnd = new Date(event.target.value)
        }
        
        if(event.target.name.startsWith(MD)){
            position = parseInt(event.target.name.substring(MD.length, event.target.name.length))            
            $datas.milestones[position].date = new Date(event.target.value)
        }
    }

    function getIndex(event) : number{
        return  parseInt(event.currentTarget.attributes["name"].nodeValue.substring(1,event.currentTarget.attributes["name"].nodeValue.length))
    }

    function b_delete(event){
        console.info("delete : " + getIndex(event))
        $datas.tasks.splice(getIndex(event), 1)
        $datas.tasks = $datas.tasks
    }
    function b_up(event){
        console.info("up : " + getIndex(event))
        let index = getIndex(event)
        if(index == 0){
            return;
        }
        let tmpTask: Graph.Task = $datas.tasks[index]
        $datas.tasks[index] = $datas.tasks[index - 1]
        $datas.tasks[index - 1] = tmpTask
    }
    function b_down(event){
        console.info("down : " + getIndex(event))
        let index = getIndex(event)
        if(index == ($datas.tasks.length-1)){
            return;
        }
        let tmpTask: Graph.Task = $datas.tasks[index]
        $datas.tasks[index] = $datas.tasks[index + 1]
        $datas.tasks[index + 1] = tmpTask
    }
    function b_show(event){
        console.info("show : " + getIndex(event))
        let index = getIndex(event)
        $datas.tasks[index].isShow = !$datas.tasks[index].isShow 
    }
    function b_duplicate(event){
        console.info("duplicate : " + getIndex(event))
        let index = getIndex(event)
        let tmpTasks : Array<Graph.Task> = $datas.tasks.splice(index+1, $datas.tasks.length)
        $datas.tasks.push( $datas.tasks[index].clone() )
        tmpTasks.forEach(tmpTask => {
            $datas.tasks.push( tmpTask )
        });
        $datas.tasks = $datas.tasks
    }
    function b_add(event){
        console.info("add")
        $datas.tasks.push(new Graph.Task("Some task", start, end))
        $datas.tasks = $datas.tasks
    }

    function m_delete(event){
        console.info("delete : " + getIndex(event))
        $datas.milestones.splice(getIndex(event), 1)
        $datas.milestones = $datas.milestones
    }
    function m_up(event){
        console.info("up : " + getIndex(event))
        let index = getIndex(event)
        if(index == 0){
            return;
        }
        let tmpMilestone: Graph.Milestone = $datas.milestones[index]
        $datas.milestones[index] = $datas.milestones[index - 1]
        $datas.milestones[index - 1] = tmpMilestone
    }
    function m_down(event){
        console.info("down : " + getIndex(event))
        let index = getIndex(event)
        if(index == ($datas.milestones.length-1)){
            return;
        }
        let tmpMilestone: Graph.Milestone = $datas.milestones[index]
        $datas.milestones[index] = $datas.milestones[index + 1]
        $datas.milestones[index + 1] = tmpMilestone
    }
    function m_show(event){
        console.info("show : " + getIndex(event))
        let index = getIndex(event)
        $datas.milestones[index].isShow = !$datas.milestones[index].isShow 
    }
    function m_duplicate(event){
        console.info("duplicate : " + getIndex(event))
        let index = getIndex(event)
        let tmpMilestones : Array<Graph.Milestone> = $datas.milestones.splice(index+1, $datas.milestones.length)
        $datas.milestones.push( $datas.milestones[index].clone() )
        tmpMilestones.forEach(tmpMilestone => {
            $datas.milestones.push( tmpMilestone )
        });
        $datas.milestones = $datas.milestones
    }
</script>


<div id='live__shadow'>
    <div id='live'>
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
            <input type="date" name="{TS}{i}" value="{Helpers.toISODateString(task.dateStart)}" min="1900-01-01" max="2999-12-31" on:change="{updateStore}">
            <input type="date" name="{TE}{i}" value="{Helpers.toISODateString(task.dateEnd)}" min="1900-01-01" max="2999-12-31" on:change="{updateStore}">
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
        

        {#each $datas.milestones as milestone, i}
        <div class="live__line show_{milestone.isShow}">
            
            <div name="M{i}"  class="live_cmd live_cmd_red" on:click="{m_delete}" title="delete this line">
                <svg viewBox="0 0 20 20">
                    <use x="0" y="0" href="#b_delete"/>
                </svg>
            </div>
            <div name="M{i}"  class="live_cmd" on:click="{m_up}" title="go down this line">
                <svg viewBox="0 0 20 20">
                    <use x="0" y="0" href="#b_up"/>
                </svg>
            </div>
            <div name="M{i}"  class="live_cmd" on:click="{m_down}" title="go up this line">
                <svg viewBox="0 0 20 20">
                    <use x="0" y="0" href="#b_down"/>
                </svg>
            </div>
            <div name="M{i}"  class="live_cmd" on:click="{m_show}" title="hide/show this line">
                <svg viewBox="0 0 20 20">
                    <use x="0" y="0" href="#b_show"/>
                </svg>
            </div>
            <div name="M{i}"  class="live_cmd" on:click="{m_duplicate}" title="duplicate this line">
                <svg viewBox="0 0 20 20">
                    <use x="0" y="0" href="#b_duplicate"/>
                </svg>
            </div>
            <input type="text" bind:value="{milestone.label}" class="label"/>
            <input type="date" name="{MD}{i}" value="{Helpers.toISODateString(milestone.date)}" min="1900-01-01" max="2999-12-31" on:change="{updateStore}">
        </div>
        {/each}
</div>
</div>

<style>
    #live__shadow{
        height: 100%;
        width: 100%;
        background-color: rgba(200, 218, 223, 0.5);
        position: fixed;
        top:0;
        left:0;
    }
    #live{
        height: 60%;
        width: 80%;
        margin: 10%;
        padding:1em;
        background-color: #c8dadf;
        position: relative;
        text-align:left;
        overflow: auto;

    }
    div.live__line{
        margin:0.1em auto;
        width: 90%;
    }

    input{
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        background-color: #bdd2da;
        border: 0px none;
        border-radius: 5px;
        font-size:1.5rem
    }

    input.label{
        width: 20em;
    }
    input.progress{
        width: 3em;
    }
    div.live_cmd{
        width:20px;
        height: 20px;
        display:inline-block;
        margin:1px;
    }
    div.live_cmd:hover{
        fill:rgb(33, 56, 33);
        background-color: rgb(188, 224, 154);
        border-radius: 45px;
        border: 1px solid rgb(188, 224, 154);
        margin:0;
    }
    div.live_cmd_red:hover{
        fill:rgb(56, 33, 33);
        background-color: rgb(221, 175, 175);
        border: 1px solid rgb(221, 175, 175);;
    }
    :global(.show_false input){
        color:#6c7174
    }
    .live__action{
        text-align: center;
    }
    .live__action__button{
        border:1px solid #000;
        display: inline-block;
        padding: 0 10px;
        border-radius: 5px;
        height: 20px;

    }
    .svg-icon{
        width:20px;
        height: 20px;
    }
    .live__action__button span{
    }

</style>