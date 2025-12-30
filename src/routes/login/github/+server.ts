import { redirect } from '@sveltejs/kit';
import { GITHUB_CLIENT_ID } from '$env/static/private';

export const GET = async ({ url }) => {
    const clientId = GITHUB_CLIENT_ID;
    const redirectUri = `${url.origin}/login/github/callback`;
    const scope = 'user:email';

    throw redirect(302, `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`);
};

