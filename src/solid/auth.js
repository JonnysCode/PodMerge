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

export async function getSession() {
  await handleIncomingRedirect();
  let session = getDefaultSession();

  console.log('Session: ', session.info);
  return session;
}
