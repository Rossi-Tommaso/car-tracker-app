<script lang="ts">
    import { userState } from '$lib/state/auth.svelte';
    import { addCar } from '$lib/firebase/db';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';

    let years  = $state<number[]>([]);
    let makes  = $state<any[]>([]);
    let models = $state<any[]>([]);

    let formData = $state({
        year: '', brand: '', manualBrand: '',
        model: '', manualModel: '', plate: '',
        inspectionDate: '', insuranceDate: ''
    });

    let loading        = $state(false);
    let fetchingModels = $state(false);

    onMount(async () => {
        const y = new Date().getFullYear();
        for (let i = y; i >= 1990; i--) years.push(i);
        try {
            const res  = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
            const data = await res.json();
            makes = [...data.Results.sort((a: any, b: any) => a.MakeName.localeCompare(b.MakeName)), { MakeName: 'Altro' }];
        } catch (e) { console.error(e); }
    });

    $effect(() => {
        if (formData.brand && formData.brand !== 'Altro' && formData.year) {
            fetchingModels = true;
            models = [];
            fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${formData.brand}/modelyear/${formData.year}?vehicleType=car&format=json`)
                .then(r => r.json())
                .then(d => { models = [...d.Results, { Model_Name: 'Altro' }]; fetchingModels = false; })
                .catch(() => { models = [{ Model_Name: 'Altro' }]; fetchingModels = false; });
        }
    });

    async function handleSubmit(e: Event) {
        e.preventDefault();
        loading = true;
        const finalBrand = formData.brand === 'Altro' ? formData.manualBrand : formData.brand;
        const finalModel = formData.model === 'Altro' ? formData.manualModel : formData.model;
        await addCar(userState.user!.uid, { ...formData, brand: finalBrand, model: finalModel });
        goto('/');
    }
</script>

<div class="min-h-screen bg-[#f5f5f7]">

    <!-- STICKY NAVBAR -->
    <div class="sticky top-0 z-20 bg-[#f5f5f7]/80 backdrop-blur-xl border-b border-black/[.06] px-6 py-3 flex items-center justify-between">
        <a href="/" class="flex items-center gap-1.5 text-[#0071e3] text-[13px] font-medium hover:opacity-70 transition-opacity group">
            <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
            </svg>
            Garage
        </a>
        <span class="text-[13px] font-medium text-[#86868b]">Nuovo veicolo</span>
        <div class="w-16"></div>
    </div>

    <div class="max-w-xl mx-auto px-6 py-10" in:fly={{ y: 16, duration: 400 }}>

        <!-- HEADER -->
        <div class="mb-8">
            <p class="text-[11px] font-bold text-[#0071e3] uppercase tracking-[.06em] mb-2">Registrazione</p>
            <h1 class="text-[2.4rem] font-bold text-[#1d1d1f] tracking-[-0.03em] leading-tight">
                Nuovo <span class="text-[#6e6e73] font-light">veicolo</span>
            </h1>
        </div>

        <form onsubmit={handleSubmit} class="space-y-4">

            <!-- ── BLOCCO DATI VEICOLO ── -->
            <div>
                <p class="text-[11px] font-semibold text-[#86868b] uppercase tracking-[.04em] px-1 mb-2">Dati veicolo</p>
                <div class="bg-white rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,.05)] divide-y divide-black/[.05]">

                    <!-- Anno -->
                    <div class="flex items-center px-5 py-4">
                        <label class="text-[14px] font-medium text-[#1d1d1f] w-32 shrink-0">Anno</label>
                        <select
                            bind:value={formData.year}
                            class="flex-1 bg-transparent text-[14px] outline-none appearance-none text-right cursor-pointer
                                   {formData.year ? 'text-[#1d1d1f]' : 'text-[#c7c7cc]'}"
                        >
                            <option value="" disabled>Seleziona</option>
                            {#each years as y}
                                <option value={y}>{y}</option>
                            {/each}
                        </select>
                        <svg class="w-4 h-4 text-[#c7c7cc] ml-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>

                    <!-- Marca -->
                    <div class="flex items-center px-5 py-4">
                        <label class="text-[14px] font-medium text-[#1d1d1f] w-32 shrink-0">Marca</label>
                        <select
                            bind:value={formData.brand}
                            disabled={!formData.year}
                            class="flex-1 bg-transparent text-[14px] outline-none appearance-none text-right cursor-pointer
                                   {formData.brand ? 'text-[#1d1d1f]' : 'text-[#c7c7cc]'}
                                   disabled:opacity-40"
                        >
                            <option value="" disabled>Seleziona</option>
                            {#each makes as m}
                                <option value={m.MakeName}>{m.MakeName}</option>
                            {/each}
                        </select>
                        <svg class="w-4 h-4 text-[#c7c7cc] ml-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>

                    <!-- Input manuale marca -->
                    {#if formData.brand === 'Altro'}
                        <div class="px-5 py-4" in:fly={{ y: -8, duration: 250 }}>
                            <input
                                bind:value={formData.manualBrand}
                                class="w-full text-[14px] text-[#1d1d1f] outline-none bg-transparent placeholder:text-[#c7c7cc]"
                                placeholder="Inserisci marca..."
                                required
                            />
                        </div>
                    {/if}

                    <!-- Modello -->
                    <div class="flex items-center px-5 py-4">
                        <label class="text-[14px] font-medium text-[#1d1d1f] w-32 shrink-0 flex items-center gap-2">
                            Modello
                            {#if fetchingModels}
                                <span class="inline-block w-3 h-3 border-2 border-[#0071e3]/20 border-t-[#0071e3] rounded-full animate-spin"></span>
                            {/if}
                        </label>
                        <select
                            bind:value={formData.model}
                            disabled={!formData.brand || fetchingModels}
                            class="flex-1 bg-transparent text-[14px] outline-none appearance-none text-right cursor-pointer
                                   {formData.model ? 'text-[#1d1d1f]' : 'text-[#c7c7cc]'}
                                   disabled:opacity-40"
                        >
                            <option value="" disabled>{fetchingModels ? 'Caricamento…' : 'Seleziona'}</option>
                            {#each models as m}
                                <option value={m.Model_Name}>{m.Model_Name}</option>
                            {/each}
                        </select>
                        <svg class="w-4 h-4 text-[#c7c7cc] ml-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>

                    <!-- Input manuale modello -->
                    {#if formData.model === 'Altro'}
                        <div class="px-5 py-4" in:fly={{ y: -8, duration: 250 }}>
                            <input
                                bind:value={formData.manualModel}
                                class="w-full text-[14px] text-[#1d1d1f] outline-none bg-transparent placeholder:text-[#c7c7cc]"
                                placeholder="Es. Polo 9N3…"
                                required
                            />
                        </div>
                    {/if}

                    <!-- Targa -->
                    <div class="flex items-center px-5 py-4">
                        <label class="text-[14px] font-medium text-[#1d1d1f] w-32 shrink-0">Targa</label>
                        <input
                            bind:value={formData.plate}
                            class="flex-1 bg-transparent text-[14px] font-bold text-right outline-none uppercase
                                   tracking-[.15em] placeholder:text-[#c7c7cc] placeholder:font-normal placeholder:tracking-normal"
                            placeholder="AA 000 AA"
                            required
                        />
                    </div>

                </div>
            </div>

            <!-- ── BLOCCO SCADENZE ── -->
            <div>
                <p class="text-[11px] font-semibold text-[#86868b] uppercase tracking-[.04em] px-1 mb-2">Scadenze</p>
                <div class="bg-white rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,.05)] divide-y divide-black/[.05]">

                    <!-- Revisione -->
                    <div class="flex items-center px-5 py-4">
                        <label class="text-[14px] font-medium text-[#1d1d1f] w-32 shrink-0">Revisione</label>
                        <input
                            type="date"
                            bind:value={formData.inspectionDate}
                            class="flex-1 bg-transparent text-[14px] text-[#0071e3] outline-none text-right cursor-pointer [color-scheme:light]"
                            required
                        />
                    </div>

                    <!-- Assicurazione -->
                    <div class="flex items-center px-5 py-4">
                        <label class="text-[14px] font-medium text-[#1d1d1f] w-32 shrink-0">Assicurazione</label>
                        <input
                            type="date"
                            bind:value={formData.insuranceDate}
                            class="flex-1 bg-transparent text-[14px] text-[#0071e3] outline-none text-right cursor-pointer [color-scheme:light]"
                            required
                        />
                    </div>

                </div>
            </div>

            <!-- ── SUBMIT ── -->
            <button
                type="submit"
                disabled={loading}
                class="w-full py-4 rounded-[14px] text-[15px] font-semibold transition-all duration-200
                       active:scale-[0.98] disabled:opacity-50
                       bg-[#0071e3] text-white hover:bg-[#0077ed]"
            >
                {#if loading}
                    <span class="flex items-center justify-center gap-2.5">
                        <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
                            <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Salvataggio…
                    </span>
                {:else}
                    Aggiungi veicolo
                {/if}
            </button>

        </form>
    </div>
</div>