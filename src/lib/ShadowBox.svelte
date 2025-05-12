<script lang="ts">
	import { m } from "../paraglide/messages";


let hidden = true
export let id:string = ''
export function closeComponent(){
    hidden = true
    document.body.classList.remove('lock')
}
export function openComponent(){
    hidden = false
    document.body.classList.add('lock')
}   
function handleKeydown(event:KeyboardEvent) {if (!hidden && event.key === 'Escape') {closeComponent()}}

</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="ShadowBoxBG" class:hidden on:click={closeComponent} on:keydown={closeComponent} role="button" tabindex="0"></div>
<div id={id} class="ShadowBox bg-sky-50 dark:bg-gray-700 p-4" 
            class:hidden>
    <div class="ShadowContent">
        <slot>Default content for the Box Slot</slot>
    </div>            
    <div class="ShadowClosing">
        {m.shadowbox_exit_instruction_0()} 
        <span class='pointer font-bold' on:click={closeComponent} on:keydown={closeComponent} role="button" tabindex="0">
            {m.shadowbox_exit_instruction_1()}
        </span>
        {m.shadowbox_exit_instruction_2()} 
        <span class='font-bold'>
            {m.shadowbox_exit_instruction_3()}
        </span>
        {m.shadowbox_exit_instruction_4()}
    </div>
</div>

<style>
    .ShadowBoxBG{
        height: 100vh;
        width: 100vw;
        position: fixed;
        top:0;
        left:0;
        backdrop-filter: blur(0.5rem);
    }
    .ShadowBox{
        width: 40vw;
        max-height: 80vh;
        position: absolute;
        text-align: center;
        top: 10vh;
        left: 30vw;
        outline: 2px dashed #92b0b3 !important;
        outline-offset: -10px !important;
        position: fixed;
    }
    .ShadowContent, .ShadowClosing{
        margin: 2vh auto;
        overflow: scroll;
        max-height: 70vh;
    }
    :global(.lock){
        overflow-y: hidden;
    }
</style>