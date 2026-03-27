<template>
	<div class="page-header">
		<div>
			<h2 class="page-title">Instruktur</h2>
			<p class="page-subtitle">Kelola data instruktur gym</p>
		</div>
		<v-btn :to="{ name: 'admin.instruktur.create' }" rounded="lg" class="new-btn" prepend-icon="mdi-plus">
			Tambah Instruktur
		</v-btn>
	</div>

	<v-card class="table-card" rounded="xl">
		<v-card-text class="pa-6">
			<v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Cari nama instruktur..."
				variant="outlined" density="comfortable" color="orange" bg-color="#1a1a1a" class="mb-4"
				style="max-width: 400px;" hide-details />

			<div v-if="loading" class="d-flex justify-center pa-8">
				<v-progress-circular indeterminate color="orange" />
			</div>

			<div v-else class="table-wrapper">
				<table class="data-table">
					<thead>
						<tr>
							<th>Nama Instruktur</th>
							<th>Username</th>
							<th>Tanggal Lahir</th>
							<th>Aksi</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="filtered.length === 0">
							<td colspan="4" class="empty-row">Tidak ada data instruktur.</td>
						</tr>
						<tr v-for="item in filtered" :key="item.id_instruktur">
							<td class="font-weight-medium">{{ item.nama_instruktur }}</td>
							<td>{{ item.username ?? '—' }}</td>
							<td>{{ item.tanggal_lahir ?? '—' }}</td>
							<td>
								<div class="action-btns">
									<v-btn :to="{ name: 'admin.instruktur.edit', params: { id: item.id_instruktur } }"
										icon variant="text" color="blue" size="small">
										<v-icon size="18">mdi-pencil</v-icon>
									</v-btn>
									<v-btn icon variant="text" color="red" size="small" @click="confirmDelete(item)">
										<v-icon size="18">mdi-trash-can-outline</v-icon>
									</v-btn>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</v-card-text>
	</v-card>

	<!-- Delete dialog -->
	<v-dialog v-model="deleteDialog" max-width="400">
		<v-card rounded="xl" style="background: #111111; border: 1px solid rgba(255,255,255,0.06);">
			<v-card-text class="pa-6">
				<div class="d-flex align-center gap-3 mb-4">
					<div class="delete-icon-wrap"><v-icon color="red" size="24">mdi-alert-circle</v-icon></div>
					<div>
						<p class="dialog-title">Hapus Instruktur</p>
						<p class="dialog-subtitle">Tindakan ini tidak dapat dibatalkan.</p>
					</div>
				</div>
				<p class="text-sm" style="color: #9ca3af;">
					Yakin ingin menghapus <strong style="color: #f1f5f9;">{{ toDelete?.nama_instruktur }}</strong>?
				</p>
			</v-card-text>
			<v-card-actions class="px-6 pb-6 pt-0 gap-3">
				<v-spacer />
				<v-btn variant="outlined" color="grey" rounded="lg" @click="deleteDialog = false">Batal</v-btn>
				<v-btn color="red" variant="flat" rounded="lg" :loading="deleteLoading"
					@click="deleteInstruktur">Hapus</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/lib/axios'

const toast = useToast()
const items = ref<any[]>([])
const search = ref('')
const loading = ref(true)
const deleteDialog = ref(false)
const deleteLoading = ref(false)
const toDelete = ref<any>(null)

const filtered = computed(() =>
	items.value.filter(i => i.nama_instruktur?.toLowerCase().includes(search.value.toLowerCase()))
)

onMounted(async () => {
	try {
		const res = await api.get('https://gymflow-api-production.up.railway.app/api/instruktur')
		items.value = res.data.data
	} catch { toast.error('Gagal memuat data.', { timeout: 2000 }) }
	finally { loading.value = false }
})

function confirmDelete(item: any) { toDelete.value = item; deleteDialog.value = true }

async function deleteInstruktur() {
	if (!toDelete.value) return
	deleteLoading.value = true
	try {
		await api.delete(`https://gymflow-api-production.up.railway.app/api/instruktur/${toDelete.value.id_instruktur}`)
		items.value = items.value.filter(i => i.id_instruktur !== toDelete.value.id_instruktur)
		toast.error('Berhasil Hapus Instruktur!', { timeout: 2000 })
		deleteDialog.value = false
	} catch { toast.error('Gagal menghapus instruktur.', { timeout: 2000 }) }
	finally { deleteLoading.value = false }
}
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
	white-space: nowrap;
}

.data-table tr:hover td {
	background: rgba(255, 255, 255, 0.02);
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
	padding: 32px !important;
}

.delete-icon-wrap {
	width: 44px;
	height: 44px;
	border-radius: 12px;
	background: rgba(239, 68, 68, 0.1);
	display: grid;
	place-items: center;
	flex-shrink: 0;
}

.dialog-title {
	font-size: 1rem;
	font-weight: 700;
	color: #f1f5f9;
	margin: 0;
}

.dialog-subtitle {
	font-size: 0.8rem;
	color: #6b7280;
	margin: 0;
}
</style>