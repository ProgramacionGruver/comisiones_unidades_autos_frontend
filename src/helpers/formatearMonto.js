export const formatearMonto = (monto) => {
  const montoAbsoluto = Math.abs(monto);
  const montoFormateado = montoAbsoluto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  if (monto < 0) {
    return `(${montoFormateado})`;
  }

  return montoFormateado;
};
