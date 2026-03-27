<template>
	<div class="page-header">
		<h2 class="page-title">Reset & Expired</h2>
		<p class="page-subtitle">Kelola status kadaluarsa member dan instruktur</p>
	</div>

	<!-- Action buttons -->
	<div class="d-flex gap-3 mb-6">
		<v-btn :loading="loadingReset1" rounded="lg" class="reset-btn-danger" prepend-icon="mdi-refresh"
			@click="resetInstruktur">
			Reset Terlambat Instruktur
		</v-btn>
		<v-btn :loading="loadingReset2" rounded="lg" class="reset-btn-danger" prepend-icon="mdi-account-off"
			@click="resetMember">
			Deaktivasi Member & Reset Deposit
		</v-btn>
	</div>

	<div class="grid-2">
		<!-- Membercard Expired -->
		<v-card class="table-card" rounded="xl">
			<v-card-text class="pa-6">
				<p class="section-label">MEMBERCARD EXPIRED</p>
				<div v-if="loading" class="d-flex justify-center pa-4">
					<v-progress-circular indeterminate color="orange" size="24" />
				</div>
				<div v-else class="table-wrapper">
					<table class="data-table">
						<thead>
							<tr>
								<th>Nama Member</th>
								<th>Masa Aktif</th>
							</tr>
						</thead>
						<tbody>
							<tr v-if="aktivasi.length === 0">
								<td colspan="2" class="empty-row">Tidak ada data.</td>
							</tr>
							<tr v-for="(item, i) in aktivasi" :key="i">
								<td>{{ item.nama_member ?? '—' }}</td>
								<td><span class="expired-badge">{{ item.masa_aktif ?? '—' }}</span></td>
							</tr>
						</tbody>
					</table>
				</div>
			</v-card-text>
		</v-card>

		<!-- Deposit Paket Expired -->
		<v-card class="table-card" rounded="xl">
			<v-card-text class="pa-6">
				<p class="section-label">DEPOSIT PAKET EXPIRED</p>
				<div v-if="loading" class="d-flex justify-center pa-4">
					<v-progress-circular indeterminate color="orange" size="24" />
				</div>
				<div v-else class="table-wrapper">
					<table class="data-table">
						<thead>
							<tr>
								<th>Nama Member</th>
								<th>Berlaku Sampai</th>
							</tr>
						</thead>
						<tbody>
							<tr v-if="deposit.length === 0">
								<td colspan="2" class="empty-row">Tidak ada data.</td>
							</tr>
							<tr v-for="(item, i) in deposit" :key="i">
								<td>{{ item.nama_member ?? '—' }}</td>
								<td><span class="expired-badge">{{ item.berlaku_sampai ?? '—' }}</span></td>
							</tr>
						</tbody>
					</table>
				</div>
			</v-card-text>
		</v-card>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/lib/axios'

const toast = useToast()
const aktivasi = ref<any[]>([])
const deposit = ref<any[]>([])
const loading = ref(true)
const loadingReset1 = ref(false)
const loadingReset2 = ref(false)

onMounted(async () => {
	try {
		const [r1, r2] = await Promise.all([
			api.get('https://gymflow-api-production.up.railway.app/api/indexAktivasi'),
			api.get('https://gymflow-api-production.up.railway.app/api/indexDeposit'),
		])
		aktivasi.value = r1.data.data
		deposit.value = r2.data.data
	} catch { toast.error('Gagal memuat data.', { timeout: 2000 }) }
	finally { loading.value = false }
})

async function resetMember() {
	loadingReset2.value = true
	try {
		await api.post('https://gymflow-api-production.up.railway.app/api/resetMember')
		toast.success('Berhasil Reset Status Member dan Sisa Deposit Paket!', { timeout: 2000 })
	} catch { toast.error('Gagal reset member.', { timeout: 2000 }) }
	finally { loadingReset2.value = false }
}

async function resetInstruktur() {
	loadingReset1.value = true
	try {
		await api.post('https://gymflow-api-production.up.railway.app/api/resetInstruktur')
		toast.success('Berhasil Reset Waktu Terlambat Instruktur!', { timeout: 2000 })
	} catch { toast.error('Gagal reset instruktur.', { timeout: 2000 }) }
	finally { loadingReset1.value = false }
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

.reset-btn-danger {
	background: rgba(239, 68, 68, 0.15) !important;
	color: #ef4444 !important;
	border: 1px solid rgba(239, 68, 68, 0.3) !important;
}

.grid-2 {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
}

@media (max-width: 768px) {
	.grid-2 {
		grid-template-columns: 1fr;
	}
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
	padding: 8px 12px;
	font-size: 0.7rem;
	font-weight: 600;
	color: #6b7280;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.data-table td {
	padding: 10px 12px;
	color: #d1d5db;
	border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.data-table tr:last-child td {
	border-bottom: none;
}

.empty-row {
	text-align: center;
	color: #6b7280;
	padding: 20px !important;
}

.expired-badge {
	font-size: 0.75rem;
	color: #ef4444;
	background: rgba(239, 68, 68, 0.1);
	padding: 2px 8px;
	border-radius: 99px;
}
</style>