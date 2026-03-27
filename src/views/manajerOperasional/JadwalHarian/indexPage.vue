<template>
	<div class="page-header">
		<div>
			<h2 class="page-title">Jadwal Harian</h2>
			<p class="page-subtitle">Jadwal kelas minggu ini</p>
		</div>
		<div class="d-flex align-center gap-3">
			<v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Cari kelas..."
				variant="outlined" density="compact" color="orange" bg-color="#1a1a1a" hide-details
				style="max-width: 240px;" />
			<v-btn :loading="generating" :disabled="generateDisabled" rounded="lg" class="generate-btn"
				prepend-icon="mdi-refresh" @click="generate">
				Generate
			</v-btn>
		</div>
	</div>

	<div v-if="loading" class="d-flex justify-center pa-8">
		<v-progress-circular indeterminate color="orange" />
	</div>

	<template v-else>
		<v-card class="table-card mb-4" rounded="xl">
			<v-card-text class="pa-6">
				<p class="section-label">🌅 MORNING CLASS</p>
				<div class="table-wrapper">
					<table class="data-table">
						<thead>
							<tr>
								<th>Tanggal</th>
								<th>Jam</th>
								<th>Kelas</th>
								<th>Instruktur</th>
								<th>Status</th>
								<th>Aksi</th>
							</tr>
						</thead>
						<tbody>
							<tr v-if="morningGroups.length === 0">
								<td colspan="6" class="empty-row">Tidak ada jadwal.</td>
							</tr>
							<tr v-for="group in morningGroups" :key="group[0].id_jadwal_harian">
								<td>{{ formatDay(group[0].hari) }}</td>
								<td>{{ group[0].jam }}</td>
								<td>{{ group[0].nama_kelas }}</td>
								<td>{{ group[0].nama_instruktur }}</td>
								<td>
									<span v-if="group[0].status"
										:class="['status-badge', group[0].status === 'Libur' ? 'status-libur' : 'status-diganti']">
										{{ group[0].status }}
									</span>
									<span v-else class="status-badge status-active">Aktif</span>
								</td>
								<td>
									<v-btn
										:to="{ name: 'mo.jadwalHarian.edit', params: { id: group[0].id_jadwal_harian } }"
										icon variant="text" color="blue" size="small">
										<v-icon size="18">mdi-pencil</v-icon>
									</v-btn>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</v-card-text>
		</v-card>

		<v-card class="table-card" rounded="xl">
			<v-card-text class="pa-6">
				<p class="section-label">🌆 EVENING CLASS</p>
				<div class="table-wrapper">
					<table class="data-table">
						<thead>
							<tr>
								<th>Tanggal</th>
								<th>Jam</th>
								<th>Kelas</th>
								<th>Instruktur</th>
								<th>Status</th>
								<th>Aksi</th>
							</tr>
						</thead>
						<tbody>
							<tr v-if="eveningGroups.length === 0">
								<td colspan="6" class="empty-row">Tidak ada jadwal.</td>
							</tr>
							<tr v-for="group in eveningGroups" :key="group[0].id_jadwal_harian">
								<td>{{ formatDay(group[0].hari) }}</td>
								<td>{{ group[0].jam }}</td>
								<td>{{ group[0].nama_kelas }}</td>
								<td>{{ group[0].nama_instruktur }}</td>
								<td>
									<span v-if="group[0].status"
										:class="['status-badge', group[0].status === 'Libur' ? 'status-libur' : 'status-diganti']">
										{{ group[0].status }}
									</span>
									<span v-else class="status-badge status-active">Aktif</span>
								</td>
								<td>
									<v-btn
										:to="{ name: 'mo.jadwalHarian.edit', params: { id: group[0].id_jadwal_harian } }"
										icon variant="text" color="blue" size="small">
										<v-icon size="18">mdi-pencil</v-icon>
									</v-btn>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</v-card-text>
		</v-card>
	</template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/lib/axios'

const toast = useToast()
const jadwal = ref<any[]>([])
const search = ref('')
const loading = ref(true)
const generating = ref(false)

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
const lastAccess = localStorage.getItem('jadwalHarianLastAccess')
const generateDisabled = ref(lastAccess ? (Date.now() - new Date(lastAccess).getTime()) < ONE_WEEK_MS : false)

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
	groupBy(jadwal.value.filter(i =>
		i.jam >= '00:00' && i.jam < '12:00' &&
		i.nama_kelas?.toLowerCase().includes(search.value.toLowerCase())
	))
)
const eveningGroups = computed(() =>
	groupBy(jadwal.value.filter(i =>
		i.jam >= '12:00' && i.jam <= '23:59' &&
		i.nama_kelas?.toLowerCase().includes(search.value.toLowerCase())
	))
)

function formatDay(date: string) {
	return new Date(date).toLocaleDateString('id-ID', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()
}

onMounted(async () => {
	try {
		const res = await api.get('https://gymflow-api-production.up.railway.app/api/jadwalHarian')
		jadwal.value = res.data.data
	} catch { toast.error('Gagal memuat data.', { timeout: 2000 }) }
	finally { loading.value = false }
})

async function generate() {
	generating.value = true
	try {
		await api.post('https://gymflow-api-production.up.railway.app/api/jadwalHarian')
		localStorage.setItem('jadwalHarianLastAccess', new Date().toString())
		generateDisabled.value = true
		const res = await api.get('https://gymflow-api-production.up.railway.app/api/jadwalHarian')
		jadwal.value = res.data.data
		toast.success('Berhasil Generate Jadwal Harian!', { timeout: 2000 })
	} catch { toast.error('Gagal generate jadwal.', { timeout: 2000 }) }
	finally { generating.value = false }
}
</script>

<style scoped>
.page-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24px;
	flex-wrap: wrap;
	gap: 12px;
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

.generate-btn {
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

.status-badge {
	font-size: 0.7rem;
	font-weight: 600;
	padding: 3px 10px;
	border-radius: 99px;
}

.status-active {
	background: rgba(34, 197, 94, 0.1);
	color: #22c55e;
}

.status-libur {
	background: rgba(239, 68, 68, 0.1);
	color: #ef4444;
}

.status-diganti {
	background: rgba(234, 179, 8, 0.1);
	color: #eab308;
}

.empty-row {
	text-align: center;
	color: #6b7280;
	padding: 20px !important;
}
</style>