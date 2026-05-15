<div class="flex flex-col items-center justify-center">
    <div class="relative w-24 h-24">
        <div class="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
        <div class="absolute inset-4 border-2 border-blue-400/20 rounded-full"></div>
        <div class="absolute inset-[45%] bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)] animate-pulse"></div>
    </div>
    <span class="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">System Boot</span>
</div>

<style>
    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-spin { animation: spin 1.5s linear infinite; }
</style>