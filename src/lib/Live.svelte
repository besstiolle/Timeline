<script lang="ts">
    import { store } from './stores';
    import LiveTableTask from './LiveTableTask.svelte';
    import LiveTableMilestone from './LiveTableMilestone.svelte';

    const TS : string = "taskStart_"
    const TE : string = "taskEnd_"
    const MD : string = "milestoneDate_"

    let live__open: boolean = false // Define a non-visibility (display: hidden) for the live__wrapper html node
    let live__weak_opacity: boolean = false // Define a full opacity by default for the live__shadow html node

    function updateStore(event): void{
        
        let position : number = null;
        if(event.target.name.startsWith(TS)){
            position = parseInt(event.target.name.substring(TS.length, event.target.name.length))
            $store.tasks[position].dateStart = new Date(event.target.value)
        }
        
        if(event.target.name.startsWith(TE)){
            position = parseInt(event.target.name.substring(TE.length, event.target.name.length))
            $store.tasks[position].dateEnd = new Date(event.target.value)
        }
        
        if(event.target.name.startsWith(MD)){
            position = parseInt(event.target.name.substring(MD.length, event.target.name.length))            
            $store.milestones[position].date = new Date(event.target.value)
        }
    }

    function getIndex(event) : number{
        return  parseInt(event.currentTarget.attributes["name"].nodeValue.substring(1,event.currentTarget.attributes["name"].nodeValue.length))
    }

    function hideLive(){live__weak_opacity = true}
    function showLive(){live__weak_opacity = false}
    export function openLive(){live__open = true} //export => allow calling function by parent https://www.akashmittal.com/svelte-calling-function-child-parent/
    function closeLive(){live__open = false}
</script>
<div id="live__wrapper" class:live__open>

    <div id="live__eye">
        <div  class="live__action__button" on:mouseover="{hideLive}" on:focus="{hideLive}" on:mouseout="{showLive}" on:blur="{showLive}">
            <div class="svg-icon">
                <svg viewBox="0 0 20 20">
                    <use x="0" y="0" href="#b_watch"/>
                </svg>
            </div> 
            <div class="live__eye_label">See updates</div>
        </div>
        <div  class="live__action__button"  on:click="{closeLive}">
            <div class="svg-icon">
                <svg viewBox="0 0 20 20">
                    <use x="0" y="0" href="#b_delete"/>
                </svg>
            </div> 
            <div class="live__eye_label">Close</div>
        </div>
    </div>
    <div id='live__shadow' class:live__weak_opacity>
        <div id='live'>
            <LiveTableTask getIndex={(event) => getIndex(event)} updateStore={(event) => updateStore(event)} />
            <LiveTableMilestone getIndex={(event) => getIndex(event)} updateStore={(event) => updateStore(event)} />
        </div>
    </div>
</div>

<style>

    #live__wrapper{
        display: none;
    }
    #live__wrapper.live__open{
        display: block;
    }

    #live__shadow{  
        height: 100%;
        width: 100%;
        background-color: rgba(200, 218, 223, 0.5);
        position: fixed;
        top:0;
        left:0;
    }
    :global(#live__shadow.live__weak_opacity){
        opacity:0.2;   
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
    :global(div.live__line){
        margin:0.1em auto;
        width: 90%;
    }

    :global(input){
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        background-color: #bdd2da;
        border: 0px none;
        border-radius: 5px;
        font-size:1.5rem
    }

    :global(input.label){
        width: 20em;
    }
    :global(input.progress){
        width: 3em;
    }
    :global(div.live_cmd){
        width:20px;
        height: 20px;
        display:inline-block;
        margin:1px;
    }
    :global(div.live_cmd:hover){
        fill:rgb(33, 56, 33);
        background-color: rgb(188, 224, 154);
        border-radius: 45px;
        border: 1px solid rgb(188, 224, 154);
        margin:0;
    }
    :global(div.live_cmd_red:hover){
        fill:rgb(56, 33, 33);
        background-color: rgb(221, 175, 175);
        border: 1px solid rgb(221, 175, 175);;
    }
    :global(.show_false input){
        color:#6c7174
    }
    :global(.live__action){
        text-align: center;
    }
    :global(.live__action__button){
        border:1px solid #236B99;
        background-color: #2980B9;
        display: inline-block;
        padding: 0 10px;
        border-radius: 5px;
        cursor: pointer;

    }
    :global(.svg-icon){
        width:20px;
        height: 20px;
        display: inline-block;
        /*background-color: yellowgreen;*/
    }
    :global(#live__eye){
        height: 20px;
        position:fixed;
        top: 10%;
        right: 10%;
        z-index: 1000;
        cursor: pointer;
    }
    :global(.live__eye_label){
        height: 20px;
        display: inline-block;
        /*background-color: red;*/
    }
</style>