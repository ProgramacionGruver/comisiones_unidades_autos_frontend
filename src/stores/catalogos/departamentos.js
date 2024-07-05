import { defineStore } from "pinia";
import { api } from "src/boot/axios.js";
import { ref } from "vue";

export const useDepartamentosStore = defineStore("departamentos", () => {
  const departamentos = ref([]);
  const departamentosFiltrados = ref([]);
  const departamentoSeleccionado = ref([]);

  const obtenerDepartamentos = async (perfilUsuario = null) => {
    try {
      const { data } = await api.get("/departamentos");

      //Departamentos
      let departamento = data.filter((departamento) => {
        return (
          departamento.claveDepartamento === "NUE" ||
          departamento.claveDepartamento === "SEM"
        );
      });

      // if (perfilUsuario) {
      //   let claveDepartamento = "";

      //   if (
      //     perfilUsuario.catalogo_perfiles_comisiones_auto.nombrePerfil ===
      //     "AUXILIAR NUEVAS"
      //   ) {
      //     claveDepartamento = "NUE";
      //   } else if (
      //     perfilUsuario.catalogo_perfiles_comisiones_auto.nombrePerfil ===
      //     "AUXILIAR SEMINUEVAS"
      //   ) {
      //     claveDepartamento = "SEM";
      //   }

      //   departamento = departamento.filter((departamento) => {
      //     return departamento.claveDepartamento === claveDepartamento;
      //   });
      // }

      departamentosFiltrados.value = [...departamento];

      //Opciones departamentos
      departamentos.value = departamentosFiltrados.value.map((departamento) => {
        return {
          label: `${departamento.nombreDepartamento}`,
          value: departamento,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    departamentos,
    departamentoSeleccionado,
    obtenerDepartamentos,
  };
});
