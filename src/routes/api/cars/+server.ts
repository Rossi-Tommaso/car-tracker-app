import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
    const cmd = url.searchParams.get('cmd');
    const year = url.searchParams.get('year');
    const make = url.searchParams.get('make');

    // Usiamo HTTP invece di HTTPS se HTTPS fallisce, CarQuery è instabile con SSL
    const remoteUrl = `http://www.carqueryapi.com/api/0.3/?cmd=${cmd}${year ? `&year=${year}` : ''}${make ? `&make=${make}` : ''}`;

    console.log(`🌐 Proxy calling: ${remoteUrl}`);

    // Prepariamo un timeout di 10 secondi
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(remoteUrl, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*'
            }
        });

        clearTimeout(timeout);

        const text = await response.text();
        
        // Pulizia JSONP estrema
        let cleanJson = text.trim();
        // Rimuove qualsiasi cosa prima della prima parentesi graffa e dopo l'ultima
        const firstBracket = cleanJson.indexOf('{');
        const lastBracket = cleanJson.lastIndexOf('}');
        
        if (firstBracket !== -1 && lastBracket !== -1) {
            cleanJson = cleanJson.substring(firstBracket, lastBracket + 1);
        }

        const data = JSON.parse(cleanJson);
        return json(data);

    } catch (error: any) {
        clearTimeout(timeout);
        console.error("❌ Errore critico nel Proxy:", error.message);
        
        // Se CarQueryAPI è giù, restituiamo un errore che il front-end può gestire
        return json({ 
            error: 'Servizio CarQuery momentaneamente non raggiungibile', 
            details: error.message 
        }, { status: 502 });
    }
};