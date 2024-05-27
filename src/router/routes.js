const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("src/pages/loginPage.vue"),
  },
  {
    path: "/principal",
    name: "principal",
    meta: { auth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        icono: "dashboard",
        label: "Inicio",
        name: "dashboard",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/dashboard/DashBoard.vue"
          ),
      },
      {
        path: "objetivoValorReal",
        icono: "trending_up",
        label: "Valor de objetivo real",
        name: "objetivoValorReal",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/comisiones/ObjetivoReal.vue"
          ),
      },
      {
        path: "calculadorComisiones",
        icono: "calculate",
        label: "Calculador de Comisiones",
        name: "calculadorComisiones",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/comisiones/CalculadorComisiones.vue"
          ),
      },
      {
        path: "panelFacturas",
        icono: "description",
        label: "Panel de Facturas",
        name: "panelFacturas",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/facturas/PanelFacturas.vue"
          ),
      },
      {
        path: "panelPvas",
        icono: "assignment",
        label: "Panel de PVAS",
        name: "panelPvas",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/pvas/PanelPvas.vue"
          ),
      },
      {
        path: "descuentosVentas",
        icono: "payments",
        label: "Descuentos Ventas",
        name: "descuentosVentas",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/descuentos/DescuentosVentas.vue"
          ),
      },
      {
        path: "descuentosVendedores",
        icono: "payments",
        label: "Descuentos/Bonos a Vendedores",
        name: "descuentosVendedores",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/descuentos/DescuentosVendedores.vue"
          ),
      },
      {
        path: "kpis",
        icono: "checklist",
        label: "Catalogo KPIS",
        name: "kpis",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/catalogos/PanelKpis.vue"
          ),
      },
      {
        path: "catalogoAsesores",
        icono: "group",
        label: "Catalogo de Vendedores",
        name: "catalogoAsesores",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/catalogos/CatalogoAsesores.vue"
          ),
      },
      {
        path: "catalogoAseguradoras",
        icono: "shield",
        label: "Catalogo de Aseguradoras",
        name: "catalogoAseguradoras",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/catalogos/CatalogoAseguradoras.vue"
          ),
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];
export default routes;
