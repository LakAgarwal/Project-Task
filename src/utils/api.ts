const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  async uploadFile(file: File, prompt: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  },

  async generateSummary(fileId: string, prompt: string) {
    const response = await fetch(`${API_BASE_URL}/api/generate-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId, prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }

    return response.json();
  },

  async getSummary(summaryId: string) {
    const response = await fetch(`${API_BASE_URL}/api/summary/${summaryId}`);

    if (!response.ok) {
      throw new Error('Failed to get summary');
    }

    return response.json();
  }
};