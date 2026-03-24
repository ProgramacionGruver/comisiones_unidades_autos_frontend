import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiUsuarios } from 'src/boot/axiosUsuarios'
import { filtrarElementosDuplicados, llenarOpcionesDepartamentos } from 'src/helpers/filtros'

export const useDepartamentosStore = defineStore('departamentos', () => {
  const departamentos = ref([])
  const departamentoSeleccionado = ref(null)
  const departamentosFiltrados = ref([])
  const modelDepartamentosSeleccionados = ref([])
  const todosDepartamentosSeleccionados = ref(true)
  const opcionesDepartamentos = ref([])
  const listaClavesDepartamentos = ref([])

  const obtenerDepartamentos = async () => {
    try {
      const { data } = await apiUsuarios.get('/departamentosSucursal')
      departamentos.value = data
        .filter((departamento) => departamento.sucursale.claveEmpresa == 'CH' && (departamento.claveDepartamento == 'NUE' || departamento.claveDepartamento == 'SEM'))
        .map(departamento => {
          return {
            ...departamento,
            label: departamento.departamento.nombreDepartamento,
            value: departamento.claveDepartamento
          }
        })
        .sort((a, b) => {
          const prioridad = { NUE: 0, SEM: 1 }
          return prioridad[a.claveDepartamento] - prioridad[b.claveDepartamento]
        })

      departamentosFiltrados.value = filtrarElementosDuplicados(departamentos.value, 'claveDepartamento')

      listaClavesDepartamentos.value = departamentosFiltrados.value.map(departamento => {
        return departamento.value
      })
    } catch (error) {
      console.log(error)
    }
  }

  return {
    departamentos,
    departamentosFiltrados,
    modelDepartamentosSeleccionados,
    todosDepartamentosSeleccionados,
    opcionesDepartamentos,
    listaClavesDepartamentos,
    obtenerDepartamentos,
    departamentoSeleccionado
  }
})
