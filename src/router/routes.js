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
        path: "",
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
        path: "kpis",
        icono: "checklist",
        label: "Panel KPIS",
        name: "kpis",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/kpis/PanelKpis.vue"
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
