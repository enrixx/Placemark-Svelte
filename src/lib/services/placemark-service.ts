import axios, {type AxiosError} from "axios";
import {PUBLIC_SERVICE_URL} from '$env/static/public';
import type {User, RegisterData, Session, Placemark} from "$lib/types/placemark-types";
import {loggedInUser, setApiError} from "$lib/runes.svelte";

// Helper function to clear session (used by interceptor and service)
function clearSessionData() {
    loggedInUser.email = "";
    loggedInUser.firstName = "";
    loggedInUser.lastName = "";
    loggedInUser.token = "";
    loggedInUser._id = "";
    loggedInUser.role = "";
    loggedInUser.isOAuth = false;
    if (typeof window !== 'undefined') {
        localStorage.removeItem("placemark");
    }
    delete axios.defaults.headers.common["Authorization"];
}

export const placemarkService = {
    baseUrl: PUBLIC_SERVICE_URL,

    getAxiosConfig(token?: string) {
        if (token) {
            return {headers: {Authorization: `Bearer ${token}`}};
        }
        return {};
    },

    async signup(user: RegisterData): Promise<boolean> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/users`, user);
            return response.data !== null;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    },

    async login(email: string, password: string): Promise<Session | null> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, {
                email,
                password
            });

            if (response.data.success) {
                if (typeof window !== 'undefined') {
                    axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
                }
                const payload = JSON.parse(atob(response.data.token.split('.')[1]));
                const session: Session = {
                    token: response.data.token,
                    user: {
                        _id: payload.id,
                        email: payload.email,
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                        role: payload.role,
                        isOAuth: payload.isOAuth
                    }
                };
                return session;
            }
            return null;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    },

    async loginGitHub(email: string, firstName: string, lastName: string): Promise<Session | null> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/users/oauth`, {
                email,
                firstName,
                lastName
            });

            if (response.data.success) {
                if (typeof window !== 'undefined') {
                    axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
                }
                const payload = JSON.parse(atob(response.data.token.split('.')[1]));
                const session: Session = {
                    token: response.data.token,
                    user: {
                        _id: payload.id,
                        email: payload.email,
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                        role: payload.role,
                        isOAuth: payload.isOAuth
                    }
                };
                return session;
            }
            return null;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    },

    async logout() {
        this.clearSession();
    },

    clearSession() {
        if (typeof window !== 'undefined') {
            clearSessionData();
        }
    },

    async getUsers(token?: string): Promise<User[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/users`, this.getAxiosConfig(token));
            return response.data;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    },

    async getUserById(id: string, token?: string): Promise<User | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/users/${id}`, this.getAxiosConfig(token));
            return response.data;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    },

    async getWeather(placemarkId: string, token?: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/api/placemarks/${placemarkId}/weather`, this.getAxiosConfig(token));
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    },

    async getPlacemarks(token?: string): Promise<Placemark[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/placemarks`, this.getAxiosConfig(token));
            return response.data;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    },

    async getPlacemarkById(id: string, token?: string) : Promise<Placemark | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/placemarks/${id}`, this.getAxiosConfig(token));
            return response.data;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    },

    async getPlacemarksByUserId(userId: string, token?: string): Promise<Placemark[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/users/${userId}/placemarks`, this.getAxiosConfig(token));
            return response.data;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    },

    async uploadImage(placemarkId: string, imageFile: File, token?: string) {
        try {
            const formData = new FormData();
            formData.append("imagefile", imageFile);

            const config = this.getAxiosConfig(token);

            const response = await axios.post(
                `${this.baseUrl}/api/placemarks/${placemarkId}/images`,
                formData,
                config
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    },

    async deleteImage(placemarkId: string, imageId: string, token?: string) {
        try {
            const response = await axios.delete(
                `${this.baseUrl}/api/placemarks/${placemarkId}/images/${imageId}`,
                this.getAxiosConfig(token)
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    },

    async createPlacemark(placemark: Placemark, token?: string): Promise<Placemark | null> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/placemarks`, placemark, this.getAxiosConfig(token));
            return response.data;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    },

    async deletePlacemark(id: string, token?: string): Promise<boolean> {
        try {
            const response = await axios.delete(`${this.baseUrl}/api/placemarks/${id}`, this.getAxiosConfig(token));
            return response.status === 204 || response.status === 200;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    },

    async updatePlacemark(id: string, placemark: Placemark, token?: string) : Promise<Placemark | null> {
        try {
            const response = await axios.put(`${this.baseUrl}/api/placemarks/${id}`, placemark, this.getAxiosConfig(token));
            return response.data;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    },

    async updateUser(userId: string, updates: {
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string
    }, token?: string) : Promise<User | null> {
        try {
            const response = await axios.put(`${this.baseUrl}/api/users/${userId}`, updates, this.getAxiosConfig(token));
            if (response.data && typeof window !== 'undefined') {
                // Update the session with new data (but keep the token)
                const currentToken = loggedInUser.token;
                loggedInUser.email = response.data.email;
                loggedInUser.firstName = response.data.firstName;
                loggedInUser.lastName = response.data.lastName;
                loggedInUser._id = response.data._id;
                loggedInUser.role = response.data.role;
                loggedInUser.token = currentToken;
                localStorage.setItem("placemark", JSON.stringify(loggedInUser));
            }
            return response.data;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    },

    handleError(error: any) {
        const e = error as AxiosError;
        const status = e.response?.status;

        let message = 'An unexpected error occurred. Please try again.';

        switch (status) {
            case 400:
                if (e.response?.data && (e.response.data as any).message) {
                    message = (e.response.data as any).message;
                } else {
                    message = 'Invalid request. Please check your input.';
                }
                break;
            case 401:
                // Only clear session data if we're in the browser
                if (typeof window !== 'undefined') {
                    clearSessionData();
                    window.location.href = "/login";
                }
                // On server, just log and let the caller handle it
                message = 'Authentication failed. Please log in again.';
                break;
            case 403:
                message = 'You do not have permission to perform this action.';
                break;
            case 404:
                message = 'The requested resource was not found.';
                break;
            case 500:
                message = 'Server error. Please try again later.';
                break;
            case 503:
                message = 'Service temporarily unavailable. Please try again later.';
                break;
            default:
                if (e.response?.data && typeof e.response.data === 'object') {
                    const data = e.response.data as any;
                    message = data.message || data.error || message;
                } else if (!e.response) {
                    message = 'Unable to connect to server. Please check your connection.';
                }
        }

        // Only set API error in browser context
        if (typeof window !== 'undefined') {
            setApiError(message, status || 0);
        } else {
            // On server, throw so the caller can handle it
            const err = new Error(message) as any;
            err.statusCode = status || 0;
            err.originalError = error;
            throw err;
        }
    }
};
