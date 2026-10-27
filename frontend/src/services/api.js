/**
 * Reusable Frontend API Service
 * Interacts with backend Express API via Vite proxy (/api).
 * Handles errors gracefully and never crashes the UI.
 */

const API_BASE = "/api";

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      return { success: false, database: "disconnected", error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      database: "disconnected",
      error: err.message || "Failed to reach backend server",
    };
  }
}

/**
 * Fetch decisions from backend if route exists, with graceful fallback
 */
export async function fetchDecisionsApi() {
  try {
    const res = await fetch(`${API_BASE}/decisions`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    // Graceful fallback to null so caller can preserve in-memory/demo state
    return null;
  }
}

/**
 * Save or update a decision
 */
export async function createDecisionApi(decisionData) {
  try {
    const res = await fetch(`${API_BASE}/decisions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(decisionData),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
}
