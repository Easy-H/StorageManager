
import { FirebaseAuthRepository as AuthAPI}
from "../api/FirebaseAuthRepository"

export const useAuth = () => {
    const signUp = async (email, password) => {
        await AuthAPI.signUp(email, password);
    }
    const signIn = async (email, password) => {
        await AuthAPI.signIn(email, password);
    }

    return {signUp, signIn};
}