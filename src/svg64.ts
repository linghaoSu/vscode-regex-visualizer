const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const PREFIX = 'data:image/svg+xml;base64,';

function utf8Encode(input: string): string {
  input = input.replace(/\r\n/g, '\n');

  let output = '';
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);

    if (c < 128) {
      output += String.fromCharCode(c);
    }
    else if (c < 2048) {
      output += String.fromCharCode((c >> 6) | 192);
      output += String.fromCharCode((c & 63) | 128);
    }
    else {
      output += String.fromCharCode((c >> 12) | 224);
      output += String.fromCharCode(((c >> 6) & 63) | 128);
      output += String.fromCharCode((c & 63) | 128);
    }
  }

  return output;
}

function encode(raw: string): string {
  const input = utf8Encode(raw);
  let output = '';
  let i = 0;

  while (i < input.length) {
    const chr1 = input.charCodeAt(i++);
    const chr2 = input.charCodeAt(i++);
    const chr3 = input.charCodeAt(i++);

    const enc1 = chr1 >> 2;
    const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    let enc4 = chr3 & 63;

    if (Number.isNaN(chr2)) {
      enc3 = enc4 = 64;
    }
    else if (Number.isNaN(chr3)) {
      enc4 = 64;
    }

    output += CHARS.charAt(enc1) + CHARS.charAt(enc2) + CHARS.charAt(enc3) + CHARS.charAt(enc4);
  }

  return output;
}

export const svg64 = (input: string): string => PREFIX + encode(input);

export default svg64;
