import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "$lib/firebase/config";

export const userState = new class {
    user = $state<User | null>(null);
    loading = $state(true);

    init() {
        onAuthStateChanged(auth, (currentUser) => {
            this.user = currentUser;
            this.loading = false;
        });
    }
}