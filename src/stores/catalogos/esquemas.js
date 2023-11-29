import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'

export const useEsquemasStore = defineStore('esquemas', () => {
  const asesorComercial = ref([])
  const gerenteComercial = ref([])
  const gerenteVentas = ref([])
  const gerenteGeneral = ref([])
  const gerenteRegional = ref([])
  const jefeVentas = ref([])
  const coordinadorCompras = ref([])
  const enlaceFinanciero = ref([])
  const gerenteSemiNuevos = ref([])
  const esquemaFaltante = ref(false)

  const obtenerEsquemas = async (objBusquedaEsquema, fecha) => {
    try {
      const { data } = await api.get('/esquemas')

      const esquemasFiltrados = data.filter(esquema => {
        if (objBusquedaEsquema.includes(esquema.nombrePuesto)) {
          const fechaInicio = new Date(esquema.fechaInicio)
          const fechaFin = new Date(esquema.fechaFin)
          const fechaConsulta = new Date(fecha)

          return fechaConsulta >= fechaInicio && fechaConsulta <= fechaFin
        }
        return false
      })

      asesorComercial.value = esquemasFiltrados.find((esquema) => esquema.nombrePuesto === objBusquedaEsquema[0])
      gerenteComercial.value = esquemasFiltrados.find((esquema) => esquema.nombrePuesto === objBusquedaEsquema[1])
      gerenteVentas.value = esquemasFiltrados.find((esquema) => esquema.nombrePuesto === objBusquedaEsquema[2])
      gerenteGeneral.value = esquemasFiltrados.find((esquema) => esquema.nombrePuesto === objBusquedaEsquema[3])
      gerenteRegional.value = esquemasFiltrados.find((esquema) => esquema.nombrePuesto === objBusquedaEsquema[4])
      jefeVentas.value = esquemasFiltrados.find((esquema) => esquema.nombrePuesto === objBusquedaEsquema[5])
      coordinadorCompras.value = esquemasFiltrados.find((esquema) => esquema.nombrePuesto === objBusquedaEsquema[6])
      enlaceFinanciero.value = esquemasFiltrados.find((esquema) => esquema.nombrePuesto === objBusquedaEsquema[7])
      gerenteSemiNuevos.value = esquemasFiltrados.find((esquema) => esquema.nombrePuesto === objBusquedaEsquema[8])

      verificarVariableReactiva(asesorComercial, 'Asesor Comercial')
      verificarVariableReactiva(gerenteComercial, 'Gerente Comercial')
      verificarVariableReactiva(gerenteVentas, 'Gerente Ventas')
      verificarVariableReactiva(gerenteGeneral, 'Gerente General')
      verificarVariableReactiva(gerenteRegional, 'Gerente Regional')
      verificarVariableReactiva(jefeVentas, 'Jefe Ventas')
      verificarVariableReactiva(coordinadorCompras, 'Coordinador Compras')
      verificarVariableReactiva(enlaceFinanciero, 'Enlace Financiero')
      verificarVariableReactiva(gerenteSemiNuevos, 'Gerente de Ventas Seminuevos')
    } catch (error) {
      // Manejar el error aquí
    }
  }

  const verificarVariableReactiva = (variableReactiva, nombrePuesto) => {
    if (!variableReactiva.value) {
      notificacion('negative', `Esquema de comision ${nombrePuesto} no encontrado favor de verificar.`)
      esquemaFaltante.value = true
    }
  }

  return {
    obtenerEsquemas,
    asesorComercial,
    gerenteComercial,
    gerenteVentas,
    gerenteGeneral,
    gerenteRegional,
    jefeVentas,
    coordinadorCompras,
    enlaceFinanciero,
    gerenteSemiNuevos,
    esquemaFaltante
  }
})
