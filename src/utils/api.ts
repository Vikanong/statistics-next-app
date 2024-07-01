// utils/api.ts
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchData(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${baseUrl}${endpoint}`, options);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
}
