<script lang="ts">
    import googleMapsLogo from '$lib/assets/google_maps_logo.png';
    import appleMapsLogo from '$lib/assets/Apple_Maps_logo.png'
    
    let { lat, lng } = $props<{ lat: number, lng: number }>();

    let googleUrl = $derived(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
    let appleUrl = $derived(`https://maps.apple.com/?q=${lat},${lng}`);
</script>

<div class="flex flex-col gap-4 w-full">
    <p class="text-[11px] font-black uppercase text-blue-200 tracking-[0.2em] text-center mb-1 opacity-80">
        Apri navigatore
    </p>
    
    <div class="grid grid-cols-2 gap-4">
        <!-- Google Maps -->
        <a 
            href={googleUrl} 
            target="_blank" 
            class="flex flex-col items-center justify-center gap-4 bg-white/10 hover:bg-white/20 p-6 rounded-[2.5rem] transition-all border border-white/10 active:scale-95 shadow-xl shadow-black/20"
        >
            <div class="w-14 h-14 flex items-center justify-center">
                <img 
                    src={googleMapsLogo} 
                    alt="Gmaps" 
                    class="max-w-full max-h-full object-contain drop-shadow-md" 
                />
            </div>
        </a>

        <!-- Apple Maps -->
        <a 
            href={appleUrl} 
            target="_blank" 
            class="flex flex-col items-center justify-center gap-4 bg-white/10 hover:bg-white/20 p-6 rounded-[2.5rem] transition-all border border-white/10 active:scale-95 shadow-xl shadow-black/20"
        >
            <div class="w-14 h-14 flex items-center justify-center">
                <img 
                    src={appleMapsLogo} 
                    alt="Apple" 
                    class="max-w-full max-h-full object-contain drop-shadow-md" 
                />
            </div>
        </a>
    </div>
</div>