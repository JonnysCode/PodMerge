import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
} from '@inrupt/solid-client-authn-browser';

export async function loginSolid() {
  await handleIncomingRedirect();

  let session = getDefaultSession();

  if (!session.info.isLoggedIn) {
    console.log('Not logged in, redirecting to login page...');
    await login({
      oidcIssuer: 'https://inrupt.net',
      redirectUrl: window.location.href,
      clientName: 'Collaborative Blog',
    });
  }

  console.log('Session: ', session);
  return session;
}

export async function loginSolid2() {
  const session = await getSession();
  if (!session) {
    await login({
      oidcIssuer: 'https://inrupt.net',
      popUp: true,
      redirectUrl: window.location.href,
    });
  }
  console.log('Session: ', session);
  return session;
}
