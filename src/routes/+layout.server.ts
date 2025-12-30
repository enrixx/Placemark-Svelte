
import type {LayoutServerLoad} from './$types';

export const load: LayoutServerLoad = async ({cookies}) => {
    const sessionStr = cookies.get('placemark-session');

    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            return {
                user: session.user,
                token: session.token
            };
        } catch (e) {
            // Invalid session cookie
            cookies.delete('placemark-session', {path: '/'});
        }
    }

    return {
        user: null,
        token: null
    };
};