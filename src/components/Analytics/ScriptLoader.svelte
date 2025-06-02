<script lang="ts">
	import type { Action } from 'svelte/action';

	export let src: string;
	export let attributes: Record<string, string> = {};

	const myaction: Action = () => {
		const script = document.createElement('script');
		script.src = src;
		script.defer = true;

		for (const [key, value] of Object.entries(attributes)) {
			script.setAttribute(key, value);
		}

		document.body.appendChild(script);
	};
</script>

<div use:myaction></div>
