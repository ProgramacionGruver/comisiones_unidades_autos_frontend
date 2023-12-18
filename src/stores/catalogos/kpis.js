import { defineStore, storeToRefs } from 'pinia'
import { ref } from "vue"
import { notificacion } from 'src/helpers/mensajes'
import { api } from 'src/boot/axios'

export const useKpiStore = defineStore('kpi', () => {

  const kpis = ref([])
  const objetivosKpis = ref([])


  const obtenerObjetivosKpis = async (objKpi) => {
    try {
      const { data } = await api.post('/objetivos/kpis/autos', objKpi)
      objetivosKpis.value = [...data]
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const guardarObjetivosKpis = async (objKpi) => {
    try {
      const { data } = await api.post('/objetivo/kpis/autos', objKpi)
      objetivosKpis.value = [...objetivosKpis.value, data]
      notificacion('positive', 'Objetivo Agregado', data)
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const actualizarObjetivosKpis = async (objKpi) => {
    try {
      const { data } = await api.put('/objetivo/kpis/autos', objKpi)
      const index = objetivosKpis.value.findIndex(objetivo => objetivo.idObjetivoKpi === objKpi.idObjetivoKpi)
      objetivosKpis.value[index] = data
      notificacion('positive', 'Objetivo Actualizado', data)
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  return {
      objetivosKpis,
      obtenerObjetivosKpis,
      guardarObjetivosKpis,
      actualizarObjetivosKpis
  }
})



