<script lang="ts">

	import { Helpers } from "$lib/helpers";
	import { Rights } from "$lib/rights.class";
	import { store } from "$lib/stores";
	import { Timeline } from "$lib/struct.class";
	import Cards from "../components/Cards.svelte";
	import { m } from "../paraglide/messages";

	//Reset store currentTimeline information when we are here
	$store.currentTimeline=new Timeline()
	$store.lastCommitedRemotely=-1
	$store.lastUpdatedLocally=-1
	$store.rights=new Rights(null)

	function gotoNew(){
		window.location.href = '/g/' + Helpers.randomeString(64)
	}


</script>

<svelte:head>
	<title>Timeline Charts</title>
</svelte:head>

<svg xmlns="http://www.w3.org/2000/svg" class="hidden">
	<defs>
		<g id="ico_plus" transform="translate(28.000000, 278.000000)">
			<path class="st0" d="M4-222.1c-13.2,0-23.9-10.7-23.9-23.9c0-13.2,10.7-23.9,23.9-23.9s23.9,10.7,23.9,23.9     C27.9-232.8,17.2-222.1,4-222.1L4-222.1z M4-267.3c-11.7,0-21.3,9.6-21.3,21.3s9.6,21.3,21.3,21.3s21.3-9.6,21.3-21.3     S15.7-267.3,4-267.3L4-267.3z" id="Fill-38"/>
			<polygon class="st0" id="Fill-39" points="-8.7,-247.4 16.7,-247.4 16.7,-244.6 -8.7,-244.6    "/>
			<polygon class="st0" id="Fill-40" points="2.6,-258.7 5.4,-258.7 5.4,-233.3 2.6,-233.3    "/>
		</g>

		<g id="ico_menu">
			<path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z"/>
			<path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z"/>
			<path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z"/>
		</g>
		<path id="b_delete"         d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
		<path id="b_duplicate"      d="M17.391,2.406H7.266c-0.232,0-0.422,0.19-0.422,0.422v3.797H3.047c-0.232,0-0.422,0.19-0.422,0.422v10.125c0,0.232,0.19,0.422,0.422,0.422h10.125c0.231,0,0.422-0.189,0.422-0.422v-3.797h3.797c0.232,0,0.422-0.19,0.422-0.422V2.828C17.812,2.596,17.623,2.406,17.391,2.406 M12.749,16.75h-9.28V7.469h3.375v5.484c0,0.231,0.19,0.422,0.422,0.422h5.483V16.75zM16.969,12.531H7.688V3.25h9.281V12.531z"></path>
		<g id="ico_delete">
			<path class="st1" d="M17.7,23.3H6.3c-1,0-1.7-0.8-1.7-1.7V6.6h14.8v14.9C19.4,22.5,18.6,23.3,17.7,23.3z"/>
			<path class="st1" d="M20.4,6V4.2c0-0.7-0.6-1.3-1.3-1.3h-3.7L15,1.4C14.8,1,14.5,0.8,14,0.8H10C9.6,0.8,9.2,1,9,1.4L8.6,2.8H4.9     c-0.7,0-1.3,0.6-1.3,1.3V6c0,0.3,0.3,0.6,0.6,0.6h15.6C20.2,6.6,20.4,6.3,20.4,6z"/>
			<line class="st1" x1="8.8" x2="8.8" y1="10.2" y2="19.7"/>
			<line class="st1" x1="12" x2="12" y1="10.2" y2="19.7"/>
			<line class="st1" x1="15.2" x2="15.2" y1="10.2" y2="19.7"/>
		</g>
		<g id="ico_cloud">
			<path d="M399.3,232.8c0-1.2,0.2-2.4,0.2-3.6c0-64.3-52.8-117.2-116.8-117.2c-46.1,0-85.8,27.9-104.4,67c-8.1-4.1-17.1-6.4-26.8-6.4  c-29.6,0-54.1,23.7-58.9,52C57.4,236.8,32,268.8,32,308.4c0,49.8,40.1,91.6,89.6,91.6H398c45,0,82-38.9,82-84.3  C480,270.1,444.6,232.9,399.3,232.8z M397.5,383.6l-3.2,0.4H122.4c-40.9,0-74.2-34.9-74.2-76.1c0-31.9,20.2-58.4,50.2-68.8l8.4-3  l1.5-8.8c3.6-21.6,22.1-39.3,43.9-39.3c6.9,0,13.7,1.6,19.9,4.8l13.5,6.8l6.5-13.7c16.6-34.9,52.1-58.2,90.4-58.2  c55.3,0,100.9,44.1,100.9,99.7c0,13.3-0.2,20.3-0.2,20.3l15.2,0.1c36.7,0.5,65.6,30.5,65.6,67.4C464,352.1,434.2,383.4,397.5,383.6z  "/>
		</g>
	</defs>
</svg>

<div class="w-lg m-auto mt-15">
	<img src='logo672.png' alt="TimeChart logo"/>
	<div>
		<p class="p-2 text-justify indent-5">{m.landing_welcome()}</p>
		<p class="p-2 text-justify indent-5">{m.landing_we_are()}</p>
	</div>
	<button class="mx-auto mt-10 flex gap-2 rounded-full shadow-xl/15 bg-linear-to-r/srgb from-cyan-600 to-emerald-500 hover:bg-linear-to-r/hsl hover:to-cyan-600 hover:from-emerald-500 p-3 cursor-pointer" 
		onclick={gotoNew}>
		<svg viewBox="0 0 64 64" class='size-6 fill-gray-800 dark:fill-blue-50'>
			<use x="0" y="0" href="#ico_plus"/>
		</svg>
		{m.landing_create()}
	</button>
</div>

<Cards />

<style>
	
</style>