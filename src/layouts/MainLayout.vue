<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar class="logo-inicio">
            <img src="../img/logog.png" />
          </q-avatar>
          Portal Comisiones Unidades
        </q-toolbar-title>
        <q-btn flat @click="logout">Cerrar Sesión</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <div class="row justify-center contenedor-menu">
        <q-img src="../img/banner.jpg" id="target-img-1" style="height: 100px">
          <div
            class="absolute-bottom-right"
            style="border-top-left-radius: 5px"
          >
            <q-avatar class="avatar">
              <!-- <img src="../img/yo.png" /> -->
              {{ inicialesUsuarios || null }}
              <!-- {{ usuarioAutenticado?.nombre }} -->
              <span style="font-weight: bold"></span>
            </q-avatar>
            {{ usuarioAutenticado?.nombre }}
            <span style="font-weight: bold"></span>
          </div>
        </q-img>
      </div>
      <NavBar></NavBar>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import NavBar from "../components/NavBar.vue";
import { storeToRefs } from "pinia";
import { useAutenticacionStore } from "../stores/autenticaciones";
import { useRouter } from "vue-router";
import { useSucursalesStore } from "src/stores/catalogos/sucursales";
import { useEmpresasStore } from "src/stores/catalogos/empresas";
import { useDepartamentosStore } from "src/stores/catalogos/departamentos";
import { useFacturasStore } from "src/stores/catalogos/facturas";
import { useAseguradorasStore } from "src/stores/catalogos/aseguradoras";
import { useKpiStore } from "src/stores/catalogos/kpis";
//import { useDashboardStore } from "../stores/dashboard";

export default {
  components: {
    NavBar,
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const useUsuario = useAutenticacionStore();
    const router = useRouter();

    const { usuarioAutenticado } = storeToRefs(useUsuario);
    const { cerrarSesion } = useUsuario;

    const useEmpresas = useEmpresasStore();
    const { obtenerEmpresas } = useEmpresas;

    const useSucursales = useSucursalesStore();
    const { obtenerSucursales } = useSucursales;

    const useDepartamentos = useDepartamentosStore();
    const { obtenerDepartamentos } = useDepartamentos;

    const useFacturas = useFacturasStore();
    const { obtenerVendedores, obtenerClientes } = useFacturas;

    const useAseguradoras = useAseguradorasStore();
    const { obtenerCatalogoAseguradoras } = useAseguradoras;

    onMounted(async () => {
      await obtenerEmpresas();
      await obtenerSucursales();
      await obtenerDepartamentos();
      await obtenerVendedores();
      await obtenerClientes();
      await obtenerCatalogoAseguradoras();
    });

    const logout = () => {
      router.push("/");
      cerrarSesion();
    };
    const inicialesUsuarios = computed(() => {
      const nombreArray = usuarioAutenticado?.value?.nombre.split(" ");
      if (!nombreArray) return;
      const iniciales = `${nombreArray[0]?.charAt(0)}${nombreArray[1]?.charAt(
        0
      )}`;
      return iniciales;
    });

    return {
      leftDrawerOpen,
      // inicialesUsuario,
      usuarioAutenticado,
      logout,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      inicialesUsuarios,
    };
  },
};
</script>
<style scoped>
.logo-inicio {
  background-color: white;
}
.logo-inicio img {
  padding: 0.3rem;
}
.contenedor-menu {
  margin-bottom: 1rem;
}
</style>
