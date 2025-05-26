<script lang="ts">
	import { browser } from "$app/environment";
	import { getLocale, locales, setLocale } from "../paraglide/runtime";
	import Version from "./Version/Version.svelte";

    const locales_ln =  locales.length - 1
    const currentLocale = getLocale()

    let isDark = false
    if(browser) {
        // Lecture du thème stocké ou détection préférée
        const stored = localStorage.getItem('theme')
        if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
            isDark = true
        }
    }

  function toggleTheme() {
    isDark = !isDark
    const html = document.documentElement
    html.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

</script>
<header class='bg-blue-50 dark:bg-gray-800 shadow-2xl border-b border-sky-700 h-12 flex items-center justify-between px-4'>
    <div class='flex items-center space-x-4'>
        <nav>
            <a href="/">Home</a>
        </nav>
    </div>
    <div class='flex items-center space-x-4'>
        <button
            onclick={toggleTheme}
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title="Toggles light & dark" 
            aria-label="auto"
            aria-live="polite"
        >
        {#if isDark}
            <!-- Icône soleil (mode clair) -->
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 32 32">
                <desc/><defs/><g fill="none" fill-rule="evenodd" id="Sunny" stroke="none" stroke-width="1"><g class="stroke-blue-50"  stroke-width="2.5" transform="translate(2.000000, 2.000000)"><circle cx="14" cy="14" id="Oval-4" r="8"/><path d="M14,0 L14,3 M23.8994949,4.10050506 L21.7781746,6.22182541 M28,14 L25,14 M23.8994949,23.8994949 L21.7781746,21.7781746 M14,28 L14,25 M4.10050506,23.8994949 L6.22182541,21.7781746 M3.83475851e-17,14 L3,14 M4.10050506,4.10050506 L6.22182541,6.22182541" id="Path-7" stroke-linecap="round"/></g></g></svg>
        {:else}
            <!-- Icône lune (mode sombre) -->
            <svg class="w-5 h-5 text-sky-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 0010.79 9.79z" />
            </svg>
        {/if}
        </button>
        <nav>
            <a aria-label="GitHub repository" href="https://github.com/besstiolle/Timeline">
                <svg viewBox="0 0 20 20" class="flex-1/2 size-5 fill-sky-900 dark:fill-blue-50">
                    <path d="M10 0C4.475 0 0 4.475 0 10a9.994 9.994 0 006.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.287-.6-1.175-1.025-1.412-.35-.188-.85-.65-.013-.663.788-.013 1.35.725 1.538 1.025.9 1.512 2.337 1.087 2.912.825.088-.65.35-1.088.638-1.338-2.225-.25-4.55-1.112-4.55-4.937 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.274.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 012.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0020 10c0-5.525-4.475-10-10-10z"></path></svg></a>
        </nav>
        <nav><Version/></nav>

        <langs>
            {#each locales as locale, index (index)}
                {#if locale == currentLocale}
                    <button type="button" class='font-bold'>{locale}</button>{#if locales_ln !== index}|{/if}
                {:else}
                    <button type="button" onclick={()=>setLocale(locale)} class='cursor-pointer'>{locale}</button>{#if locales_ln !== index}|{/if}
                {/if}
            {/each}
        </langs>
    </div>
</header>

<style>
</style>