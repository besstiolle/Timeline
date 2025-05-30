<script lang="ts">
	import { page } from "$app/state";

    
</script>

<svelte:head>
	<title>Test Image</title>
</svelte:head>
<div>

	<p>ANALYTICS_UMAMI_CODE : {page.data.ANALYTICS_UMAMI_CODE}</p>
	<p>ANALYTICS_UMAMI_CODE : {page.data.ANALYTICS_UMAMI_SCRIPT}</p>
	<p>ANALYTICS_PLAUSIBLE_CODE : {page.data.ANALYTICS_PLAUSIBLE_CODE}</p>
	<p>ANALYTICS_PLAUSIBLE_SCRIPT : {page.data.ANALYTICS_PLAUSIBLE_SCRIPT}</p>
	<p>SHOW_VERSION : {page.data.SHOW_VERSION}</p>

    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="presentation">
		
		<rect x=0 y=0 width=10 height=10 class="fill-slate-900 dark:fill-slate-100"/>
		<rect x=10 y=0 width=10 height=10  class="primaryFill"/>
		<text x="20" y="10" class="primaryFill">fill-slate-900 / fill-slate-100</text>

		<rect x=0 y=20 width=10 height=10 class="fill-slate-600 dark:fill-slate-400"/>
		<rect x=10 y=20 width=10 height=10  class="secondaryFill"/>
		<text x="20" y="30" class="secondaryFill">fill-slate-600 / fill-slate-400</text>

		<!--<rect x=0 y=40 width=10 height=10 class="fill-slate-50 dark:fill-slate-400"/>
		<rect x=10 y=40 width=10 height=10 class="fill-slate-100 dark:fill-slate-400"/>
		<rect x=20 y=40 width=10 height=10 class="fill-slate-200 dark:fill-slate-400"/>
		<rect x=30 y=40 width=10 height=10 class="fill-slate-300 dark:fill-slate-400"/>
		<rect x=40 y=40 width=10 height=10 class="fill-slate-400"/>
		<rect x=50 y=40 width=10 height=10 class="fill-slate-500"/>
		<rect x=60 y=40 width=10 height=10 class="fill-slate-600"/>
		<rect x=70 y=40 width=10 height=10 class="fill-slate-700"/>
		<rect x=80 y=40 width=10 height=10 class="fill-slate-800"/>
		<rect x=90 y=40 width=10 height=10 class="fill-slate-900"/>-->

		<rect x=0 y=60 width=10 height=10 class="primaryFill"/>
		<rect x=10 y=60 width=10 height=10  class="secondaryFill"/>
		<text x="20" y="70" class="primaryFill">fill-slate-600 / fill-slate-400</text>

		
    </svg>

</div>

<style>

</style>