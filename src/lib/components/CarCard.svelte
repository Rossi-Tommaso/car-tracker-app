<script lang="ts">
    import { getDaysUntil } from '$lib/utils/dates';
    import CarImage from './CarImage.svelte';

    let { car, id } = $props<{ car: any, id: string }>();
    let dInsp = $derived(getDaysUntil(car.inspectionDate));
    let dIns  = $derived(getDaysUntil(car.insuranceDate));

    function pillStyle(days: number): { bg: string; text: string } {
        if (days < 0)  return { bg: 'bg-[#fff1f0]', text: 'text-[#d70015]' };
        if (days < 15) return { bg: 'bg-[#fff8e6]', text: 'text-[#b45309]' };
        return { bg: 'bg-[#f0f8f0]', text: 'text-[#1a7f37]' };
    }

    function pillLabel(days: number): string {
        if (days < 0) return `${Math.abs(days)}g fa`;
        return `${days}g`;
    }

    let inspStyle = $derived(pillStyle(dInsp));
    let insStyle  = $derived(pillStyle(dIns));

    // Colori hero card per brand (tinte pastello)
    const brandColors: Record<string, { from: string; to: string; shape: string }> = {
        volkswagen: { from: '#e8f0fe', to: '#d4e0ff', shape: '#c2d0f8' },
        bmw:        { from: '#fff0f0', to: '#ffe4e4', shape: '#ffbcbc' },
        toyota:     { from: '#f0fff4', to: '#e4f8ea', shape: '#b0e8c0' },
        mercedes:   { from: '#f0f0f0', to: '#e4e4e4', shape: '#c8c8c8' },
        audi:       { from: '#fdf0ff', to: '#f5e0ff', shape: '#e8c8ff' },
        fiat:       { from: '#fff8e6', to: '#fef0d0', shape: '#f8d890' },
        ford:       { from: '#e6f2ff', to: '#d0e8ff', shape: '#b0d4ff' },
        renault:    { from: '#fff0e6', to: '#ffe4d0', shape: '#ffc8a0' },
    };

    let colors = $derived(() => {
        const key = car.brand?.toLowerCase() ?? '';
        return brandColors[key] ?? { from: '#f0f4ff', to: '#e8f0fe', shape: '#c2d0f8' };
    });
</script>

<a
    href="/car/{id}"
    class="group block bg-white rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,.06),0_1px_3px_rgba(0,0,0,.04)]
           transition-all duration-300 ease-[cubic-bezier(.34,1.2,.64,1)]
           hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_8px_32px_rgba(0,0,0,.10),0_2px_8px_rgba(0,0,0,.06)]
           active:scale-[0.98]"
>
    <!-- IMMAGINE -->
    <div
        class="relative h-[110px] overflow-hidden"
        style="background: linear-gradient(135deg, {colors().from} 0%, {colors().to} 100%)"
    >
        <CarImage brand={car.brand} model={car.model} />

        <!-- Targa -->
        <div class="absolute bottom-2.5 left-3 bg-white rounded-[8px] px-2.5 py-1 shadow-sm">
            <span class="text-[9px] font-bold text-[#1d1d1f] tracking-[.12em] uppercase">{car.plate}</span>
        </div>

        <!-- GPS pill -->
        {#if car.lastParked}
            <div class="absolute top-2.5 right-3 flex items-center gap-1.5 bg-[#0071e3]/10 rounded-full px-2.5 py-1">
                <span class="w-[5px] h-[5px] rounded-full bg-[#0071e3] animate-pulse"></span>
                <span class="text-[9px] font-bold text-[#0071e3] tracking-[.05em]">Live</span>
            </div>
        {/if}
    </div>

    <!-- BODY -->
    <div class="px-4 pt-3 pb-2">
        <p class="text-[10px] font-bold text-[#0071e3] uppercase tracking-[.05em] mb-0.5">{car.brand}</p>
        <h3 class="text-[19px] font-bold text-[#1d1d1f] tracking-[-0.02em] leading-tight mb-3">{car.model}</h3>

        <!-- Pills scadenze -->
        <div class="grid grid-cols-2 gap-2">
            <div class="rounded-[10px] px-3 py-2 {inspStyle.bg}">
                <p class="text-[8px] font-bold text-[#86868b] uppercase tracking-[.06em] mb-1">Revisione</p>
                <p class="text-[14px] font-bold tracking-[-0.02em] {inspStyle.text}">{pillLabel(dInsp)}</p>
            </div>
            <div class="rounded-[10px] px-3 py-2 {insStyle.bg}">
                <p class="text-[8px] font-bold text-[#86868b] uppercase tracking-[.06em] mb-1">Assic.</p>
                <p class="text-[14px] font-bold tracking-[-0.02em] {insStyle.text}">{pillLabel(dIns)}</p>
            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <div class="flex items-center justify-between px-4 py-3 border-t border-black/[.05] mt-1">
        <span class="text-[11px] text-[#86868b] font-medium">Vedi dettagli</span>
        <svg
            class="w-[14px] h-[14px] text-[#c7c7cc] group-hover:text-[#0071e3] group-hover:translate-x-0.5 transition-all duration-200"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
            <path d="M9 5l7 7-7 7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
</a>