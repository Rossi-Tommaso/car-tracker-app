<script lang="ts">
    import { userState } from '$lib/state/auth.svelte';
    import { auth } from '$lib/firebase/config';
    import { signOut } from 'firebase/auth';
    import { goto } from '$app/navigation';

    async function handleLogout() {
        await signOut(auth);
        goto('/login');
    }
</script>

{#if userState.user}
<nav class="fixed top-4 left-0 w-full z-[100] px-4">
    <div class="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] px-6 py-3 flex justify-between items-center">
        <a href="/" class="flex items-center gap-2 group">
            <div class="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <span class="font-black text-xl tracking-tighter text-gray-900">CAR<span class="text-blue-600">TRACK</span></span>
        </a>

        <div class="flex items-center gap-4">
            <div class="hidden md:flex flex-col items-end">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Driver</span>
                <span class="text-xs font-bold text-gray-700">{userState.user.email?.split('@')[0]}</span>
            </div>
            <button onclick={handleLogout} class="bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 p-3 rounded-2xl transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
        </div>
    </div>
</nav>
{/if}