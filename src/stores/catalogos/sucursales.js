import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { apiUsuarios } from 'src/boot/axiosUsuarios'
import { ref } from 'vue'
import { formatearCapitalCase } from 'src/helpers/formatos'

export const useSucursalesStore = defineStore('sucursales', () => {
  const sucursalSeleccionada = ref(null)
  const sucursales = ref([])
  const opcionesSucursales = ref([])
  const todasSucursalesSeleccionadas = ref(true)
  const grupoSucursales = ref([])
  const prefijosSucursal = ref([])

  const obtenerSucursales = async () => {
    try {
      const { data } = await apiUsuarios.get('/todasSucursales')

      //Sucursales
      const sucursalesFiltradas = data.filter(empresa => {
        return (empresa.claveEmpresa === "MB" || empresa.claveEmpresa === "IS")  &&
        empresa.abreviacion !== "MBCE" &&
        empresa.abreviacion !== "MBCECO"
        })

        sucursales.value = [...sucursalesFiltradas]
        prefijosSucursal.value = sucursales.value.map(sucursal => sucursal.abreviacion)

      //Opciones Sucursales
      opcionesSucursales.value = sucursales.value.map((sucursal) => {
        sucursal.label = formatearCapitalCase(sucursal.nombreSucursal)
        sucursal.value = sucursal.abreviacion
        return sucursal
      })

      grupoSucursales.value = sucursales.value.map((sucursal) => sucursal.nombreSucursal)
    } catch (error) {
      console.log(error)
    }
  }


  return {
    sucursales,
    sucursalSeleccionada,
    opcionesSucursales,
    todasSucursalesSeleccionadas,
    grupoSucursales,
    prefijosSucursal,
    obtenerSucursales,
  }
})
