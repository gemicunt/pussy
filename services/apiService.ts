import { ApiError } from '../types'; // Assuming ApiError remains consistent

export const invokeApi = async <TRequestPayload, TResponsePayload>(
  baseUrl: string,
  path: string,
  payload: TRequestPayload
): Promise<TResponsePayload> => {
  const url = `${baseUrl}/${path}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add 'X-API-Key' header here if needed for certain endpoints
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        // If response is not JSON, use text
        errorBody = await response.text();
      }
      const error: ApiError = {
        message: `API Error: ${response.statusText || 'Unknown error'} (Status: ${response.status})`,
        status: response.status,
        details: errorBody,
      };
      throw error;
    }

    // Handle cases where response might be empty (e.g., 204 No Content)
    // though for this API, JSON is expected.
    const responseText = await response.text();
    if (!responseText) {
        // Or handle as a specific type if empty responses are valid for some TResponsePayload
        return {} as TResponsePayload;
    }

    const data: TResponsePayload = JSON.parse(responseText);
    return data;

  } catch (error) {
    if ((error as ApiError).status !== undefined) { // Check if it's an ApiError we threw
      throw error;
    }
    // Network error or other client-side error
    const unhandledError: ApiError = {
        message: (error as Error).message || 'Network error or unexpected issue',
        details: error
    };
    throw unhandledError;
  }
};
