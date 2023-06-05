import { fetch as solidFetch } from '@inrupt/solid-client-authn-browser';

const useSolidAuth = true;

export async function constructRequest(uri, method, headers = {}, body = null) {
  const options = {
    method: method,
    headers: headers,
    body: body,
  };

  console.log('Options: ', options);

  try {
    const response = useSolidAuth
      ? await solidFetch(uri, options)
      : await fetch(uri, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}
