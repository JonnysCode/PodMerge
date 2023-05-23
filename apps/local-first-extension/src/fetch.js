export async function constructRequest(uri, method, headers = {}, body = null) {
  const options = {
    method: method,
    headers: headers,
    body: body !== null ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(uri, options);
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
