
<script lang="ts">
    import { CustomLocalStorage } from "$lib/customLocalStorage";
    import type { Struct } from "$lib/struct.class";
	import { JsonParserException } from "$lib/timelineException.class";


	
let timelines: Array<Struct.Timeline> = new Array<Struct.Timeline>()
let errors: Array<string> = new Array<string>()
let cards:Struct.Card[]
try{
    cards = CustomLocalStorage.getCards()
    cards.forEach(card => {
        try{
            timelines.push(CustomLocalStorage.getTimeline(card.key))
        } catch (error) {
            let message;if (error instanceof Error) {message = error.message} else {message = String(error)}

            if(error instanceof JsonParserException){
                errors.push("JsonParserException during retriving/parsing of Timeline '%o' : %o" ,card.key, message)
            } else {
                errors.push("unexpected error during retriving/parsing of Timeline '%o' : %o" ,card.key, message)
            }
            
        }
        
    });
} catch (error) {
    let message;if (error instanceof Error) {message = error.message} else {message = String(error)}
    
    if(error instanceof JsonParserException){
        errors.push("JsonParserException during retriving/parsing of Cards : %o", message)
    } else {
        errors.push("unexpected error during retriving/parsing of Cards : %o", message)
    }
}

    
function purge(event:Event){
    CustomLocalStorage.clear()
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
{#if errors}
    {#each errors as error}
        <div style="color:red">{error}</div>
    {/each}
{/if}
{#if cards}
<h3>Storage "Cards"</h3>
    <textarea rows=20>{JSON.stringify(cards, undefined, 2)}</textarea> 
    {#each timelines as timeline}
    <h3>Storage Timeline "{timeline.key} : {timeline.title}"</h3>
        <textarea rows=20>{JSON.stringify(timeline, undefined, 2)}</textarea> 
    {/each}
{:else}
    <p>your localstorage is empty ✅</p>
{/if}
</div>
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