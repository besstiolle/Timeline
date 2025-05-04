<script lang="ts">
	import { page } from '$app/stores'

	const newHOST = 'https://timechart.dev'
	let redirectURI = newHOST
	if($page.url.searchParams.has('o')){
		redirectURI = newHOST + "/g/" + $page.params.slug + '?o=' + $page.url.searchParams.get('o')
	} else if($page.url.searchParams.has('w')){
		redirectURI = newHOST + "/g/" + $page.params.slug + '?w=' + $page.url.searchParams.get('w')
	} else if($page.url.searchParams.has('r')){
		redirectURI = newHOST + "/g/" + $page.params.slug + '?r=' + $page.url.searchParams.get('r')
	} 
</script>

<svelte:head>
	<title>Timeline Charts</title>
</svelte:head>

<h2>We moved 🛩️ ! Please found your timelines here : <a href='{redirectURI}'>https://timechart.dev</a></h2>

