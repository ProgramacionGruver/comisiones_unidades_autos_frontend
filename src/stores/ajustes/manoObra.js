import { defineStore } from 'pinia'
import { api } from 'src/boot/axios.js'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'

export const useManoObraStore = defineStore('manoObra', () => {
  const cargando = ref(true)
  const manoObra = ref([])
  const manoObraFiltrado = ref([])

  const obtenerManoObra = async () => {
    try {
      cargando.value = true
      const { data } = await api.get('/manosObra/obtener')
      manoObra.value = [...data]
    } catch (error) {
      console.log(error)
    }finally{
      cargando.value = false
    }
  }

  const guardarManoObra = async (objManoObra) => {
    try {
      const { data } = await api.post('/manosObra/agregar', objManoObra)
      manoObra.value = [...manoObra.value, data]
      notificacion('positive', 'Costo Mano de Obra Agregado Correctamente')
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }finally{
      cargando.value = false
    }
  }



  return {
    manoObra,
    manoObraFiltrado,
    cargando,
    obtenerManoObra,
    guardarManoObra
    }
})
