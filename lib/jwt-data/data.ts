
  // Function to decode Base64 URL
  export function base64UrlDecode({ base64Url }: { base64Url: string }) {
    if (!base64Url) {
      throw new Error("base64Url is undefined or empty.");
    }

    // Replace URL-safe characters with Base64 standard characters
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if necessary (Base64 strings must be a multiple of 4)
    const padding = base64.length % 4;
    if (padding) {
      base64 += '='.repeat(4 - padding);
    }

    // Decode the Base64 string
    const decoded = atob(base64);

    // Return the decoded string
    return decoded;
  }

  // Function to decode JWT and get the payload data
  export function decodeJwt({ idToken }: { idToken: string }) {
    if (!idToken) {
      throw new Error("idToken is undefined or empty.");
    }

    // Split the JWT into parts
    const parts = idToken.split('.');

    if (parts.length !== 3) {
      throw new Error("Invalid JWT format.");
    }

    // Decode the payload (second part)
    const payloadBase64Url = parts[1];
    const decodedPayload = base64UrlDecode({ base64Url: payloadBase64Url });

    // Parse the decoded payload into an object
    const payload = JSON.parse(decodedPayload);

    return payload;
  }