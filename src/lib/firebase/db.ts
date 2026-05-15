import { db } from './config';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, type DocumentData, deleteDoc, doc } from 'firebase/firestore';


// Crea una nuova auto (il creatore è il primo nell'array ownerIds)
export async function addCar(userId: string, carData: any) {
    try {
        const colRef = collection(db, 'cars');
        const docRef = await addDoc(colRef, {
            ...carData,
            ownerIds: [userId], // Inizializza l'array con il creatore
            createdAt: serverTimestamp(),
            lastParked: null
        });
        return docRef.id;
    } catch (error) {
        console.error("Errore addCar:", error);
        throw error;
    }
}

// Funzione per invitare un altro utente (Aggiunge UID all'array)
// Nota: In un'app reale servirebbe una Cloud Function, 
// qui assumiamo di avere l'UID dell'altro utente.
export async function shareCar(carId: string, newUserId: string) {
    const { arrayUnion, doc, updateDoc } = await import('firebase/firestore');
    const carRef = doc(db, 'cars', carId);
    await updateDoc(carRef, {
        ownerIds: arrayUnion(newUserId)
    });
}

/**
 * Elimina un'auto dal database.
 * @param carId - L'ID del documento dell'auto
 */
export async function deleteCar(carId: string) {
    try {
        const carRef = doc(db, 'cars', carId);
        await deleteDoc(carRef);
    } catch (error) {
        console.error("Errore durante l'eliminazione dell'auto:", error);
        throw error;
    }
}
