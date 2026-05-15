<script lang="ts">
    import { auth } from '$lib/firebase/config';
    import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
    import { goto } from '$app/navigation';

    let email = $state('');
    let password = $state('');
    let error = $state('');
    let isRegistering = $state(false);

    async function handleSubmit(e: Event) {
        e.preventDefault();
        error = '';
        
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            goto('/'); // Torna alla dashboard dopo il login
        } catch (e: any) {
            error = "Errore: " + e.message;
        }
    }
</script>

<div class="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg border">
    <h1 class="text-2xl font-bold mb-6 text-center">
        {isRegistering ? 'Registrati' : 'Accedi'}
    </h1>

    <form onsubmit={handleSubmit} class="flex flex-col gap-4">
        <input 
            type="email" 
            bind:value={email} 
            placeholder="Email" 
            class="p-2 border rounded"
            required 
        />
        <input 
            type="password" 
            bind:value={password} 
            placeholder="Password" 
            class="p-2 border rounded"
            required 
        />
        
        <button type="submit" class="bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700">
            {isRegistering ? 'Crea Account' : 'Entra'}
        </button>
    </form>

    {#if error}
        <p class="text-red-500 text-sm mt-4">{error}</p>
    {/if}

    <button 
        onclick={() => isRegistering = !isRegistering} 
        class="text-sm text-gray-500 mt-6 w-full text-center underline">
        {isRegistering ? 'Hai già un account? Accedi' : 'Nuovo utente? Registrati'}
    </button>
</div>