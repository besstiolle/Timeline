<script lang="ts">
import { store } from './stores';
import { LIVE_PREFIX } from './constantes';

import LiveTableTask from './LiveTableTask.svelte';
import LiveTableMilestone from './LiveTableMilestone.svelte';
import ShadowBox from './ShadowBox.svelte';
    

    let shadowBox:ShadowBox

    const css_class_warn = "date_warn"
    const css_class_warn_order = "date_warn_order"

    export function openShadowBox(){
        shadowBox.openComponent()
    }

    function updateStore(prefix: string, position:number ): void{

        let elm = document.getElementById(prefix + position) as HTMLInputElement
        let val:string = elm.value

        if(val === undefined || val === ''){
            elm.classList.add(css_class_warn)
            return
        }

        let date:Date = new Date(val)
        if(!(date instanceof Date) || isNaN(date.getTime())){
            elm.classList.add(css_class_warn)
            return
        }

        let diff:number = Math.abs(new Date(val).getFullYear() - new Date().getFullYear())
        if(diff > 40){
            elm.classList.add(css_class_warn)
            return
        }

        if(prefix === LIVE_PREFIX.TS){
            let other = document.getElementById(LIVE_PREFIX.TE + position) as HTMLInputElement
            if (other.value < val) {
                elm.classList.add(css_class_warn_order)
                other.classList.add(css_class_warn_order)
                return
            } else {
                elm.classList.remove(css_class_warn_order)
                other.classList.remove(css_class_warn_order)
            }
        }
        if(prefix === LIVE_PREFIX.TE){
            let other = document.getElementById(LIVE_PREFIX.TS + position) as HTMLInputElement
            if (other.value > val) {
                elm.classList.add(css_class_warn_order)
                other.classList.add(css_class_warn_order)
                return
            } else {
                elm.classList.remove(css_class_warn_order)
                other.classList.remove(css_class_warn_order)
            }
        }


        elm.classList.remove(css_class_warn)

        if(prefix === LIVE_PREFIX.TS){
            $store.currentTimeline.tasks[position].dateStart = val
        }
        
        if(prefix === LIVE_PREFIX.TE){
            $store.currentTimeline.tasks[position].dateEnd = val
        }
        
        if(prefix === LIVE_PREFIX.MD){
            $store.currentTimeline.milestones[position].date = val
        }
        $store.currentTimeline.tasks = $store.currentTimeline.tasks
    }

</script>



<ShadowBox bind:this={shadowBox}>
    <div class='title'><label for='titleOfTimeline'>Title : </label><input id='titleOfTimeline' type='text' bind:value={$store.currentTimeline.title}/></div>
    <LiveTableTask updateStore={updateStore} />
    <LiveTableMilestone updateStore={updateStore} />
    <div><label for="showToday">Show `Today` vertical line : </label><input type="checkbox" bind:checked="{$store.currentTimeline.showToday}"  name="showToday" id="showToday" /></div>
    <!--<div><label for={LIVE_PREFIX.TSF}>A custom start date to make a focus : </label><input type="date" id="{LIVE_PREFIX.TSF}" value="{$store.currentTimeline.dateStartFocus}" min="1900-01-01" max="2999-12-31" on:change={() => updateStore2(LIVE_PREFIX.TSF)} on:blur={() => updateStore2(LIVE_PREFIX.TSF)}></div>
    <div><label for={LIVE_PREFIX.TEF}>A custom end  date to make a focus : </label><input type="date" id="{LIVE_PREFIX.TEF}" value="{$store.currentTimeline.dateEndFocus}" min="1900-01-01" max="2999-12-31" on:change={() => updateStore2(LIVE_PREFIX.TEF)} on:blur={() => updateStore2(LIVE_PREFIX.TEF)}></div>
    <div><label for="showOutOfBounds">Show Tasks & Milestones even if theirs start & end date are out of limit of custom dates : </label><input type="checkbox" bind:checked="{$store.currentTimeline.showOutOfBounds}"  name="showOutOfBounds" id="showOutOfBounds" /></div>-->
</ShadowBox>

<style>

    :global(div.live__line){
        margin:0.2em auto;
        width: 90%;
    }
    :global(.live__input_top, live__input_bottom){
        margin:0.2em auto;
    }
    :global(.live__input_bottom){
        margin-left:7vw;
    }

    :global(input){
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        background-color: #bdd2da;
        border: 0px none;
        border-radius: 5px;
        font-size:1.2rem
    }

    div.title{
        margin: 30px auto;
        font-size: 2rem;
        text-align: center;
    }
    div.title input{
        font-size:2rem;
        width: 25em;
    }

    :global(input.label){
        width: 13em;
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
        border: 1px solid rgb(221, 175, 175);
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
    }
    :global(.date_warn, .date_warn_order){
        background-color: #ff9800;
    }

    :global(progress){
        width: 100px;
    }

    :global(label){
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        font-size:1.2rem
    }
    
    :global(label:hover, input[type="checkbox"]:hover){
        cursor: pointer;
    }
</style>