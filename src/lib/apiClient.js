/**
 * apiClient – Helper untuk fetch ke backend API
 *
 * Semua request ke backend sudah dikonfigurasi dengan:
 * - Base URL backend (http://localhost:5000/api)
 * - credentials: 'include' → agar httpOnly cookie dikirim otomatis
 * - Content-Type: application/json
 *
 * Memenuhi requirement:
 * - Asynchronous Programming: Async/Await + Promise
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Fungsi dasar untuk melakukan fetch ke backend
 * @param {string} endpoint - Path API (contoh: '/pengajuan')
 * @param {RequestInit} options - Opsi fetch (method, body, dll)
 * @returns {Promise<Object>} - Response JSON dari backend
 */
const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const defaultOptions = {
    credentials: "include", // PENTING: kirim httpOnly cookie di setiap request
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  // Parse response body
  const data = await response.json();

  // Jika response tidak ok (status 4xx atau 5xx), throw error
  if (!response.ok) {
    const error = new Error(data.message || "Terjadi kesalahan.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// =====================================================
// AUTH API
// =====================================================
export const authApi = {
  /**
   * Redirect ke halaman Google OAuth
   * Dilakukan dengan window.location, bukan fetch
   */
  loginWithGoogle: () => {
    window.location.href = `${BASE_URL}/auth/google`;
  },

  /**
   * Mendapatkan data user yang sedang login (dari cookie)
   * @returns {Promise<Object>} - Data user
   */
  getMe: () => apiFetch("/auth/me"),

  /**
   * Fast-track dev login tanpa Google OAuth
   * @param {string} role - 'mahasiswa' atau 'admin'
   * @returns {Promise<Object>}
   */
  devLogin: (role = "mahasiswa") =>
    apiFetch("/auth/dev-login", {
      method: "POST",
      body: JSON.stringify({ role }),
    }),

  /**
   * Logout user
   * @returns {Promise<Object>} - Response sukses
   */
  logout: () =>
    apiFetch("/auth/logout", {
      method: "POST",
    }),
};

// =====================================================
// PENGAJUAN API
// =====================================================
export const pengajuanApi = {
  /**
   * Mendapatkan daftar pengajuan
   * @param {Object} params - Query params (status, search)
   * @returns {Promise<Object>} - { success, count, data }
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/pengajuan${query ? `?${query}` : ""}`);
  },

  /**
   * Membuat pengajuan baru
   * @param {Object} formData - Data form pengajuan
   * @returns {Promise<Object>} - { success, data: pengajuan }
   */
  create: (formData) =>
    apiFetch("/pengajuan", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  /**
   * Mendapatkan detail pengajuan berdasarkan ID publik
   * @param {string} id - ID publik (REQ-YYYY-NNN)
   * @returns {Promise<Object>} - { success, data: pengajuan }
   */
  getById: (id) => apiFetch(`/pengajuan/${id}`),

  /**
   * Update status pengajuan
   * @param {string} id - ID publik pengajuan
   * @param {string} status - Status baru
   * @param {string} [catatanAdmin] - Catatan admin (opsional)
   * @returns {Promise<Object>} - { success, data: pengajuan }
   */
  updateStatus: (id, status, catatanAdmin = null) =>
    apiFetch(`/pengajuan/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, catatanAdmin }),
    }),

  /**
   * Upload dokumen pendukung
   * @param {string} id - ID publik pengajuan
   * @param {File} file - File yang akan diupload
   * @returns {Promise<Object>} - { success, data: { filename, ... } }
   */
  uploadDokumen: async (id, file) => {
    const formData = new FormData();
    formData.append("dokumen", file);

    const response = await fetch(`${BASE_URL}/pengajuan/${id}/dokumen`, {
      method: "POST",
      credentials: "include",
      // Jangan set Content-Type saat FormData — browser akan set sendiri dengan boundary
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || "Upload gagal.");
      error.status = response.status;
      throw error;
    }
    return data;
  },

  /**
   * Mendapatkan URL untuk download/view dokumen
   * @param {string} id - ID publik pengajuan
   * @returns {string} - URL dokumen
   */
  getDokumenUrl: (id) => `${BASE_URL}/pengajuan/${id}/dokumen`,
};
