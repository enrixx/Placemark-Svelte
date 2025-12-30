import {redirect} from '@sveltejs/kit';
import {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} from '$env/dynamic/private';
import {placemarkService} from '$lib/services/placemark-service';

export const GET = async ({url, cookies}) => {
    const code = url.searchParams.get('code');
    if (!code) {
        throw redirect(303, '/login');
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code
        })
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
        throw redirect(303, '/login');
    }

    const accessToken = tokenData.access_token;

    const userResponse = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const userData = await userResponse.json();

    let email = userData.email;
    if (!email) {
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const emails = await emailsResponse.json();
        const primaryEmail = emails.find((e: any) => e.primary && e.verified);
        if (primaryEmail) {
            email = primaryEmail.email;
        }
    }

    if (!email) {
        throw redirect(303, '/login?error=no_email');
    }

    const nameParts = (userData.name || userData.login).split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'User';

    const session = await placemarkService.loginGitHub(email, firstName, lastName);

    if (session) {
        cookies.set('placemark-session', JSON.stringify(session), {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        throw redirect(303, '/dashboard');
    } else {
        throw redirect(303, '/login?error=login_failed');
    }
};