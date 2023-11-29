import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { apiUsuarios } from 'src/boot/axiosUsuarios.js'
import { ref } from 'vue'
import { formatearCapitalCase } from 'src/helpers/formatos'

export const useEmpresasStore = defineStore('empresas', () => {
  const empresaSeleccionada = ref(null)
  const empresas = ref([])
  const opcionesEmpresas = ref([])
  const todasEmpresasSeleccionadas = ref(true)
  const grupoEmpresas = ref([])


  const obtenerEmpresas = async () => {
    try {
      const { data } = await apiUsuarios.get('/empresas')

      //Empresas
      const empresasFiltradas = data.filter(empresa => {
      return empresa.division === "CAMIONES" || empresa.division === "GOMSA DIESEL"
      })
      empresas.value = [...empresasFiltradas]

      //Opciones de empresas
      opcionesEmpresas.value = empresas.value.map((empresa) => {
        empresa.label = formatearCapitalCase(empresa.division)
        empresa.value = empresa.claveEmpresa
        return empresa
      })

      grupoEmpresas.value = empresas.value.map((empresa) => empresa.division)

    } catch (error) {
      console.log(error)
    }
  }

  return {
    empresaSeleccionada,
    empresas,
    opcionesEmpresas,
    todasEmpresasSeleccionadas,
    grupoEmpresas,
    obtenerEmpresas
  }
})
