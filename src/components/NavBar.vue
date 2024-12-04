<template>
  <q-scroll-area
    :thumb-style="{
      right: '4px',
      borderRadius: '5px',
      backgroundColor: '#027be3',
      width: '5px',
      opacity: 0.75,
    }"
    :bar-style="{
      right: '2px',
      borderRadius: '9px',
      backgroundColor: '#027be3',
      width: '9px',
      opacity: 0.2,
    }"
    style="height: 80%; max-width: 100%"
  >
    <q-list>
      <div class="q-px-md q-py-md text-h4">Dashboard</div>
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
        <div v-if="menuItem.name === 'panelControl'">
          <div class="q-px-md q-py-md q-mt-md text-h4">Facturación</div>
          <q-separator />
        </div>
        <div v-if="menuItem.name === 'suAuto'">
          <div class="q-px-md q-py-md q-mt-md text-h4">PVAS</div>
          <q-separator />
        </div>
        <div v-if="menuItem.name === 'planPiso'">
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
  </q-scroll-area>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAutenticacionStore } from "src/stores/autenticaciones";

const menulist = ref([]);
const router = useRouter();

const useUsuario = useAutenticacionStore();
const { usuarioAutenticado } = storeToRefs(useUsuario);

onMounted(() => {
  const modulosPermiso = usuarioAutenticado.value.modulos.map(
    (e) => e.moduloPortale.nombreModulo
  );
  menulist.value = router.options.routes
    .find((r) => {
      return r.name === "principal";
    })
    .children.filter((route) => modulosPermiso.includes(route.name));

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
