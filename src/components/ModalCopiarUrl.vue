<template>
  <q-dialog
    v-model="abrirModal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-mb-md">
        <p>Copiar URL de comision</p>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <table
          style="
            border: 2px solid black;
            width: 100%;
            border-collapse: collapse;
          "
        >
          <tr>
            <td style="border: 1px solid black">
              <span style="padding-left: 1rem">Link para el asesor</span>
            </td>
            <td
              style="
                border-bottom: 1px solid black;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <q-btn
                icon="content_copy"
                flat
                round
                dense
                @click="copiarUrl('vendedor')"
              />
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black">
              <span style="padding-left: 1rem"
                >Link para el jefe de ventas</span
              >
            </td>
            <td
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <q-btn
                icon="content_copy"
                flat
                round
                dense
                @click="copiarUrl('jefe')"
              />
            </td>
          </tr>
        </table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Cerrar"
          icon-right="close"
          color="primary"
          v-close-popup
          flat
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { useAutorizacionesStore } from "src/stores/autorizaciones";
import { storeToRefs } from "pinia";
import { obtenerNumerosDeMes } from "src/constant/constantes";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { notificacion } from "src/helpers/mensajes";

export default {
  setup() {
    const abrirModal = ref(false);

    const autorizacionesObj = ref(null);

    const useAutorizaciones = useAutorizacionesStore();
    const {
      obtenerAutorizacionesByMes,
      obtenerInfoVendedorByID,
      obtenerInfoVendedorByNumeroEmpleado,
    } = useAutorizaciones;
    const { autorizaciones } = storeToRefs(useAutorizaciones);

    const useFacturas = useFacturasStore();
    const { anioSeleccionado, mesSeleccionado } = storeToRefs(useFacturas);

    const abrir = (autorizacion) => {
      autorizacionesObj.value = autorizacion;

      abrirModal.value = true;
    };

    const copiarUrl = async (tipo) => {
      const mes = Number(obtenerNumerosDeMes(mesSeleccionado.value));

      const numeroEmpleado =
        autorizacionesObj.value.autorizaciones_comisiones_autos_detalles.find(
          (empleado) => empleado.tipoEmpleado === "VENDEDOR"
        ).numeroEmpleado;

      const vendedor = await obtenerInfoVendedorByNumeroEmpleado(
        numeroEmpleado
      );

      const linkComision = `https://www.gruver.com.mx/portal_comisiones_unidades_autos/#/autorizacion/${tipo}/${vendedor.idAsesor}/${mes}/${anioSeleccionado.value}/${autorizacionesObj.value.idAutorizacion}`;

      console.log(linkComision);

      await navigator.clipboard.writeText(linkComision);

      notificacion("positive", "Link copiado al portapapeles");
    };

    return {
      // States
      abrirModal,
      // Methods
      abrir,
      copiarUrl,
    };
  },
};
</script>
