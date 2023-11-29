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
        label: "Facturas",
        name: "reportesNomina",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "src/modules/reportes/ReportesNomina.vue"
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
