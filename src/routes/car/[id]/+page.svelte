<script lang="ts">
    import { page } from '$app/stores';
    import { db } from '$lib/firebase/config';
    import { doc, getDoc, updateDoc } from 'firebase/firestore';
    import { userState } from '$lib/state/auth.svelte';
    import { deleteCar } from '$lib/firebase/db';
    import { goto } from '$app/navigation';
    
    import MapLinks from '$lib/components/MapLinks.svelte';
    import CarImage from '$lib/components/CarImage.svelte';
    import InteractiveMap from '$lib/components/InteractiveMap.svelte';
    import SpecificManual from '$lib/components/SpecificManual.svelte';

    let carId = $derived($page.params.id);
    let car = $state<any>(null);
    let loading = $state(true);
    let savingLocation = $state(false);

    $effect(() => {
        if (!userState.user || !carId) return;
        fetchCar();
    });

    async function fetchCar() {
        if (!carId) return;
        try {
            const docRef = doc(db, 'cars', carId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                car = docSnap.data();
            } else {
                goto('/');
            }
        } catch (e) {
            console.error("Errore fetch:", e);
        } finally {
            loading = false;
        }
    }

    async function handleParkHere() {
        if (!carId || !navigator.geolocation || !userState.user) return;
        savingLocation = true;

        const successCallback = async (pos: GeolocationPosition) => {
            const lastParked = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                timestamp: new Date().toISOString()
            };
            try {
                const carRef = doc(db, 'cars', carId as string);
                await updateDoc(carRef, { lastParked });
                if (car) car.lastParked = lastParked;
            } catch (err) {
                console.error(err);
            } finally {
                savingLocation = false;
            }
        };

        const errorCallback = () => { savingLocation = false; alert("Errore GPS"); };
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { enableHighAccuracy: true });
    }

    async function confirmDelete() {
        if (!carId) return;
        if (confirm("Eliminare questo veicolo?")) {
            await deleteCar(carId);
            goto('/');
        }
    }
</script>

<div class="max-w-2xl mx-auto p-6 pb-24">
    {#if loading}
        <!-- Loader Skeleton -->
        <div class="h-64 bg-white/50 animate-pulse rounded-[2.5rem] border border-gray-100"></div>
    
    {:else if car && carId}
        <!-- DA QUI IN POI CAR E CARID SONO SICURI AL 100% -->
        
        <!-- Header -->
        <header class="flex justify-between items-center mb-8">
            <a href="/" class="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all" aria-label="Indietro">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </a>
            <button onclick={confirmDelete} class="text-[10px] font-black uppercase text-red-400 tracking-widest hover:text-red-600 transition-colors">
                Elimina Veicolo
            </button>
        </header>

        <!-- Immagine -->
        <CarImage brand={car.brand} model={car.model} />

        <!-- Info Card Principale -->
        <div class="mt-8 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div class="mb-6">
                <h1 class="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">
                    {car.brand} <br/>
                    <span class="text-blue-600">{car.model}</span>
                </h1>
                <div class="inline-block bg-gray-900 text-white px-4 py-1.5 rounded-xl font-mono text-sm tracking-[0.2em] uppercase">
                    {car.plate}
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 border-t border-gray-50 pt-8">
                <div class="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                    <span class="text-[10px] font-black uppercase text-gray-400 block mb-1">Revisione</span>
                    <span class="font-bold text-gray-800">{new Date(car.inspectionDate).toLocaleDateString('it-IT')}</span>
                </div>
                <div class="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                    <span class="text-[10px] font-black uppercase text-gray-400 block mb-1">Assicurazione</span>
                    <span class="font-bold text-gray-800">{new Date(car.insuranceDate).toLocaleDateString('it-IT')}</span>
                </div>
            </div>
        </div>

        <!-- COMPONENTE MANUALE SPECIFICO -->
        <div class="mt-6">
            <!-- Il ! assicura TS che carId è una stringa, e lo è perché controllato nell'{#if} -->
            <SpecificManual {car} carId={carId!} />
        </div>

        <!-- Mappa e Posizione -->
        <div class="mt-6 bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-200">
            <h3 class="text-2xl font-black text-white tracking-tight mb-6 flex items-center gap-2">
                📍 Posizione GPS
            </h3>
            
            {#if car.lastParked}
                <div class="space-y-6 mb-8">
                    <InteractiveMap lat={car.lastParked.lat} lng={car.lastParked.lng} label="{car.brand} {car.model}" />
                    <MapLinks lat={car.lastParked.lat} lng={car.lastParked.lng} />
                    <p class="text-[10px] text-blue-100 text-center font-bold tracking-widest opacity-60 uppercase">
                        Aggiornato: {new Date(car.lastParked.timestamp).toLocaleString('it-IT')}
                    </p>
                </div>
            {/if}

            <button 
                onclick={handleParkHere}
                disabled={savingLocation}
                class="w-full bg-white text-blue-600 font-black py-5 rounded-[2rem] shadow-xl active:scale-95 transition-all disabled:opacity-50 hover:bg-blue-50"
            >
                {savingLocation ? 'RICERCA SATELLITI...' : 'SEGNA PARCHEGGIO'}
            </button>
        </div>
    {/if}
</div>