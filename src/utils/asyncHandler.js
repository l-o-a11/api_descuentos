// Envuelve los controladores async para enviar los errores al middleware central
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
