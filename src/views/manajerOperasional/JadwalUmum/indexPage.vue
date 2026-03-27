<template>
	<div class="page-header">
		<div>
			<h2 class="page-title">Jadwal Umum</h2>
			<p class="page-subtitle">Kelola jadwal kelas mingguan</p>
		</div>
		<v-btn :to="{ name: 'mo.jadwalUmum.create' }" rounded="lg" class="new-btn" prepend-icon="mdi-plus">
			Tambah Jadwal
		</v-btn>
	</div>

	<div v-if="loading" class="d-flex justify-center pa-8">
		<v-progress-circular indeterminate color="orange" />
	</div>

	<template v-else>
		<v-card class="table-card mb-4" rounded="xl">
			<v-card-text class="pa-6">
				<p class="section-label">🌅 MORNING CLASS (00:00 - 11:59)</p>
				<ScheduleTable :groups="morningGroups" @delete="confirmDelete" />
			</v-card-text>
		</v-card>

		<v-card class="table-card" rounded="xl">
			<v-card-text class="pa-6">
				<p class="section-label">🌆 EVENING CLASS (12:00 - 23:59)</p>
				<ScheduleTable :groups="eveningGroups" @delete="confirmDelete" />
			</v-card-text>
		</v-card>
	</template>

	<v-dialog v-model="deleteDialog" max-width="400">
		<v-card rounded="xl" style="background: #111111; border: 1px solid rgba(255,255,255,0.06);">
			<v-card-text class="pa-6">
				<p style="color: #f1f5f9; font-weight: 700; margin-bottom: 8px;">Hapus Jadwal?</p>
				<p style="color: #9ca3af; font-size: 0.875rem;">Tindakan ini tidak dapat dibatalkan.</p>
			</v-card-text>
			<v-card-actions class="px-6 pb-6 pt-0">
				<v-spacer />
				<v-btn variant="outlined" color="grey" rounded="lg" @click="deleteDialog = false">Batal</v-btn>
				<v-btn color="red" variant="flat" rounded="lg" :loading="deleteLoading"
					@click="deleteJadwal">Hapus</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import api from '@/lib/axios'

const router = useRouter()
const toast = useToast()
const jadwal = ref<any[]>([])
const loading = ref(true)
const deleteDialog = ref(false)
const deleteLoading = ref(false)
const toDeleteId = ref<number | null>(null)

// Group by hari-kelas
function groupBy(data: any[]) {
	const groups: Record<string, any[]> = {}
	data.forEach(item => {
		const key = `${item.hari}-${item.nama_kelas}`
		if (!groups[key]) groups[key] = []
		groups[key].push(item)
	})
	return Object.values(groups)
}

const morningGroups = computed(() =>
	groupBy(jadwal.value.filter(i => i.jam >= '00:00' && i.jam < '12:00'))
)
const eveningGroups = computed(() =>
	groupBy(jadwal.value.filter(i => i.jam >= '12:00' && i.jam <= '23:59'))
)

function formatDay(date: string) {
	return new Date(date).toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase()
}

onMounted(async () => {
	try {
		const res = await api.get('https://gymflow-api-production.up.railway.app/api/jadwalUmum')
		jadwal.value = res.data.data
	} catch { toast.error('Gagal memuat data.', { timeout: 2000 }) }
	finally { loading.value = false }
})

function confirmDelete(id: number) { toDeleteId.value = id; deleteDialog.value = true }

async function deleteJadwal() {
	if (!toDeleteId.value) return
	deleteLoading.value = true
	try {
		await api.delete(`https://gymflow-api-production.up.railway.app/api/jadwalUmum/${toDeleteId.value}`)
		jadwal.value = jadwal.value.filter(j => j.id_jadwal_umum !== toDeleteId.value)
		toast.success('Berhasil Hapus Jadwal!', { timeout: 2000 })
		deleteDialog.value = false
	} catch { toast.error('Gagal menghapus jadwal.', { timeout: 2000 }) }
	finally { deleteLoading.value = false }
}

// Inline component for table to avoid duplication
const ScheduleTable = defineComponent({
	props: { groups: Array },
	emits: ['delete'],
	setup(props, { emit }) {
		return () => h('div', { class: 'table-wrapper' },
			h('table', { class: 'data-table' }, [
				h('thead', h('tr', [
					h('th', 'Hari'), h('th', 'Jam'), h('th', 'Kelas'), h('th', 'Instruktur'), h('th', 'Aksi')
				])),
				h('tbody', (props.groups as any[]).length === 0
					? [h('tr', h('td', { colspan: 5, class: 'empty-row' }, 'Tidak ada jadwal.'))]
					: (props.groups as any[]).map(group =>
						h('tr', { key: group[0].id_jadwal_umum }, [
							h('td', formatDay(group[0].hari)),
							h('td', group[0].jam),
							h('td', group[0].nama_kelas),
							h('td', group[0].nama_instruktur),
							h('td', h('div', { class: 'action-btns' }, [
								h('v-btn', {
									to: { name: 'mo.jadwalUmum.edit', params: { id: group[0].id_jadwal_umum } },
									icon: true, variant: 'text', color: 'blue', size: 'small'
								}, h('v-icon', { size: 18 }, 'mdi-pencil')),
								h('v-btn', {
									icon: true, variant: 'text', color: 'red', size: 'small',
									onClick: () => emit('delete', group[0].id_jadwal_umum)
								}, h('v-icon', { size: 18 }, 'mdi-trash-can-outline'))
							]))
						])
					)
				)
			])
		)
	}
})
</script>

<style scoped>
.page-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24px;
}

.page-title {
	font-family: 'Montserrat', sans-serif;
	font-size: 1.5rem;
	font-weight: 800;
	color: #f1f5f9;
	margin: 0 0 4px;
}

.page-subtitle {
	font-size: 0.875rem;
	color: #6b7280;
	margin: 0;
}

.new-btn {
	background: linear-gradient(135deg, #f97316, #ea580c) !important;
	color: white !important;
}

.table-card {
	background: #111111 !important;
	border: 1px solid rgba(255, 255, 255, 0.06) !important;
}

.section-label {
	font-size: 0.7rem;
	font-weight: 600;
	color: #6b7280;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	margin-bottom: 16px;
}

.table-wrapper {
	overflow-x: auto;
}

.data-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.875rem;
}

.data-table th {
	text-align: left;
	padding: 10px 14px;
	font-size: 0.7rem;
	font-weight: 600;
	color: #6b7280;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	white-space: nowrap;
}

.data-table td {
	padding: 12px 14px;
	color: #d1d5db;
	border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.data-table tr:last-child td {
	border-bottom: none;
}

.action-btns {
	display: flex;
	gap: 2px;
}

.empty-row {
	text-align: center;
	color: #6b7280;
	padding: 20px !important;
}
</style>