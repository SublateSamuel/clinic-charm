// API configuration and utility functions for consuming the FastAPI backend

const API_BASE_URL = 'http://localhost:8000';

// Types for the API responses
export interface Animal {
  id: number;
  nome: string;
  especie: string;
  idade: number;
}

export interface Service {
  id: number;
  animal_id: number;
  tipo: string;
  descricao: string;
  data: string;
}

export interface CreateAnimalData {
  nome: string;
  especie: string;
  idade: number;
}

export interface CreateServiceData {
  tipo: string;
  descricao: string;
}

// Generic fetch function with error handling
async function fetchJSON<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Animal API functions
export const animalAPI = {
  // GET /animals/
  getAll: (): Promise<Animal[]> => fetchJSON('/animals/'),

  // POST /animals/
  create: (data: CreateAnimalData): Promise<Animal> =>
    fetchJSON('/animals/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // GET /animals/{id}
  getById: (id: number): Promise<Animal> => fetchJSON(`/animals/${id}`),

  // GET /animals/{id}/services/
  getServices: (id: number, limit?: number): Promise<Service[]> => {
    const params = limit ? `?limit=${limit}` : '';
    return fetchJSON(`/animals/${id}/services/${params}`);
  },

  // POST /animals/{id}/services/
  createService: (id: number, data: CreateServiceData): Promise<Service> =>
    fetchJSON(`/animals/${id}/services/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Error handler for UI
export const handleAPIError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch')) {
      return 'Erro de conexão. Verifique se o servidor está rodando.';
    }
    return error.message;
  }
  return 'Erro desconhecido ocorrido.';
};