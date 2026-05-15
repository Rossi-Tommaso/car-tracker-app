<script lang="ts">
    let { brand, model } = $props<{ brand: string, model: string }>();
    
    // Pulizia stringhe per API Imagin.studio
    function cleanString(str: string) {
        return str.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Rimuove accenti (ë -> e)
            .replace(/[^a-z0-9]/g, "-")      // Sostituisce tutto ciò che non è alfanumerico con trattino
            .replace(/-+/g, "-")             // Rimuove trattini doppi
            .replace(/^-|-$/g, "");          // Rimuove trattini all'inizio o fine
    }

    let cleanBrand = $derived(cleanString(brand));
    let cleanModel = $derived(cleanString(model));
    
    let imageUrl = $derived(`https://cdn.imagin.studio/getimage?customer=img&make=${cleanBrand}&modelFamily=${cleanModel}&zoomType=fullscreen&width=800`);

    function handleImageError(e: Event) {
        const target = e.currentTarget as HTMLImageElement;
        // Se il render 3D fallisce, usiamo un'immagine segnaposto generica ed elegante
        target.src = `https://via.placeholder.com/800x450/f3f4f6/94a3b8?text=${brand}+${model}`;
    }
</script>

<div class="w-full aspect-[16/9] bg-gray-100 rounded-[2rem] overflow-hidden relative shadow-inner border border-gray-100">
    <img 
        src={imageUrl} 
        alt="{brand} {model}" 
        class="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 hover:scale-105"
        onerror={handleImageError}
    />
</div>