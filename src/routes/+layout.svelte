<script lang="ts">
    import "../app.css";
    import { userState } from '$lib/state/auth.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import Header from '$lib/components/Header.svelte';
    import Loader from '$lib/components/Loader.svelte';

    let { children } = $props();

    onMount(() => { userState.init(); });

    $effect(() => {
        if (!userState.loading) {
            const isLoginPage = $page.url.pathname === '/login';
            if (!userState.user && !isLoginPage) goto('/login');
            else if (userState.user && isLoginPage) goto('/');
        }
    });
</script>

<div class="min-h-screen relative overflow-x-hidden">
    <div class="fixed inset-0 pointer-events-none z-0">
        <div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px]"></div>
        <div class="absolute top-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[100px]"></div>
    </div>

    {#if userState.loading}
        <div class="fixed inset-0 z-[200] flex items-center justify-center bg-white">
            <Loader />
        </div>
    {:else}
        <Header />
        <main class="relative z-10 pt-28 pb-12">
            {@render children()}
        </main>
    {/if}
</div>