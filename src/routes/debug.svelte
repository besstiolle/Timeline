
<script lang="ts">
import { browser } from "$app/env";
import { Helpers } from "$lib/helpers.class";
import type { Struct } from "$lib/struct.class";


	
let store = null
let localData: Struct.Data = null
let result = "success of parsing"
if(browser){
    store = localStorage.getItem("store")
    try{
        localData = JSON.parse(store, Helpers.dataReviver)
    } catch (error) {
        result = error
    }
} 


</script>

<h1>Debug page</h1>
<h2>Dump from your localstorage : </h2>
<div class='codeW'><textarea>
    {store}
</textarea></div>
<h2>JSON parsing your localstorage : </h2>
<div class='codeW'><pre>
    {result}
</pre></div>
<style>
    textarea{  
        width:100%;
        height:100px;
        
    }
    div.codeW{
        width: 95%;
        margin:auto;
    }
</style>