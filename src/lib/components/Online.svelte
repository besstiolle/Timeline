<script lang="ts">
	import { page } from '$app/state';
	import { store } from '$lib/stores';

	import { Helpers } from '$lib/helpers';
	import { remove, create } from '$lib/timelineRepository';
	import ShadowBox from '$lib/components/ShadowBox.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { Rights } from '$lib/rights.class';
	import { FactoryCards } from '$lib/factoryCards';
	import type { ResponseWithMeta } from '$lib/server/types';
	import { m } from '../../paraglide/messages';

	let toastComponent: Toast;
	let shadowBox: ShadowBox;

	export function openShadowBox() {
		shadowBox.openComponent();
	}
	export function commit() {
		if (
			$store.lastUpdatedLocally !== null &&
			$store.lastCommitedRemotely !== null &&
			$store.lastUpdatedLocally - $store.lastCommitedRemotely > 5000
		) {
			$store.commitInProgress = true;
			console.debug('gap > 5000 ms : %o', $store.lastUpdatedLocally - $store.lastCommitedRemotely);
			create($store.currentTimeline)
				.then((responseWithMeta: ResponseWithMeta) => {
					$store.lastCommitedRemotely = responseWithMeta.meta.ts;
					if (toastComponent) {
						toastComponent.show(m.online_toast_saved_success());
					}
				})
				.catch((err) => {
					console.error('Error where calling create() in Online.commit() : %o', err);
					if (toastComponent) {
						toastComponent.show(m.online_toast_remote_offline(), false, 0);
					}
				})
				.finally(() => {
					$store.commitInProgress = false;
				});
		} else {
			console.debug('gap < 5000 ms : %o', $store.lastUpdatedLocally - $store.lastCommitedRemotely);
		}
	}

	const base_url = page.url.protocol + '//' + page.url.host;

	function doOffline() {
		let ownerKey = $store.currentTimeline.ownerKey;
		if (ownerKey == null) {
			ownerKey = '';
		}
		let seachParams = new URLSearchParams([
			['key', $store.currentTimeline.key],
			['ownerKey', ownerKey]
		]);
		remove(seachParams)
			.then(() => {
				store.update((s) => {
					s.currentTimeline.isOnline = false;
					s.currentTimeline.ownerKey = null;
					s.currentTimeline.writeKey = null;
					s.currentTimeline.readKey = null;
					s.lastCommitedRemotely = -1;
					return { ...s };
				});

				//Rewrite URL
				window.location.href = base_url + '/g/' + $store.currentTimeline.key;
			})
			.catch((err) => {
				console.error('Error where calling remove() in Online.doOffline() : %o', err);
				if (toastComponent) {
					toastComponent.show(m.online_toast_remote_offline(), false, 0);
				}
			})
			.finally(() => {});

		//update cards with the online/offline information
		//TODO : vérifier pertinence de cet update vs update réalisé dans l'obs du store
		store.update((s) => {
			s.cards = FactoryCards.updateCardsWithTimeline($store.cards, $store.currentTimeline);
			return { ...s };
		});
	}
	function doOnline() {
		store.update((s) => {
			s.currentTimeline.isOnline = true;
			s.currentTimeline.ownerKey = Helpers.randomeString(64);
			s.currentTimeline.writeKey = Helpers.randomeString(64);
			s.currentTimeline.readKey = Helpers.randomeString(64);
			return { ...s };
		});

		create($store.currentTimeline)
			.then((responseWithMeta: ResponseWithMeta) => {
				$store.lastCommitedRemotely = responseWithMeta.meta.ts;
				if (toastComponent) {
					toastComponent.show(m.online_toast_saved_success());
				}
				//Refresh internal Rights value
				store.update((s) => {
					s.rights = new Rights($store.currentTimeline.ownerKey);
					return { ...s };
				});
			})
			.catch((err) => {
				console.error('Error where calling create() in Online.doOnline() : %o', err);
				if (toastComponent) {
					toastComponent.show(m.online_toast_remote_offline(), false, 0);
				}
				store.update((s) => {
					s.currentTimeline.isOnline = false;
					s.currentTimeline.ownerKey = null;
					s.currentTimeline.writeKey = null;
					s.currentTimeline.readKey = null;
					return { ...s };
				});
			})
			.finally(() => {});

		//update cards with the online/offline information
		//TODO : vérifier pertinence de cet update vs update réalisé dans l'obs du store
		store.update((s) => {
			s.cards = FactoryCards.updateCardsWithTimeline(s.cards, s.currentTimeline);
			return { ...s };
		});
	}

	function select(event: MouseEvent) {
		//const input = document.getElementById("text-box");
		//input.focus();
		//input.select();
		const input = event.target as HTMLInputElement;
		input.focus();
		input.select();
	}
</script>

<ShadowBox bind:this={shadowBox}>
	{#if $store.currentTimeline.isOnline}
		<div class="warn">
			{m.online_warn_before_offline_0()} "<span class="font-bold"
				>{m.online_warn_before_offline_1()}</span
			>" {m.online_warn_before_offline_2()}
		</div>

		<!--Action-->
		<button
			class="mx-auto mt-10 flex gap-2 rounded-full shadow-xl/15 p-3 cursor-pointer
                bg-linear-to-r/srgb from-cyan-600 to-emerald-500 hover:bg-linear-to-r/hsl hover:to-cyan-600 hover:from-emerald-500"
			onclick={doOffline}
		>
			<svg viewBox="0 0 600 600" class="size-6 fill-gray-800 dark:fill-blue-50">
				<use x="5" y="75" href="#ico_cloud" />
			</svg>
			{m.online_action_offline()}
		</button>

		<div class="text-left mx-30 mt-5">
			<label class="block" for="readOnly">{m.online_readonly()} : </label>
			<input
				class="block w-full"
				id="readOnly"
				readonly
				type="text"
				onclick={select}
				value={base_url +
					'/g/' +
					$store.currentTimeline.key +
					'?r=' +
					$store.currentTimeline.readKey}
			/>
		</div>
		<div class="text-left mx-30 mt-5">
			<label class="block" for="writer">{m.online_writer()} : </label>
			<input
				class="block w-full"
				id="writer"
				readonly
				type="text"
				onclick={select}
				value={base_url +
					'/g/' +
					$store.currentTimeline.key +
					'?w=' +
					$store.currentTimeline.writeKey}
			/>
		</div>
		<div class="text-left mx-30 mt-5">
			<label class="block" for="owner">{m.online_owner()} : </label>
			<input
				class="block w-full"
				id="owner"
				readonly
				type="text"
				onclick={select}
				value={base_url +
					'/g/' +
					$store.currentTimeline.key +
					'?o=' +
					$store.currentTimeline.ownerKey}
			/>
		</div>
	{:else}
		<div class="warn">
			{m.online_warn_before_online_0()} "<span class="font-bold"
				>{m.online_warn_before_online_1()}</span
			>" {m.online_warn_before_online_2()}
		</div>

		<!--Action-->
		<button
			class="mx-auto mt-10 flex gap-2 rounded-full shadow-xl/15 p-3 cursor-pointer
                bg-linear-to-r/srgb from-cyan-600 to-emerald-500 hover:bg-linear-to-r/hsl hover:to-cyan-600 hover:from-emerald-500"
			onclick={doOnline}
		>
			<svg viewBox="0 0 600 600" class="size-6 fill-gray-800 dark:fill-blue-50">
				<use x="5" y="75" href="#ico_cloud" />
			</svg>
			{m.online_action_online()}
		</button>
	{/if}
</ShadowBox>
<Toast bind:this={toastComponent} />

<style>
</style>
