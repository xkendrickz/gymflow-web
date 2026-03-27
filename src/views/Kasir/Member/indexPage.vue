<template>
	<div class="page-header">
		<div>
			<h2 class="page-title">Member</h2>
			<p class="page-subtitle">Manage all registered gym members</p>
		</div>
		<v-btn :to="{ name: 'kasir.member.create' }" rounded="lg" class="new-btn" prepend-icon="mdi-plus">
			New Member
		</v-btn>
	</div>

	<v-card class="table-card" rounded="xl">
		<v-card-text class="pa-6">

			<!-- Search -->
			<v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Cari nama member..."
				variant="outlined" density="comfortable" color="orange" bg-color="#1a1a1a" class="mb-4"
				style="max-width: 400px;" hide-details />

			<!-- Loading -->
			<div v-if="loading" class="d-flex justify-center pa-8">
				<v-progress-circular indeterminate color="orange" />
			</div>

			<!-- Table -->
			<div v-else class="table-wrapper">
				<table class="data-table">
					<thead>
						<tr>
							<th>Member ID</th>
							<th>Nama</th>
							<th>Status</th>
							<th>Telepon</th>
							<th>Email</th>
							<th>Tanggal Lahir</th>
							<th>Tanggal Daftar</th>
							<th>Aksi</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="filtered.length === 0">
							<td colspan="8" class="empty-row">Tidak ada data member.</td>
						</tr>
						<tr v-for="m in filtered" :key="m.id_member">
							<td><span class="member-id">{{ m.member_id }}</span></td>
							<td class="font-weight-medium">{{ m.nama_member }}</td>
							<td>
								<span
									:class="['status-badge', m.status === 'aktif' ? 'status-active' : 'status-inactive']">
									{{ m.status }}
								</span>
							</td>
							<td>{{ m.telepon ?? '—' }}</td>
							<td>{{ m.email ?? '—' }}</td>
							<td>{{ m.tanggal_lahir ?? '—' }}</td>
							<td>{{ m.tanggal_daftar ?? '—' }}</td>
							<td>
								<div class="action-btns">
									<v-btn :to="{ name: 'kasir.member.edit', params: { id: m.id_member } }" icon
										variant="text" color="blue" size="small">
										<v-icon size="18">mdi-pencil</v-icon>
									</v-btn>
									<v-btn icon variant="text" color="red" size="small" @click="confirmDelete(m)">
										<v-icon size="18">mdi-trash-can-outline</v-icon>
									</v-btn>
									<v-btn icon variant="text" color="orange" size="small"
										@click="printCard(m.id_member)">
										<v-icon size="18">mdi-card-account-details</v-icon>
									</v-btn>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

		</v-card-text>
	</v-card>

	<!-- Delete confirm dialog -->
	<v-dialog v-model="deleteDialog" max-width="400">
		<v-card rounded="xl" style="background: #111111; border: 1px solid rgba(255,255,255,0.06);">
			<v-card-text class="pa-6">
				<div class="d-flex align-center gap-3 mb-4">
					<div class="delete-icon-wrap">
						<v-icon color="red" size="24">mdi-alert-circle</v-icon>
					</div>
					<div>
						<p class="dialog-title">Hapus Member</p>
						<p class="dialog-subtitle">Tindakan ini tidak dapat dibatalkan.</p>
					</div>
				</div>
				<p class="text-sm" style="color: #9ca3af;">
					Yakin ingin menghapus member <strong style="color: #f1f5f9;">{{ toDelete?.nama_member }}</strong>?
				</p>
			</v-card-text>
			<v-card-actions class="px-6 pb-6 pt-0 gap-3">
				<v-spacer />
				<v-btn variant="outlined" color="grey" rounded="lg" @click="deleteDialog = false">Batal</v-btn>
				<v-btn color="red" variant="flat" rounded="lg" :loading="deleteLoading"
					@click="deleteMember">Hapus</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/lib/axios'

const toast = useToast()
const members = ref<any[]>([])
const search = ref('')
const loading = ref(true)
const deleteDialog = ref(false)
const deleteLoading = ref(false)
const toDelete = ref<any>(null)

const filtered = computed(() =>
	members.value.filter(m =>
		m.nama_member?.toLowerCase().includes(search.value.toLowerCase())
	)
)

onMounted(async () => {
	try {
		const res = await api.get('https://gymflow-api-production.up.railway.app/api/member')
		members.value = res.data.data
	} catch {
		toast.error('Gagal memuat data member.', { timeout: 2000 })
	} finally {
		loading.value = false
	}
})

function confirmDelete(member: any) {
	toDelete.value = member
	deleteDialog.value = true
}

async function deleteMember() {
	if (!toDelete.value) return
	deleteLoading.value = true
	try {
		await api.delete(`https://gymflow-api-production.up.railway.app/api/member/${toDelete.value.id_member}`)
		members.value = members.value.filter(m => m.id_member !== toDelete.value.id_member)
		toast.error('Berhasil Hapus Member!', { timeout: 2000 })
		deleteDialog.value = false
	} catch {
		toast.error('Gagal menghapus member.', { timeout: 2000 })
	} finally {
		deleteLoading.value = false
	}
}

async function printCard(id: number) {
	try {
		const res = await api.get(`https://gymflow-api-production.up.railway.app/api/member/${id}`)
		const m = res.data.data
		const popup = window.open('', '_blank')
		if (!popup) return
		popup.document.write(`
      <html><head><title>Member Card</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; display: flex; justify-content: center; padding: 40px; }
        .card { width: 320px; background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .gym-name { font-size: 20px; font-weight: 800; color: #f97316; margin: 0 0 2px; }
        .address { font-size: 11px; color: #9ca3af; margin: 0 0 16px; }
        .divider { border: none; border-top: 1px solid #e5e7eb; margin: 12px 0; }
        .label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
        .value { font-size: 13px; color: #111; font-weight: 500; margin-bottom: 8px; }
        .badge { display: inline-block; background: #f97316; color: white; font-size: 10px; padding: 2px 10px; border-radius: 99px; font-weight: 600; }
      </style></head><body>
      <div class="card">
        <p class="gym-name">GymFlow</p>
        <p class="address">Jl. Qlipoth Tree No. 5, Yogyakarta</p>
        <span class="badge">MEMBER CARD</span>
        <hr class="divider">
        <p class="label">Member ID</p><p class="value">${m.member_id}</p>
        <p class="label">Nama</p><p class="value">${m.nama_member}</p>
        <p class="label">Alamat</p><p class="value">${m.alamat ?? '—'}</p>
        <p class="label">Telepon</p><p class="value">${m.telepon ?? '—'}</p>
      </div>
      </body></html>
    `)
		popup.document.close()
		popup.focus()
		popup.print()
		popup.close()
	} catch {
		toast.error('Gagal mencetak member card.', { timeout: 2000 })
	}
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

.member-id {
	font-family: monospace;
	font-size: 0.8rem;
	color: #f97316;
	background: rgba(249, 115, 22, 0.1);
	padding: 2px 8px;
	border-radius: 4px;
}

.status-badge {
	font-size: 0.7rem;
	font-weight: 600;
	padding: 3px 10px;
	border-radius: 99px;
	text-transform: capitalize;
}

.status-active {
	background: rgba(34, 197, 94, 0.1);
	color: #22c55e;
}

.status-inactive {
	background: rgba(239, 68, 68, 0.1);
	color: #ef4444;
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