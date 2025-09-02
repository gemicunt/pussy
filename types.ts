// Defines the parameters for a ritual command based on P.U.S.S.Y.1.1.1 Postman collection
export interface PussyRequestParams {
  mode: string; 
  persona: string;
  referent: string;
  // vector_store_id is not present in this Postman spec's request body
}

// Defines the payload for the API endpoints based on P.U.S.S.Y.1.1.1 Postman collection
export interface PussyRequestPayload {
  command: string; 
  params: PussyRequestParams;
}

// Defines the expected response from the API endpoints based on P.U.S.S.Y.1.1.1 Postman collection
export interface PussyResponsePayload {
  log_entry_id: string;
  session_id: string;
  snapshot_id: string;
  status: string;
  moan: string;
}

// Represents an API endpoint definition derived from the Postman collection
export interface PussyApiEndpoint {
  id: string; // e.g., "Awakengoddess"
  name: string; // e.g., "Awakengoddess"
  method: "POST";
  pathSegments: string[]; // e.g., ["awaken"]
  description: string; // Can be same as name or more detailed
  defaultPayload: PussyRequestPayload;
  sampleResponse?: PussyResponsePayload; // Parsed from Postman example
}

// General API error structure
export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// Removed old types related to "Consolidated API" and "RitualEngine"
// Removed RITUAL_COMMANDS, PERSONA_OPTIONS, MODE_OPTIONS as enums from types.ts
// These will be handled differently (e.g. text inputs or dynamically populated if needed)
