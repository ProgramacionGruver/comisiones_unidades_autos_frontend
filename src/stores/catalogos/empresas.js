import { defineStore, storeToRefs } from 'pinia'
import { api } from 'src/boot/axios'
import { apiUsuarios } from 'src/boot/axiosUsuarios.js'
import { ref } from 'vue'
import { useAutenticacionStore } from '../autenticaciones'

export const useEmpresasStore = defineStore('empresas', () => {
  const empresaSeleccionada = ref(null)
  const empresas = ref([])
  const opcionesEmpresas = ref([])

  const useAutenticacion = useAutenticacionStore()
  const { usuarioAutenticado } =storeToRefs(useAutenticacion)


  const obtenerEmpresas = async () => {
    try {
      const { data } = await apiUsuarios.get('/empresas')
      const { data:empresa } = await api.post('/empresas/cargos',{numeroEmpleado: usuarioAutenticado.value.numero_empleado})
      //Empresas
      const empresasFiltradas = data.filter(sucursal => {
          return empresa.includes(sucursal.claveEmpresa);
      })

      //Eliminar
      empresas.value = empresasFiltradas.filter(empresa => {
        return empresa.claveEmpresa === 'CH'
      })

    } catch (error) {
      console.log(error)
    }
  }

  return {
    empresaSeleccionada,
    empresas,
    opcionesEmpresas,
    obtenerEmpresas
  }
})
