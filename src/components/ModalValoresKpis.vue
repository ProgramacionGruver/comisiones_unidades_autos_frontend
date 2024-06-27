<template>
  <q-dialog v-model="abrirModal">
    <q-card style="min-width: 70vw">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <p>Registrar valor de objetivos</p>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup class="q-mb-md" />
      </q-card-section>
      <q-card-section>
        <div style="width: 100%">
          <div style="width: 100%">
            <label>Seleccione el vendedor</label>
            <q-select
              v-model="empleadoSeleccionado"
              :options="opcionesEmpleados"
              label="Vendedor"
              emit-value
              map-options
              option-value="value"
              option-label="label"
              dense
              outlined
              @update:model-value="obtenerFormulario"
              @filter="parametrosFiltradosVendedores"
              clearable
              use-input
              input-debounce="0"
              style="width: 100%"
            />
          </div>
          <!-- <div>
            <label>Seleccione una sucursal</label>
            <q-select
              v-model="sucursalSeleccionada"
              :options="opcionesSucursales"
              label="Sucursal"
              emit-value
              map-options
              option-value="value"
              option-label="label"
              dense
              outlined
              @update:model-value="obtenerFormulario"
            />
          </div> -->
        </div>
        <div
          v-if="!habilitarFormulario"
          style="
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 2rem;
          "
        >
          <q-icon name="help" size="10rem" color="primary" class="q-mb-sm" />
          <p class="text-h4 text-center">
            Seleccione un vendedor para llenar el formulario
          </p>
        </div>
        <div
          v-else
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 2rem;
            row-gap: 2rem;
            margin-top: 2rem;
          "
        >
          <template
            v-for="objetivo in obtjetivosFormulario"
            :key="objetivo.idObjetivoKpi"
          >
            <div>
              <label>{{ objetivo.nombreKpi }}</label>
              <q-input
                v-model="objetivo.valorReal"
                type="number"
                min="0"
                dense
                outlined
              />
            </div>
          </template>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="Cancelar"
          flat
          @click="abrirModal = false"
          icon="close"
        />
        <q-btn
          color="primary"
          label="Guardar"
          @click="guardarValores"
          :disable="!habilitarFormulario"
          icon="save"
          :loading="cargando"
        >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { storeToRefs } from "pinia";
import { useSucursalesStore } from "src/stores/catalogos/sucursales";
import { useKpiStore } from "src/stores/catalogos/kpis";
import {
  obtenerNumeroQuincena,
  obtenerNumerosDeMes,
} from "src/constant/constantes";
import { filtradoBusquedaObj } from "src/helpers/filtradoBusquedaObj";

export default {
  setup() {
    const useFacturas = useFacturasStore();
    const {
      opcionesVendedores,
      anioSeleccionado,
      mesSeleccionado,
      quincenaSeleccionada,
    } = storeToRefs(useFacturas);

    const useSucursales = useSucursalesStore();
    const { sucursales } = storeToRefs(useSucursales);

    const useKpis = useKpiStore();
    const { obtenerObjetivosFormulario, insertarValoresReales } = useKpis;
    const { obtjetivosFormulario } = storeToRefs(useKpis);

    const opcionesEmpleados = ref(opcionesVendedores.value);
    const empleadoSeleccionado = ref(null);

    const opcionesSucursales = ref([]);
    const sucursalSeleccionada = ref(null);

    const abrirModal = ref(false);
    const habilitarFormulario = ref(false);
    const cargando = ref(false);

    const abrir = () => {
      empleadoSeleccionado.value = null;

      sucursales.value = sucursales.value.filter(
        (sucursal) => sucursal.claveEmpresa === "CH"
      );

      opcionesSucursales.value = sucursales.value.map((sucursal) => {
        return {
          label: `${sucursal.nombreSucursal}`,
          value: { ...sucursal },
        };
      });
      abrirModal.value = true;
    };

    const obtenerFormulario = async () => {
      if (empleadoSeleccionado.value) {
        const obj = {
          nivel: empleadoSeleccionado.value.nivel,
          claveDepartamento: empleadoSeleccionado.value.claveDepartamento,
        };

        await obtenerObjetivosFormulario(obj);

        for (const objetivo of obtjetivosFormulario.value) {
          objetivo.valorReal = 0;
        }

        habilitarFormulario.value = true;
      }
    };

    const parametrosFiltradosVendedores = (val, update) => {
      filtradoBusquedaObj(
        val,
        update,
        opcionesVendedores.value,
        opcionesEmpleados
      );
    };

    const guardarValores = async () => {
      cargando.value = true;

      const objInsertar = {
        idAsesor: empleadoSeleccionado.value.idAsesor,
        kpis: obtjetivosFormulario.value,
        anio: anioSeleccionado.value,
        mes: obtenerNumerosDeMes(mesSeleccionado.value),
        quincena: obtenerNumeroQuincena(quincenaSeleccionada.value),
      };

      await insertarValoresReales(objInsertar);

      cargando.value = false;
      abrirModal.value = false;
    };

    return {
      // States
      abrirModal,
      opcionesEmpleados,
      empleadoSeleccionado,
      opcionesSucursales,
      sucursalSeleccionada,
      habilitarFormulario,
      obtjetivosFormulario,
      cargando,
      // Methods
      abrir,
      obtenerFormulario,
      guardarValores,
      parametrosFiltradosVendedores,
    };
  },
};
</script>
