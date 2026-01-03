export const API_URL = "http://localhost:3000/api";

export async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "API Error");
  }

  return res.json();
}
