/**
 * asyncHandler – Middleware Asinkron Wrapper
 *
 * Membungkus async route handler agar tidak perlu menulis try-catch di setiap controller.
 * Jika terjadi error pada async function, error akan diteruskan ke Express error handler
 * melalui next(error).
 *
 * Memenuhi requirement:
 * - Asynchronous Programming: Middleware Asinkron
 * - Error Handling: Propagasi error ke global error handler
 *
 * @param {Function} fn - Async function (controller)
 * @returns {Function} - Express middleware function
 *
 * Penggunaan:
 *   router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
  // Promise.resolve() untuk menangkap rejected promise dari async function
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
