import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    role?: 'admin' | 'kasir' | 'mo' | 'member'
  }
}

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/components/LoginPage.vue'),
  },

  // Admin
  {
    path: '/admin',
    name: 'admin.beranda',
    component: () => import('@/components/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' as const },
    children: [
      {
        path: 'instruktur',
        name: 'admin.instruktur.index',
        component: () => import('@/views/Admin/Instruktur/indexPage.vue'),
      },
      {
        path: 'instruktur/create',
        name: 'admin.instruktur.create',
        component: () => import('@/views/Admin/Instruktur/createPage.vue'),
      },
      {
        path: 'instruktur/edit/:id',
        name: 'admin.instruktur.edit',
        component: () => import('@/views/Admin/Instruktur/editPage.vue'),
      },
    ],
  },

  // Kasir
  {
    path: '/kasir',
    name: 'kasir.beranda',
    component: () => import('@/components/KasirDashboard.vue'),
    meta: { requiresAuth: true, role: 'kasir' as const },
    children: [
      {
        path: 'member',
        name: 'kasir.member.index',
        component: () => import('@/views/Kasir/Member/indexPage.vue'),
      },
      {
        path: 'member/create',
        name: 'kasir.member.create',
        component: () => import('@/views/Kasir/Member/createPage.vue'),
      },
      {
        path: 'member/edit/:id',
        name: 'kasir.member.edit',
        component: () => import('@/views/Kasir/Member/editPage.vue'),
      },
      {
        path: 'aktivasi',
        name: 'kasir.aktivasi',
        component: () => import('@/views/Kasir/Transaksi/aktivasiPage.vue'),
      },
      {
        path: 'depositReguler',
        name: 'kasir.depositreguler',
        component: () => import('@/views/Kasir/Transaksi/depositRegulerPage.vue'),
      },
      {
        path: 'depositKelas',
        name: 'kasir.depositkelas',
        component: () => import('@/views/Kasir/Transaksi/depositKelasPage.vue'),
      },
      {
        path: 'reset',
        name: 'kasir.reset',
        component: () => import('@/views/Kasir/resetPage.vue'),
      },
      {
        path: 'presensi/gym',
        name: 'kasir.presensiGym',
        component: () => import('@/views/Kasir/Presensi/PresensiGym.vue'),
      },
      {
        path: 'presensi/kelas',
        name: 'kasir.presensiKelas',
        component: () => import('@/views/Kasir/Presensi/PresensiKelas.vue'),
      },
    ],
  },

  // MO
  {
    path: '/mo',
    name: 'mo.beranda',
    component: () => import('@/components/MODashboard.vue'),
    meta: { requiresAuth: true, role: 'mo' as const },
    children: [
      {
        path: 'jadwalUmum',
        name: 'mo.jadwalUmum.index',
        component: () => import('@/views/manajerOperasional/JadwalUmum/indexPage.vue'),
      },
      {
        path: 'jadwalUmum/create',
        name: 'mo.jadwalUmum.create',
        component: () => import('@/views/manajerOperasional/JadwalUmum/createPage.vue'),
      },
      {
        path: 'jadwalUmum/edit/:id',
        name: 'mo.jadwalUmum.edit',
        component: () => import('@/views/manajerOperasional/JadwalUmum/editPage.vue'),
      },
      {
        path: 'jadwalHarian',
        name: 'mo.jadwalHarian.index',
        component: () => import('@/views/manajerOperasional/JadwalHarian/indexPage.vue'),
      },
      {
        path: 'jadwalHarian/edit/:id',
        name: 'mo.jadwalHarian.edit',
        component: () => import('@/views/manajerOperasional/JadwalHarian/editPage.vue'),
      },
      {
        path: 'izin',
        name: 'mo.izin.index',
        component: () => import('@/views/manajerOperasional/Izin/indexPage.vue'),
      },
      {
        path: 'laporan/pendapatan',
        name: 'mo.laporan.pendapatan',
        component: () => import('@/views/manajerOperasional/Laporan/laporanPendapatanPage.vue'),
      },
      {
        path: 'laporan/aktivitasKelas',
        name: 'mo.laporan.aktivitasKelas',
        component: () => import('@/views/manajerOperasional/Laporan/laporanAktivitasKelasPage.vue'),
      },
      {
        path: 'laporan/aktivitasGym',
        name: 'mo.laporan.aktivitasGym',
        component: () => import('@/views/manajerOperasional/Laporan/laporanAktivitasGymPage.vue'),
      },
      {
        path: 'laporan/kinerja',
        name: 'mo.laporan.kinerja',
        component: () =>
          import('@/views/manajerOperasional/Laporan/laporanKinerjaInstrukturPage.vue'),
      },
    ],
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next({ name: 'login' })
  } else if (to.meta.role && auth.role !== to.meta.role) {
    next({ name: 'login' }) // or redirect to their correct dashboard
  } else {
    next()
  }
})

export default router
