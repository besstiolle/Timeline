
<script lang="ts">
import { browser } from "$app/env";
import { Helpers } from "$lib/helpers.class";
import { HelperStructData } from "$lib/helperStructData.class";
import type { Struct } from "$lib/struct.class";


	
let store = null
let localData: Struct.Data = null
let result = "success of parsing ✅"
if(browser){
    store = localStorage.getItem("store")
    try{
        localData = JSON.parse(store, Helpers.dataReviver)
        HelperStructData.refresh(localData)
        console.info(localData)
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

<h1>Debug page</h1>
<h2>Dump from your localstorage : </h2>
<div class='codeW'>
{#if store}
    <textarea>{store}</textarea>
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
        width:100%;
        height:100px;
        
    }
    div.codeW{
        width: 95%;
        margin:auto;
    }
</style>