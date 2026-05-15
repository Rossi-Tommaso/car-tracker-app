<script lang="ts">
    import { db } from '$lib/firebase/config';
    import { doc, updateDoc } from 'firebase/firestore';
    import { slide } from 'svelte/transition';

    // TS sa esattamente cosa aspettarsi
    let { car, carId } = $props<{ car: any, carId: string }>();

    // Inizializzazione SUPER SICURA: se car o specs non esistono, mette stringhe vuote
    let specs = $state({
        oil: car?.specs?.oil || '',
        tireFront: car?.specs?.tireFront || '',
        tireRear: car?.specs?.tireRear || '',
        battery: car?.specs?.battery || ''
    });

    let isEditing = $state(false);
    let saving = $state(false);

    // Deep link sicuro (evita i null)
    let manualSearchUrl = $derived(
        `https://www.google.com/search?q=manuale+uso+manutenzione+pdf+${car?.brand || ''}+${car?.model || ''}`
    );

    async function saveSpecs() {
        saving = true;
        try {
            const carRef = doc(db, 'cars', carId);
            // Salva solo l'oggetto specs dentro il documento dell'auto
            await updateDoc(carRef, { specs: specs });
            // Aggiorna l'oggetto locale per reattività
            car.specs = specs; 
            isEditing = false;
        } catch (e) {
            console.error("Errore salvataggio:", e);
            alert("Errore durante il salvataggio dei dati.");
        } finally {
            saving = false;
        }
    }
</script>

<div class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
    <div class="flex justify-between items-center mb-6">
        <div>
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1">Dati Tecnici</h3>
            <h4 class="text-lg font-black text-gray-900 tracking-tight">{car?.brand || 'Auto'} {car?.model || ''}</h4>
        </div>
        <button 
            onclick={() => isEditing ? saveSpecs() : isEditing = true}
            disabled={saving}
            class="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all {isEditing ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}"
        >
            {saving ? '...' : isEditing ? 'Salva' : 'Modifica'}
        </button>
    </div>

    {#if isEditing}
        <div transition:slide class="grid grid-cols-2 gap-3 mb-6">
            <div class="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <label class="text-[9px] font-black uppercase text-gray-400 block mb-1">Olio Motore</label>
                <input bind:value={specs.oil} placeholder="Es. 5W-30" class="w-full bg-transparent text-sm font-bold outline-none text-gray-800" />
            </div>
            <div class="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <label class="text-[9px] font-black uppercase text-gray-400 block mb-1">Batteria</label>
                <input bind:value={specs.battery} placeholder="Es. 12V 60Ah" class="w-full bg-transparent text-sm font-bold outline-none text-gray-800" />
            </div>
            <div class="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <label class="text-[9px] font-black uppercase text-gray-400 block mb-1">Press. Ant.</label>
                <input bind:value={specs.tireFront} placeholder="Es. 2.2 bar" class="w-full bg-transparent text-sm font-bold outline-none text-gray-800" />
            </div>
            <div class="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <label class="text-[9px] font-black uppercase text-gray-400 block mb-1">Press. Post.</label>
                <input bind:value={specs.tireRear} placeholder="Es. 2.0 bar" class="w-full bg-transparent text-sm font-bold outline-none text-gray-800" />
            </div>
        </div>
    {:else}
        <div transition:slide class="grid grid-cols-2 gap-3 mb-6">
            <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span class="text-[9px] font-black uppercase text-gray-400 block mb-1">Olio Motore</span>
                <span class="font-bold text-gray-800 text-sm">{specs.oil || '- - -'}</span>
            </div>
            <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span class="text-[9px] font-black uppercase text-gray-400 block mb-1">Batteria</span>
                <span class="font-bold text-gray-800 text-sm">{specs.battery || '- - -'}</span>
            </div>
            <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 col-span-2 flex items-center justify-between">
                <div>
                    <span class="text-[9px] font-black uppercase text-gray-400 block mb-1">Pressione Gomme (Ant / Post)</span>
                    <span class="font-bold text-gray-800 text-sm">
                        {specs.tireFront || '-'} / {specs.tireRear || '-'}
                    </span>
                </div>
                <span class="text-xl">⭕</span>
            </div>
        </div>
    {/if}

    <a 
        href={manualSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-between w-full p-4 bg-blue-50/50 rounded-2xl border border-blue-100 hover:bg-blue-50 transition-colors group"
    >
        <div class="flex items-center gap-3">
            <span class="text-xl">📖</span>
            <div>
                <span class="block text-[9px] font-black uppercase text-blue-600 tracking-widest mb-0.5">Ricerca Web</span>
                <span class="block text-xs font-bold text-gray-800">Trova Libretto Ufficiale</span>
            </div>
        </div>
        <svg class="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
    </a>
</div>