<script lang="ts">

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
<div id={id} class="ShadowBox" class:hidden>
    <div class="ShadowContent">
        <slot>Default content for the Box Slot</slot>
    </div>            
    <div class="ShadowClosing">Click <span class='pointer' on:click={closeComponent} on:keydown={closeComponent} role="button" tabindex="0">here</span> or tape <span>Escape key</span> to close this windows</div>
</div>

<style>
    .ShadowBoxBG{
        height: 100vh;
        width: 100vw;
        background-color: rgba(200, 218, 223, 0.5);
        position: fixed;
        top:0;
        left:0;
    }
    .ShadowBox{
        height: 80vh;
        max-height: 80vh;
        width: 90vw;
        font-size: 1.5rem;
        background-color: #c8dadf;
        position: absolute;
        text-align: center;
        top: 10vh;
        left: 5vw;
        outline: 2px dashed #92b0b3 !important;
        outline-offset: -10px !important;
        position: fixed;
        overflow-y: scroll;
    }
    .ShadowContent, .ShadowClosing{
        margin: 5vh auto;
    }
  
    span{
        font-weight: bold;
    }
    :global(.lock){
        overflow-y: hidden;
    }
</style>