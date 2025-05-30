<script lang="ts">
    import { browser } from "$app/environment"
    import { page } from '$app/state';
    import { store } from '$lib/stores';

    import { CustomLocalStorage } from '$lib/customLocalStorage';
    import { Rights } from '$lib/rights.class';
    import { JsonParser } from '$lib/jsonParser';
    import { FactoryTimeline } from '$lib/factoryTimeline';
    import { get } from '$lib/timelineRepository';

    import Draw from '$lib/Draw.svelte';
    import Toast from '$lib/Toast.svelte';
    import { NotFoundOnlineException } from '$lib/timelineException.class';
	import type { ResponseWithMeta } from "../../api/timeline/types";
	import { m } from "../../../paraglide/messages";
	import { Timeline } from "$lib/struct.class";

    
    let toastComponent:Toast

    $store.rights = new Rights(page.url.searchParams)


    //TODO : disabling SSR or not on this page ?
    // OR
    //TODO : using SSR to display loading gif
    // https://kit.svelte.dev/docs#hooks-handle
    // OR
    //TODO : using SSR to retrive information from fauna


    //TODO : displaying link & qrcode ?
    // https://medium.com/geekculture/few-ways-to-generate-qr-code-using-javascript-54b6b5220c4f

    const slug = page.params.slug
    if(!slug.match('^[a-zA-Z0-9]{64}$')){
        console.error(m.slug_toast_image_misconfigurated(), slug)
        // @ts-expect-error will be initiate by Svelte
        if(browser && toastComponent != null){
            toastComponent.show(m.slug_toast_image_misconfigurated(), false, 0)
        }
    }
    
    let currentTimeline: Timeline = CustomLocalStorage.getTimeline(slug)

    //If the local copie of Timeline has bigger rights than current url query parameter 
    //  We refresh the window.location with the higher rights
    let queryString = null
    if(!$store.rights.hasOwner() && currentTimeline?.ownerKey){
        queryString = "?o=" + currentTimeline.ownerKey
    } else if(!$store.rights.hasWriter() && currentTimeline?.writeKey){
        queryString = "?w=" + currentTimeline.writeKey
    } else if(!$store.rights.hasReader() && currentTimeline?.readKey){
        queryString = "?r=" + currentTimeline.readKey
    }
    if(queryString){    
        window.location.href = page.url.protocol + '//' + page.url.host + "/g/" + currentTimeline.key + queryString
    }

    if($store.rights.isNone()){
        if(!currentTimeline && browser){
            currentTimeline = new Timeline(slug, m.slug_default_timeline_title())
            currentTimeline = FactoryTimeline.initiate(currentTimeline)
        }
        $store.currentTimeline = currentTimeline
    } else if(browser) {
        let keyUrl = $store.rights.getTimelineField() 
        if(keyUrl == null){keyUrl=''}
        let valueUrl = $store.rights.getSlugParamKeyValue()
        if(valueUrl == null){valueUrl=''}
        let seachParams = new URLSearchParams([['key', slug], [keyUrl, valueUrl]])
        get(seachParams).then((responseWithMeta:ResponseWithMeta)=>{    


            currentTimeline = JSON.parse(JSON.stringify(responseWithMeta.data), JsonParser.timelineReviver) 
            

            //We're using the tricks of cloning the content of the Svelte store to avoid multiple refresh of store
            let cloneStore = structuredClone($store)
            //Update date of lastUpdated in the clone
            cloneStore.lastUpdatedLocally = 0
            cloneStore.lastCommitedRemotely = responseWithMeta.meta.ts
            cloneStore.currentTimeline = currentTimeline
            cloneStore.rights = $store.rights
            // Tricks : Set to true if we don't want to refresh lastUpdatedLocally property
            cloneStore._cancelRefreshLastUpdatedLocally = true
            store.set(cloneStore)

        }).catch((err) => {
            console.error("Error where calling get() in [slug].svelte : %o", err)
            if(toastComponent){
                if (err instanceof NotFoundOnlineException) {
                    toastComponent.show(m.slug_toast_distant_timeline_non_existent(), false, 10)
                    //Refresh page after 10s
                    setTimeout(function(){
                        window.location.href = page.url.protocol + '//' + page.url.host + "/g/" + slug
                    }, 10000);
                    
                } else {
                    toastComponent.show(m.slug_toast_remote_offline(), false, 0)

                }
            }
            $store.currentTimeline = currentTimeline 
        }).finally(()=>{
            
        })
    }
            
</script>

<svelte:head>
    <title>[T-C] {$store.currentTimeline?$store.currentTimeline.title:m.slug_default_title()}</title>
</svelte:head>

{#if $store.currentTimeline}
    <Draw/>
{/if}


<Toast bind:this={toastComponent}/>