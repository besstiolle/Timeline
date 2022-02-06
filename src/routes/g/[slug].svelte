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


let access = 'g';


//TODO : disabling SSR or not on this page ?
// OR
//TODO : using SSR to display loading gif
// https://kit.svelte.dev/docs#hooks-handle

//TODO : displaying link & qrcode ?
// https://medium.com/geekculture/few-ways-to-generate-qr-code-using-javascript-54b6b5220c4f


const slug = $page.params.slug
if(slug.endsWith(".png")){
    console.error("An image was misconfigurated, eg bad = 'foo.png', good = '/foo.png'")
}
let currentTimeline: Struct.Timeline = CustomLocalStorage.getTimeline(slug)


let o = $page.query.get('o')
let w = $page.query.get('w')
let r = $page.query.get('r')

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

} else {
    get(slug, o, w, r).then((json)=>{
        console.info("get.then")
        currentTimeline = JSON.parse(JSON.stringify(json["message"]["data"]["timeline"]), JsonParser.timelineReviver)        
        console.info(currentTimeline)
    }).catch((err) => {
        console.info("get.catch")
        console.info(err)
    }).finally(()=>{
        console.info("get.finnaly")
    })

}
//TODO here
$store.currentTimeline = currentTimeline
    
    
            
</script>

<svelte:head>
    <title>[T-C] {$store.currentTimeline?$store.currentTimeline.title:'Please wait a second'}</title>
</svelte:head>
{#if $store.currentTimeline}
<Draw/>
{/if}