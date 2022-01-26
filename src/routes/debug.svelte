
<script lang="ts">
import { browser } from "$app/env";
import { Helpers } from "$lib/helpers.class";
import { HelperStructTimeline } from "$lib/helperStructTimeline.class";
import type { Struct } from "$lib/struct.class";


	
let store = null
let localTimeline: Struct.Timeline = null
let result = "success of parsing ✅"
if(browser){
    store = localStorage.getItem("store")
    try{
        localTimeline = JSON.parse(store, Helpers.dataReviver)
        HelperStructTimeline.refresh(localTimeline)
        console.info(localTimeline)
    } catch (error) {
        result = error
    }
} 

function purge(event){
    localStorage.clear()
    alert("your localstorage is purged ✅")
    location.reload()
}


</script>
<svelte:head>
	<title>Debug</title>
</svelte:head>


<h1>Debug page</h1>
<h2>Dump from your localstorage : </h2>
<div class='codeW'>
{#if store}
    <textarea rows=20>{JSON.stringify(JSON.parse(store, Helpers.dataReviver), undefined, 2)}</textarea>
    
{:else}
    <p>your localstorage is empty ✅</p>
{/if}
</div>
<h2>JSON parsing your localstorage : </h2>
<div class='codeW'><p>
    {result}
</p></div>
<h2>Reset your localstorage</h2>
<div><button on:click={purge}>click me if you dare</button></div>
<style>
    :global(body){
        padding:5px;
    }
    textarea{  
        width:500px;
        height:100%;
        
    }
    div.codeW{
        width: 95%;
        margin:auto;
    }
</style>