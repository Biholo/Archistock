// Correct import for jwt-decode using ES module import syntax
import { jwtDecode } from "jwt-decode";

// Define an interface for the decoded token if possible (optional)
interface DecodedToken {
    userId: string;
    exp: number;
    iat: number;
    // Add other properties if needed
}

// Define the Tools class
class Tools {
    // Method to decode the JWT
    public decodeJWT(token: string): DecodedToken | null {
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            console.log('Decoded JWT:', decoded);
            return decoded;
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    }
}

// Export the Tools class
export default Tools;
