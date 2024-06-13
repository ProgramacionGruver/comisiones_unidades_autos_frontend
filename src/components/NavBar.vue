<template>
  <q-list>
    <div class="q-px-md q-py-md text-h4"></div>
    <q-separator />
    <template v-for="(menuItem, index) in menulist" :key="index">
      <q-item
        clickable
        v-ripple
        :to="{ name: menuItem.name }"
        exact
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon :name="menuItem.icono" />
        </q-item-section>

        <q-item-section>
          {{ menuItem.label }}
        </q-item-section>
      </q-item>
      <div v-if="menuItem.name === 'dashboard'">
        <div class="q-px-md q-py-md q-mt-md text-h4">Facturación</div>
        <q-separator />
      </div>
      <div v-if="menuItem.name === 'panelFacturas'">
        <div class="q-px-md q-py-md q-mt-md text-h4">PVAS</div>
        <q-separator />
      </div>
      <div v-if="menuItem.name === 'panelPvas'">
        <div class="q-px-md q-py-md q-mt-md text-h4">Descuentos</div>
        <q-separator />
      </div>
      <div v-if="menuItem.name === 'descuentosVendedores'">
        <div class="q-px-md q-py-md q-mt-md text-h4">Comisiones</div>
        <q-separator />
      </div>
      <div v-if="menuItem.name === 'autorizaciones'">
        <div class="q-px-md q-py-md q-mt-md text-h4">Catálogos</div>
        <q-separator />
      </div>
    </template>
  </q-list>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ID_SERVIDOR } from "src/constant/servidor";
import { useAutenticacionStore } from "src/stores/autenticaciones";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const menulist = ref([]);
const router = useRouter();

const useAutenticaciones = useAutenticacionStore();
const { obtenerPerfilUsuario } = useAutenticaciones;
const { usuarioAutenticado, perfilUsuario } = storeToRefs(useAutenticaciones);

onMounted(async () => {
  await obtenerPerfilUsuario(usuarioAutenticado.value.idUsuario, ID_SERVIDOR);

  menulist.value = router.options.routes
    .find((r) => {
      return r.name === "principal";
    })
    .children.filter((route) => route.label);

  if (perfilUsuario.value === null) {
    menulist.value = menulist.value.filter(
      (menuItem) =>
        menuItem.name !== "catalogoAutorizadoresJefes" &&
        menuItem.name !== "catalogoAsesores"
    );
  } else if (
    perfilUsuario.value.catalogo_perfiles_comisiones_auto.nombrePerfil ===
    "GERENTE"
  ) {
    menulist.value = menulist.value.filter(
      (menuItem) =>
        menuItem.name === "dashboard" ||
        menuItem.name === "panelPvas" ||
        menuItem.name === "catalogoAsesores"
    );
  } else if (
    perfilUsuario.value.catalogo_perfiles_comisiones_auto.nombrePerfil ===
    "AUXILIAR NUEVAS"
  ) {
    menulist.value = menulist.value.filter(
      (menuItem) =>
        menuItem.name !== "catalogoAutorizadoresJefes" &&
        menuItem.name !== "catalogoAsesores"
    );
  } else if (
    perfilUsuario.value.catalogo_perfiles_comisiones_auto.nombrePerfil ===
    "AUXILIAR SEMINUEVAS"
  ) {
    menulist.value = menulist.value.filter(
      (menuItem) =>
        menuItem.name !== "catalogoAutorizadoresJefes" &&
        menuItem.name !== "catalogoAsesores"
    );
  } else if (
    perfilUsuario.value.catalogo_perfiles_comisiones_auto.nombrePerfil ===
    "SISTEMAS"
  ) {
    menulist.value = menulist.value.filter(
      (menuItem) =>
        menuItem.name === "dashboard" || menuItem.name === "catalogoAsesores"
    );
  }

  if (router.currentRoute.value.name === "principal") {
    router.replace({ name: "dashboard" });
  }
});
</script>
<style lang="sass" scope>
.my-menu-link
  color: white
  background: $primary
</style>
