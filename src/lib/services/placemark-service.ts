import axios, {type AxiosError} from "axios";

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
    localStorage.removeItem("placemark");
    delete axios.defaults.headers.common["Authorization"];
}

export const placemarkService = {
    baseUrl: "http://localhost:3000", // ToDo: move it to env

    async signup(user: RegisterData): Promise<boolean> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/users`, user);
            return response.data !== null;
        } catch (error) {
            console.log(error);
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
                axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
                const payload = JSON.parse(atob(response.data.token.split('.')[1]));
                const session: Session = {
                    user: {
                        email: payload.email,
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                        role: payload.role,
                        _id: payload.id
                    },
                    token: response.data.token,
                };
                this.saveSession(session);
                return session;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    saveSession(session: Session) {
        loggedInUser.email = session.user.email;
        loggedInUser.firstName = session.user.firstName;
        loggedInUser.lastName = session.user.lastName;
        loggedInUser.token = session.token;
        loggedInUser._id = session.user._id;
        loggedInUser.role = session.user.role;
        localStorage.setItem("placemark", JSON.stringify(loggedInUser));
    },

    async restoreSession() {
        try {
            const savedLoggedInUser = localStorage.getItem("placemark");
            if (!savedLoggedInUser) {
                return;
            }

            const session = JSON.parse(savedLoggedInUser);
            if (!session.token) {
                return;
            }

            // Check if token is expired (time-based check)
            const payload = JSON.parse(atob(session.token.split('.')[1]));
            const exp = payload.exp;
            const now = Math.floor(Date.now() / 1000);

            if (exp && exp < now) {
                console.warn('Token expired - redirecting to login');
                this.clearSession();
                if (typeof window !== 'undefined') {
                    window.location.href = "/login";
                }
                return;
            }

            // Restore session data
            loggedInUser.email = session.email;
            loggedInUser.firstName = session.firstName;
            loggedInUser.lastName = session.lastName;
            loggedInUser.token = session.token;
            loggedInUser._id = session._id;
            loggedInUser.role = session.role;
            axios.defaults.headers.common["Authorization"] = "Bearer " + session.token;
        } catch (error) {
            console.error("Error restoring session:", error);
            this.clearSession();
        }
    },

    clearSession() {
        clearSessionData();
    },

    async getUsers(): Promise<User[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/users`);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    },

    async getUserById(id: string): Promise<User | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/users/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    },

    async getWeather(placemarkId: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/api/placemarks/${placemarkId}/weather`);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    },

    async getPlacemarks() {
        try {
            const response = await axios.get(`${this.baseUrl}/api/placemarks`);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    },

    async getPlacemarkById(id: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/api/placemarks/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    },

    async getPlacemarksByUserId(userId: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/api/users/${userId}/placemarks`);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    },

    async uploadImage(placemarkId: string, imageFile: File) {
        try {
            const formData = new FormData();
            formData.append("imagefile", imageFile);

            const response = await axios.post(
                `${this.baseUrl}/api/placemarks/${placemarkId}/images`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    },

    async deleteImage(placemarkId: string, imageId: string) {
        try {
            const response = await axios.delete(
                `${this.baseUrl}/api/placemarks/${placemarkId}/images/${imageId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting image:', error);
            this.handleError(error);
            return null;
        }
    },

    async createPlacemark(placemark: Placemark) {
        try {
            const response = await axios.post(`${this.baseUrl}/api/placemarks`, placemark);
            return response.data;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    },

    async deletePlacemark(id: string) {
        try {
            const response = await axios.delete(`${this.baseUrl}/api/placemarks/${id}`);
            console.log('deletePlacemark response:', response);
            return response.status === 204 || response.status === 200;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    },

    async updatePlacemark(id: string, placemark: Placemark) {
        try {
            const response = await axios.put(`${this.baseUrl}/api/placemarks/${id}`, placemark);
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
                    console.log(message);
                } else {
                    message = 'Invalid request. Please check your input.';
                }
                break;
            case 401:
                clearSessionData();
                if (typeof window !== 'undefined') {
                    window.location.href = "/login";
                }
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

        setApiError(message, status || 0);
    }
};
