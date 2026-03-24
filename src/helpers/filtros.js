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

// Elimina elementos duplicados de una lista basándose en una propiedad única
export const filtrarElementosDuplicados = (listaElementos, nombrePropiedadUnica) => {
  return listaElementos.reduce((acumulador, elemento) => {
    // Comprueba si la propiedad 'nombrePropiedadUnica' del elemento ya se ha agregado al acumulador
    if (!acumulador.find(acu => acu[nombrePropiedadUnica] === elemento[nombrePropiedadUnica])) {
      acumulador.push(elemento)
    }
    return acumulador
  }, [])
}

export const llenarOpcionesDepartamentos = (departamentos) => {
  /* SI SE LLEGA A REQUERIR FILTRAR ALGUN DEPARTAMENTO --> USAR REGEX */
  // const regex = /BDC|CENTRALIZADOR|ACONDICIONAMIENTO|COCINA|MERCADOTECNIA|CORPORATIVA/
  // return departamentos.filter(departamento => !regex.test(departamento.departamento.nombreDepartamento)).map((departamento) => {
  return departamentos.map((departamento) => {
    departamento.label = departamento.departamento.nombreDepartamento
    departamento.claveEmpresa = departamento.sucursale.claveEmpresa
    departamento.value = departamento.claveDepartamento
    return departamento
  })
}
