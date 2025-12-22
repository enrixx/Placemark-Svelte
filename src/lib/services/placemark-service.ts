import axios from "axios";

import type {User, RegisterData, Session} from "$lib/types/placemark-types";
import {loggedInUser} from "$lib/runes.svelte";

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
        const savedLoggedInUser = localStorage.getItem("placemark");
        if (savedLoggedInUser) {
            const session = JSON.parse(savedLoggedInUser);
            loggedInUser.email = session.email;
            loggedInUser.firstName = session.firstName;
            loggedInUser.lastName = session.lastName;
            loggedInUser.token = session.token;
            loggedInUser._id = session._id;
            loggedInUser.role = session.role;
            axios.defaults.headers.common["Authorization"] = "Bearer " + session.token;
        }
    },

    clearSession() {
        loggedInUser.email = "";
        loggedInUser.firstName = "";
        loggedInUser.lastName = "";
        loggedInUser.token = "";
        loggedInUser._id = "";
        loggedInUser.role = "";
        localStorage.removeItem("placemark");
    },

    async getUsers(): Promise<User[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/users`);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    async getUserById(id: string): Promise<User | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/users/${id}`);
            return response.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    async getWeather(placemarkId: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/api/placemarks/${placemarkId}/weather`);
            return response.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    async getPlacemarks() {
        try {
            const response = await axios.get(`${this.baseUrl}/api/placemarks`);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    async getPlacemarkById(id: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/api/placemarks/${id}`);
            return response.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    async getPlacemarksByUserId(userId: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/api/users/${userId}/placemarks`);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
};
