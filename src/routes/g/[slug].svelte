<script lang="ts">
import { browser } from '$app/env';
import { page } from '$app/stores'
import { store } from '$lib/stores';

import { CustomLocalStorage } from '$lib/customLocalStorage';
import { Struct } from '$lib/struct.class';
import { HelperStructTimeline } from '$lib/helperStructTimeline.class';

import Draw from '$lib/Draw.svelte';


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
	if(!currentTimeline && browser){
		currentTimeline = new Struct.Timeline(slug, "My new Project")
		currentTimeline = HelperStructTimeline.initiate(currentTimeline)
	}
	
	$store.currentTimeline = currentTimeline
	
	// Reactivate this line if some pb with title edition of timeline
	//HelperStructCards.updateCardsWithTimeline($store.cards, currentTimeline)
	
</script>

<svelte:head>
	<title>[T-C] {$store.currentTimeline?$store.currentTimeline.title:'Please wait a second'}</title>
</svelte:head>
{#if $store.currentTimeline}
<Draw/>
{/if}