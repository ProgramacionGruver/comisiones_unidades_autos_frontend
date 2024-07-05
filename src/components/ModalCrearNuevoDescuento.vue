<template>
  <q-dialog
    v-model="abrirModal"
    transition-show="scale"
    transition-hide="scale"
    persistent
  >
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <p>Nuevo descuento</p>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-select
          class="q-pb-none"
          outlined
          clearable
          use-input
          input-debounce="0"
          label="Seleccione un asesor"
          v-model="vendedorSeleccionado"
          @filter="parametrosFiltradosVendedores"
          :options="opcionesEmpleados"
          lazy-rules
          :rules="[(val) => !!val || 'Se requiere llenar este campo']"
        />
        <q-input
          v-model="fechaDescuento"
          outlined
          label="Fecha del descuento"
          type="date"
          class="q-mt-md"
        />
        <div style="width: 100%; display: block" class="q-mt-md">
          <label
            >Seleccione el departamento donde se aplicara el descuento</label
          >
          <q-select
            outlined
            dense
            :options="departamentos"
            v-model="departamentoSeleccionado"
            map-options
            option-value="name"
            style="width: 100%"
          />
        </div>
      </q-card-section>
      <q-card-actions>
        <div style="width: 100%">
          <div
            style="
              display: flex;
              justify-content: flex-end;
              align-items: center;
              column-gap: 2rem;
              margin: 0 1rem 1rem 0;
            "
          >
            <q-btn
              flat
              color="primary"
              label="Cancelar"
              icon="close"
              v-close-popup
            />
            <q-btn
              color="primary"
              label="Guardar"
              icon="save"
              @click="guardarDescuento"
              :loading="cargando"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <ModalDescuentosVendedor ref="modalDescuentosVendedor" />
</template>

<script>
import { storeToRefs } from "pinia";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { useDescuentosStore } from "src/stores/descuentos";
import { filtradoBusquedaObj } from "src/helpers/filtradoBusquedaObj";
import { ref } from "vue";
import { formatearFechaGuiones } from "src/helpers/formatearFecha";
import ModalDescuentosVendedor from "./ModalDescuentosVendedor.vue";
import { useDepartamentosStore } from "src/stores/catalogos/departamentos";

export default {
  components: {
    ModalDescuentosVendedor,
  },
  setup() {
    const abrirModal = ref(false);

    const useDescuentos = useDescuentosStore();
    const {
      guardarNuevoDescuentoVendedor,
      obtenerDetalleDescuentoVendedor,
      obtenerFormularioDescuento,
    } = useDescuentos;
    const { formularioDescuento, descuentoCreado } = storeToRefs(useDescuentos);

    const useFacturas = useFacturasStore();
    const { opcionesVendedores } = storeToRefs(useFacturas);

    const useDepartamentos = useDepartamentosStore();
    const { departamentos, departamentoSeleccionado } =
      storeToRefs(useDepartamentos);

    const vendedorSeleccionado = ref(null);
    const opcionesEmpleados = ref(opcionesVendedores.value);

    const fechaDescuento = ref("");
    const cargando = ref(false);

    const modalDescuentosVendedor = ref(null);

    const abrir = () => {
      vendedorSeleccionado.value = null;
      fechaDescuento.value = "";

      abrirModal.value = true;
    };

    const parametrosFiltradosVendedores = (val, update) => {
      filtradoBusquedaObj(
        val,
        update,
        opcionesVendedores.value,
        opcionesEmpleados
      );
    };

    const guardarDescuento = async () => {
      cargando.value = true;

      const claveDepartamento =
        departamentoSeleccionado.value.value.claveDepartamento;

      await obtenerFormularioDescuento(claveDepartamento);

      const dataDescuento = {
        no_empleado: vendedorSeleccionado.value.value
          ? vendedorSeleccionado.value.value.numeroEmpleado
          : vendedorSeleccionado.value.numeroEmpleado,
        nombre: vendedorSeleccionado.value.value
          ? vendedorSeleccionado.value.value.nombreEmpleado
          : vendedorSeleccionado.value.nombreEmpleado,
        fechaDescuento: formatearFechaGuiones(fechaDescuento.value),
        claveDepartamento,
        descuentos: formularioDescuento.value,
      };

      await guardarNuevoDescuentoVendedor(dataDescuento);

      // await obtenerDetalleDescuentoVendedor(
      //   descuentoCreado.value.idDescuentoVendedor
      // );

      // await modalDescuentosVendedor.value.abrirModalDescuento("nuevo");

      vendedorSeleccionado.value = null;
      fechaDescuento.value = "";
      cargando.value = false;
      abrirModal.value = false;
    };

    return {
      // States / Vars
      abrirModal,
      vendedorSeleccionado,
      opcionesEmpleados,
      opcionesVendedores,
      fechaDescuento,
      cargando,
      modalDescuentosVendedor,
      departamentos,
      departamentoSeleccionado,
      // Methods
      abrir,
      parametrosFiltradosVendedores,
      guardarDescuento,
    };
  },
};
</script>
