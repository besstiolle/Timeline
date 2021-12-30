
<script lang="ts">
	import Draw from '$lib/Draw.svelte';
</script>
<Draw/>

<style>
	:global(html, body) {
  height: 100%;
  width:100%;
  max-width:100%;
  margin: 0;
  font-family: Roboto, sans-serif;
  color: #0f3c4b;
  background-color: #e5edf1;
  overflow: hidden;
}


:global(a){
  transition: color 0.2s ease, border-bottom-color 0.2s ease;
  border-bottom: dotted 1px;
  color: inherit;
  text-decoration: none;
}

:global(.hidden){
  display:none !important;
}
</style>