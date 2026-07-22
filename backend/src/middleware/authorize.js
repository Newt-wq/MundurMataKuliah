/**
 * authorize – Role-Based Authorization Middleware
 *
 * Memastikan user yang sudah terautentikasi memiliki role yang diizinkan
 * untuk mengakses route tertentu.
 *
 * Memenuhi requirement:
 * - Authorization: Role-based access control (RBAC)
 *
 * @param {...string} roles - Role yang diizinkan (misal: 'admin', 'mahasiswa')
 * @returns {Function} - Express middleware function
 *
 * Penggunaan:
 *   router.post('/admin-only', verifyToken, authorize('admin'), controller)
 *   router.post('/both', verifyToken, authorize('admin', 'mahasiswa'), controller)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user sudah diisi oleh verifyToken middleware sebelumnya
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. Silakan login terlebih dahulu.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Hanya ${roles.join(" atau ")} yang dapat mengakses endpoint ini.`,
      });
    }

    next();
  };
};

module.exports = authorize;
