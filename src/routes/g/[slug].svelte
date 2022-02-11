<script lang="ts">
import { browser } from '$app/env';
import { page } from '$app/stores'
import { store } from '$lib/stores';

import { CustomLocalStorage } from '$lib/customLocalStorage';
import { Struct } from '$lib/struct.class';

import Draw from '$lib/Draw.svelte';
import { FactoryTimeline } from '$lib/factoryTimeline';
import { Constantes } from '$lib/constantes';
import { get } from '$lib/timelineRepository';
import { JsonParser } from '$lib/jsonParser';
import Toast from '$lib/Toast.svelte';


let access = 'g';
let toastComponent


//TODO : disabling SSR or not on this page ?
// OR
//TODO : using SSR to display loading gif
// https://kit.svelte.dev/docs#hooks-handle

//TODO : displaying link & qrcode ?
// https://medium.com/geekculture/few-ways-to-generate-qr-code-using-javascript-54b6b5220c4f


const slug = $page.params.slug
if(slug.endsWith(".png")){
    console.error("An image was misconfigurated, eg bad = 'foo.png', good = '/foo.png'")
    toastComponent.show("An image was misconfigurated, eg bad = 'foo.png', good = '/foo.png'", false, 0)
}
let currentTimeline: Struct.Timeline = CustomLocalStorage.getTimeline(slug)

let o = $page.url?$page.url.searchParams.get('o'):null
let w = $page.url?$page.url.searchParams.get('w'):null
let r = $page.url?$page.url.searchParams.get('r'):null


if(!o && currentTimeline && currentTimeline.ownerKey){
    window.location.href = $page.url.protocol + '//' + $page.url.host + "/g/" + currentTimeline.key + "?o=" + currentTimeline.ownerKey
} else if(!o && !w && currentTimeline && currentTimeline.writeKey){
    window.location.href = $page.url.protocol + '//' + $page.url.host + "/g/" + currentTimeline.key + "?w=" + currentTimeline.writeKey
} else if(!o && !w && !r && currentTimeline && currentTimeline.readKey){
    window.location.href = $page.url.protocol + '//' + $page.url.host + "/g/" + currentTimeline.key + "?w=" + currentTimeline.readKey
}

if(o){
    access = Constantes.ACCESS.OWNER
} else if(w) {
    access = Constantes.ACCESS.WRITE
}else if(r) {
    access = Constantes.ACCESS.READ
} else {
    access = Constantes.ACCESS.LOCAL
}


if(access === Constantes.ACCESS.LOCAL){
    if(!currentTimeline && browser){
        currentTimeline = new Struct.Timeline(slug, "My new Project")
        currentTimeline = FactoryTimeline.initiate(currentTimeline)
    }

    $store.currentTimeline = currentTimeline
} else {
    get(slug, o, w, r).then((json)=>{        
        if(!json["message"]["data"]) {
            console.error('node data not found in json["message"] : %o', json["message"])    
            throw 'node data not found in json["message"]'            
        }

        currentTimeline = JSON.parse(JSON.stringify(json["message"]["data"]), JsonParser.timelineReviver) 
          

        //We're using the tricks of cloning to avoid multiple refresh of store
        let cloneStore = {...$store}
        //Update date of lastUpdated in the clone
        cloneStore.lastUpdatedLocally = null
        cloneStore.lastCommitedRemotely = json["message"]["ts"]
        cloneStore.currentTimeline = currentTimeline
        // Tricks : Set to true if we don't want to refresh lastUpdatedLocally property
        cloneStore._cancelRefreshLastUpdatedLocally = true
        store.set(cloneStore)

    }).catch((err) => {
        console.error("Error where calling get() in [slug].svelte : %o", err)
        if(toastComponent){
            toastComponent.show("Oups, we couldn't reach the remote endpoint so we'll use your local data instead.<br/> Please check your browser console for more informations. Click me to dismiss the notif", false, 0)
        }
        $store.currentTimeline = currentTimeline 
    }).finally(()=>{
        
    })
}
            
</script>

<svelte:head>
    <title>[T-C] {$store.currentTimeline?$store.currentTimeline.title:'Please wait a second'}</title>
</svelte:head>

{#if $store.currentTimeline}
<Draw/>
{/if}


<Toast bind:this={toastComponent}/>