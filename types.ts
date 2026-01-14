
export interface ImageFile {
  base64: string;
  mimeType: string;
  preview: string;
}

export interface GeneratedResult {
  id: string;
  image: string; // Base64 string
  videoPrompt: string | null;
  loadingPrompt: boolean;
  timestamp: number;
  filename: string;
}
