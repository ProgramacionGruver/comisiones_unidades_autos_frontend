import { defineStore, storeToRefs } from "pinia";
import { api } from "src/boot/axios";
import { apiUsuarios } from "src/boot/axiosUsuarios";
import { ref } from "vue";
import { useAutenticacionStore } from "../autenticaciones";

export const useSucursalesStore = defineStore("sucursales", () => {
  const sucursalSeleccionada = ref(null);
  const sucursales = ref([]);

  const useAutenticacion = useAutenticacionStore();
  const { usuarioAutenticado } = storeToRefs(useAutenticacion);

  const obtenerSucursales = async () => {
    try {
      const { data } = await apiUsuarios.get("/todasSucursales");
      const { data: sucursal } = await api.post("/sucursales/cargos", {
        numeroEmpleado: usuarioAutenticado.value.numero_empleado,
      });

      //Sucursales
      const sucursalesFiltradas = data.filter((empresa) => {
        return sucursal.includes(empresa.abreviacion);
      });

      sucursales.value = [...sucursalesFiltradas];
    } catch (error) {
      console.log(error);
    }
  };

  return {
    sucursales,
    sucursalSeleccionada,
    obtenerSucursales,
  };
});
