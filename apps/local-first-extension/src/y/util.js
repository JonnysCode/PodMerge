export function uint8ArrayToBase64(uint8Array) {
  returnBuffer.from(uint8Array).toString('base64');
}

export function base64ToUint8Array(base64String) {
  return new Uint8Array(Buffer.from(base64String, 'base64'));
}
