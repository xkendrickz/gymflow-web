<template>
	<DashboardLayout :nav-groups="navGroups" role-label="Manajer Operasional" />
</template>

<script setup lang="ts">
import DashboardLayout from '@/components/DashboardLayout.vue'

const navGroups = [
	{
		label: 'Jadwal',
		items: [
			{ name: 'mo.jadwalUmum', label: 'Jadwal Umum', icon: 'mdi-calendar-clock', route: 'mo.jadwalUmum.index' },
			{ name: 'mo.jadwalHarian', label: 'Jadwal Harian', icon: 'mdi-calendar-today', route: 'mo.jadwalHarian.index' },
		],
	},
	{
		label: 'SDM',
		items: [
			{ name: 'mo.izin', label: 'Izin', icon: 'mdi-account-clock', route: 'mo.izin.index' },
		],
	},
	{
		label: 'Laporan',
		items: [
			{ name: 'mo.laporan.pendapatan', label: 'Pendapatan', icon: 'mdi-chart-line', route: 'mo.laporan.pendapatan' },
			{ name: 'mo.laporan.aktivitasKelas', label: 'Aktivitas Kelas', icon: 'mdi-human-handsup', route: 'mo.laporan.aktivitasKelas' },
			{ name: 'mo.laporan.aktivitasGym', label: 'Aktivitas Gym', icon: 'mdi-dumbbell', route: 'mo.laporan.aktivitasGym' },
			{ name: 'mo.laporan.kinerja', label: 'Kinerja Instruktur', icon: 'mdi-account-star', route: 'mo.laporan.kinerja' },
		],
	},
]
</script>