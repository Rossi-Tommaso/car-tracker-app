<script lang="ts">
    import { getDaysUntil } from '$lib/utils/dates';

    let { type, date } = $props<{ type: 'Revisione' | 'Assicurazione', date: string }>();

    let daysLeft = $derived(getDaysUntil(date));
    let isUrgent = $derived(daysLeft <= 30);
    let isExpired = $derived(daysLeft < 0);
</script>

{#if daysLeft <= 30}
    <div class="alert {isExpired ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'} p-2 rounded mb-2">
        <strong>Attenzione:</strong> {type} 
        {#if isExpired}
            scaduta da {Math.abs(daysLeft)} giorni!
        {:else}
            in scadenza tra {daysLeft} giorni.
        {/if}
    </div>
{/if}