<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    let { lat, lng, label = "Veicolo" } = $props<{ lat: number, lng: number, label?: string }>();
    let mapElement = $state<HTMLElement>();
    let map: any;
    onMount(async () => {
        if (browser) {
            const L = await import('leaflet');
            import('leaflet/dist/leaflet.css');
            if (mapElement) {
                map = L.map(mapElement, { zoomControl: false }).setView([lat, lng], 17);
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
                const customIcon = L.divIcon({
                    html: `<div class="flex flex-col items-center">
                            <div class="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/50 mb-2 transform -translate-y-1">
                                <span class="text-[11px] font-black text-gray-800 uppercase tracking-tighter">${label}</span>
                                <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 rotate-45 border-r border-b border-white/50"></div>
                            </div>
                            <div class="relative flex h-5 w-5 items-center justify-center">
                                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-40"></span>
                                <span class="relative inline-flex h-3 w-3 rounded-full bg-blue-600 border-2 border-white shadow-sm"></span>
                            </div>
                        </div>`,
                    className: '', iconSize: [120, 80], iconAnchor: [60, 65] 
                });
                L.marker([lat, lng], { icon: customIcon }).addTo(map);
            }
        }
    });
    onDestroy(() => { if (map) map.remove(); });
</script>
<div bind:this={mapElement} class="w-full h-80 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-4 border-white z-0"></div>