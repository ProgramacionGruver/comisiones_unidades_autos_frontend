import { defineStore, storeToRefs } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

 const comisionesUnidades = ref([])

export const useComisionesStore = defineStore('comisiones', () => {


  const obtenerComisionesUnidades = async (ObjComisiones) => {
    try {
      const { data } = await api.post('/autos/comisionesUnidades', ObjComisiones)
      comisionesUnidades.value = [...data]
    } catch (error) {
      console.log(error)
    }
  }

  return {
      comisionesUnidades,
      obtenerComisionesUnidades,
    }
})
