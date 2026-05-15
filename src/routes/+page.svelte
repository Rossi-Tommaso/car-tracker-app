<script lang="ts">
    import { db } from '$lib/firebase/config';
    import { collection, query, where, onSnapshot } from 'firebase/firestore';
    import { userState } from '$lib/state/auth.svelte';
    import CarCard from '$lib/components/CarCard.svelte';
    import Loader from '$lib/components/Loader.svelte';
    import { fade, fly } from 'svelte/transition';

    let cars = $state<any[]>([]);
    let loading = $state(true);

    $effect(() => {
        if (!userState.user) return;
        const q = query(collection(db, 'cars'), where('ownerIds', 'array-contains', userState.user.uid));
        return onSnapshot(q, (s) => {
            cars = s.docs.map(d => ({ id: d.id, ...d.data() }));
            loading = false;
        });
    });
</script>

<div class="min-h-screen bg-[#f5f5f7]">
    {#if loading}
        <div class="fixed inset-0 z-[200] flex items-center justify-center bg-[#f5f5f7]">
            <Loader />
        </div>
    {:else}
        <div class="max-w-5xl mx-auto px-6 pt-10 pb-28">

            <!-- TOPBAR -->
            <div class="flex items-center justify-between mb-10" in:fade={{ duration: 400 }}>
                <p class="text-[11px] font-semibold text-[#6e6e73] uppercase tracking-[.06em]">Il mio garage</p>
                <a
                    href="/car/new"
                    class="flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#005bbf] text-white text-[13px] font-semibold px-5 py-2 rounded-full transition-all duration-200 active:scale-95"
                >
                    <span class="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold leading-none">+</span>
                    Aggiungi
                </a>
            </div>

            <!-- HERO -->
            <div class="mb-8" in:fly={{ y: 16, duration: 500, delay: 50 }}>
                <p class="text-[11px] font-bold text-[#0071e3] uppercase tracking-[.06em] mb-2">Garage Overview</p>
                <h1 class="text-[clamp(2.8rem,6vw,4rem)] font-bold text-[#1d1d1f] leading-[1.05] tracking-[-0.03em]">
                    I miei <span class="text-[#6e6e73] font-light">veicoli</span>
                </h1>
            </div>

            <div class="h-px bg-black/[.07] mb-8"></div>

            {#if cars.length === 0}
                <!-- EMPTY STATE -->
                <div
                    class="flex flex-col items-center justify-center py-28 bg-white rounded-[24px] shadow-sm gap-5"
                    in:fade={{ duration: 400, delay: 200 }}
                >
                    <div class="w-16 h-16 rounded-full bg-[#f0f4ff] flex items-center justify-center">
                        <svg class="w-7 h-7 text-[#0071e3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4v16m8-8H4" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="text-center">
                        <p class="text-[15px] font-semibold text-[#1d1d1f] mb-1">Nessun veicolo</p>
                        <p class="text-[13px] text-[#6e6e73]">Aggiungi il tuo primo veicolo per iniziare</p>
                    </div>
                    <a
                        href="/car/new"
                        class="bg-[#0071e3] text-white text-[13px] font-semibold px-6 py-2.5 rounded-full hover:bg-[#0077ed] transition-colors"
                    >
                        Aggiungi veicolo
                    </a>
                </div>
            {:else}
                <!-- STATS -->
                <div class="flex items-center gap-6 mb-8" in:fade={{ duration: 400, delay: 100 }}>
                    <div>
                        <p class="text-[11px] text-[#86868b] font-medium mb-0.5">Totale veicoli</p>
                        <p class="text-[28px] font-bold text-[#1d1d1f] leading-none tracking-tight">{cars.length}</p>
                    </div>
                    <div class="w-px h-9 bg-black/[.08]"></div>
                    <div>
                        <p class="text-[11px] text-[#86868b] font-medium mb-0.5">Con posizione GPS</p>
                        <p class="text-[28px] font-bold text-[#1d1d1f] leading-none tracking-tight">{cars.filter(c => c.lastParked).length}</p>
                    </div>
                    <div class="w-px h-9 bg-black/[.08]"></div>
                    <div>
                        <p class="text-[11px] text-[#86868b] font-medium mb-0.5">Scadenze urgenti</p>
                        <p class="text-[28px] font-bold leading-none tracking-tight {cars.filter(c => {
                            const d1 = Math.round((new Date(c.inspectionDate).getTime() - Date.now()) / 86400000);
                            const d2 = Math.round((new Date(c.insuranceDate).getTime() - Date.now()) / 86400000);
                            return d1 < 15 || d2 < 15;
                        }).length > 0 ? 'text-[#d70015]' : 'text-[#1d1d1f]'}">
                            {cars.filter(c => {
                                const d1 = Math.round((new Date(c.inspectionDate).getTime() - Date.now()) / 86400000);
                                const d2 = Math.round((new Date(c.insuranceDate).getTime() - Date.now()) / 86400000);
                                return d1 < 15 || d2 < 15;
                            }).length}
                        </p>
                    </div>
                </div>

                <!-- GRID -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {#each cars as car, i (car.id)}
                        <div in:fly={{ y: 24, duration: 500, delay: 80 + i * 80 }}>
                            <CarCard {car} id={car.id} />
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</div>