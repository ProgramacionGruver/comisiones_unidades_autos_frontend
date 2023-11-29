export const filtrarNombre = (elementoSeleccionado, estate, opciones, elementoFiltrar) => {
  const opcionesFiltrado = opciones.value.filter(elemento => {
    return elementoSeleccionado.value.includes(elemento[elementoFiltrar])
  })
  estate.value = opcionesFiltrado
}

export const filtrarElementos = (elementoSeleccionado, opciones, campoFiltrado) => {
  return opciones.value.filter(elemento => {
    return elementoSeleccionado.value.includes(elemento[campoFiltrado])
  })
}
