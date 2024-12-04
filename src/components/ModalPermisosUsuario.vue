<template>
  <q-dialog v-model="modalPermisos">
    <q-card class="full-width">
      <q-card-section
        class="bg-primary text-white row"
        style="position: sticky; top: 0; z-index: 100"
      >
        <h4 class="q-my-none">Editar permisos</h4>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pb-none">
        <q-select
          use-input
          clearable
          class="q-mb-md"
          v-model="usuarioSeleccionado"
          label="Selecciona un usuario"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          outlined
          map-options
          behavior="menu"
          :options="opcionesUsuarios"
          @update:model-value="seleccionarUsuario"
          @filter="parametrosFiltradosEmpleados"
        />
      </q-card-section>

      <q-card-section style="max-height: 50vh" class="scroll q-pt-none">
        <div v-if="!usuarioSeleccionado" align="center">
          <q-icon
            name="checklist"
            color="grey"
            size="3rem"
            class="q-mr-sm"
          ></q-icon>
          <div class="text-weight-light text-grey">
            Selecciona un usuario para editar sus permisos
          </div>
        </div>
        <div v-else>
          <q-tree
            class="col-12 col-sm-6"
            :nodes="checksPermisos"
            node-key="label"
            tick-strategy="leaf"
            v-model:ticked="tickedSeleccionados"
            default-expand-all
          />
          <div align="center">
            <q-btn
              class="q-my-sm"
              @click="actualizarPermisos"
              icon="update"
              label="actualizar"
              color="primary"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref } from "vue";
import { useModulosStore } from "src/stores/permisosModulos";
import { storeToRefs } from "pinia";
import { filtradoBusquedauUsuariosAcceso } from "src/helpers/filtrarBusquedaObj";
import { ID_SERVIDOR } from "src/constant/servidor.js";

export default {
  setup() {
    const useModulos = useModulosStore();
    const { actualizarPermisosModulos } = useModulos;
    const { filtroUsuariosAcceso, listaModulos } = storeToRefs(useModulos);

    const modalPermisos = ref(false);
    const usuarioSeleccionado = ref("");
    const checksPermisos = ref([]);
    const tickedSeleccionados = ref([]);
    const opcionesUsuarios = ref(filtroUsuariosAcceso.value);

    const abrir = () => {
      modalPermisos.value = true;

      usuarioSeleccionado.value = "";
      checksPermisos.value = [
        {
          label: "Modulos del portal",
          children: listaModulos.value.map((e) => ({
            label: e.label,
            name: e.name,
          })),
        },
      ];
    };

    const seleccionarUsuario = () => {
      tickedSeleccionados.value = listaModulos.value
        .filter((modulo) =>
          usuarioSeleccionado.value.permisos.some(
            (permiso) => permiso.moduloPortale.nombreModulo === modulo.name
          )
        )
        .map((modulo) => modulo.label);
    };

    const actualizarPermisos = async () => {
      const permisosActualizar = {
        usuarioSeleccionado: usuarioSeleccionado.value,
        permisosSeleccionados: tickedSeleccionados.value.map((e) =>
          listaModulos.value.find((a) => a.label === e)
        ),
        idPortal: ID_SERVIDOR,
      };

      await actualizarPermisosModulos(permisosActualizar);

      modalPermisos.value = false;
    };

    const parametrosFiltradosEmpleados = (val, update) => {
      filtradoBusquedauUsuariosAcceso(
        val,
        update,
        filtroUsuariosAcceso.value,
        opcionesUsuarios
      );
    };

    return {
      // state
      modalPermisos,
      filtroUsuariosAcceso,
      usuarioSeleccionado,
      listaModulos,
      checksPermisos,
      tickedSeleccionados,

      // methods
      abrir,
      seleccionarUsuario,
      actualizarPermisos,
      parametrosFiltradosEmpleados,
      opcionesUsuarios,
    };
  },
};
</script>
