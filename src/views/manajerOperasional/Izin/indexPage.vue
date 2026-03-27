<template>
	<div class="page-header">
		<h2 class="page-title">Izin Instruktur</h2>
		<p class="page-subtitle">Kelola pengajuan izin instruktur</p>
	</div>

	<div v-if="loading" class="d-flex justify-center pa-8">
		<v-progress-circular indeterminate color="orange" />
	</div>

	<template v-else>
		<!-- Confirmed -->
		<v-card class="table-card mb-4" rounded="xl">
			<v-card-text class="pa-6">
				<p class="section-label">✓ SUDAH DIKONFIRMASI</p>
				<div class="table-wrapper">
					<table class="data-table">
						<thead>
							<tr>
								<th>Instruktur</th>
								<th>Detail Izin</th>
								<th>Tanggal</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							<tr v-if="confirmed.length === 0">
								<td colspan="4" class="empty-row">Tidak ada izin terkonfirmasi.</td>
							</tr>
							<tr v-for="item in confirmed" :key="item.id_izin">
								<td>{{ item.nama_instruktur }}</td>
								<td>{{ item.detail_izin }}</td>
								<td>{{ item.tanggal_izin }}</td>
								<td><span class="status-badge status-active">Dikonfirmasi</span></td>
							</tr>
						</tbody>
					</table>
				</div>
			</v-card-text>
		</v-card>

		<!-- Unconfirmed -->
		<v-card class="table-card" rounded="xl">
			<v-card-text class="pa-6">
				<p class="section-label">⏳ MENUNGGU KONFIRMASI</p>
				<div class="table-wrapper">
					<table class="data-table">
						<thead>
							<tr>
								<th>Instruktur</th>
								<th>Detail Izin</th>
								<th>Tanggal</th>
								<th>Status</th>
								<th>Aksi</th>
							</tr>
						</thead>
						<tbody>
							<tr v-if="unconfirmed.length === 0">
								<td colspan="5" class="empty-row">Tidak ada pengajuan baru.</td>
							</tr>
							<tr v-for="item in unconfirmed" :key="item.id_izin">
								<td>{{ item.nama_instruktur }}</td>
								<td>{{ item.detail_izin }}</td>
								<td>{{ item.tanggal_izin }}</td>
								<td><span class="status-badge status-pending">Menunggu</span></td>
								<td>
									<v-btn size="small" rounded="lg" class="konfirmasi-btn"
										:loading="processingId === item.id_izin" @click="konfirmasi(item.id_izin)">
										Konfirmasi
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
const izin = ref<any[]>([])
const loading = ref(true)
const processingId = ref<number | null>(null)

const confirmed = computed(() => izin.value.filter(i => i.konfirmasi === 1))
const unconfirmed = computed(() => izin.value.filter(i => i.konfirmasi === 0))

onMounted(async () => {
	try {
		const res = await api.get('https://gymflow-api-production.up.railway.app/api/izin')
		izin.value = res.data.data
	} catch { toast.error('Gagal memuat data.', { timeout: 2000 }) }
	finally { loading.value = false }
})

async function konfirmasi(id: number) {
	processingId.value = id
	try {
		await api.put(`https://gymflow-api-production.up.railway.app/api/izin/${id}`)
		const item = izin.value.find(i => i.id_izin === id)
		if (item) item.konfirmasi = 1
		toast.success('Izin berhasil dikonfirmasi!', { timeout: 2000 })
	} catch { toast.error('Gagal konfirmasi izin.', { timeout: 2000 }) }
	finally { processingId.value = null }
}
</script>

<style scoped>
.page-header {
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

.status-pending {
	background: rgba(234, 179, 8, 0.1);
	color: #eab308;
}

.konfirmasi-btn {
	background: linear-gradient(135deg, #f97316, #ea580c) !important;
	color: white !important;
	font-size: 0.75rem !important;
}

.empty-row {
	text-align: center;
	color: #6b7280;
	padding: 20px !important;
}
</style>