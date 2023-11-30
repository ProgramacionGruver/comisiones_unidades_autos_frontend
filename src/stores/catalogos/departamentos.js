import { defineStore } from 'pinia'
import { api } from 'src/boot/axios.js'
import { ref } from 'vue'

export const useDepartamentosStore = defineStore('departamentos', () => {
  const departamentos = ref([])
  const departamentosFiltrados= ref([])
  const departamentoSeleccionado = ref([])
  
  const obtenerDepartamentos = async () => {
    try {
      const { data } = await api.get('/departamentos')
      
      //Departamentos
      const departamento = data.filter(departamento => {
      return departamento.claveDepartamento === "NUE" || departamento.claveDepartamento === "SEM"
      })
      departamentosFiltrados.value = [...departamento]
      
      //Opciones departamentos
      departamentos.value = departamentosFiltrados.value.map(departamento => {
        return {
          label: `${departamento.nombreDepartamento}`,
          value: departamento
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  

  return {
    departamentos,
    departamentoSeleccionado,
    obtenerDepartamentos
    }
})
