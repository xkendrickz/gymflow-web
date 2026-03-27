<template>
	<div class="page-header">
		<h2 class="page-title">Deposit Reguler</h2>
		<p class="page-subtitle">Proses deposit reguler member</p>
	</div>

	<v-card class="form-card" rounded="xl">
		<v-card-text class="pa-6">
			<form @submit.prevent="store">
				<div class="form-grid">
					<div>
						<p class="field-label">Member</p>
						<v-select v-model="form.id_member" :items="members" item-title="nama_member"
							item-value="id_member" placeholder="Pilih member" variant="outlined" density="comfortable"
							color="orange" bg-color="#1a1a1a" :error-messages="errors.id_member" />
					</div>
					<div>
						<p class="field-label">Kasir</p>
						<v-select v-model="form.id_pegawai" :items="pegawais" item-title="nama_pegawai"
							item-value="id_pegawai" placeholder="Pilih kasir" variant="outlined" density="comfortable"
							color="orange" bg-color="#1a1a1a" :error-messages="errors.id_pegawai" />
					</div>
					<div>
						<p class="field-label">Jumlah Deposit (Rp)</p>
						<v-text-field v-model="form.deposit" type="number" placeholder="Masukkan jumlah deposit"
							variant="outlined" density="comfortable" color="orange" bg-color="#1a1a1a"
							:error-messages="errors.deposit" />
					</div>
				</div>
				<v-divider class="my-6" style="border-color: rgba(255,255,255,0.06);" />
				<div class="form-actions">
					<v-btn type="submit" :loading="loading" rounded="lg" class="save-btn" prepend-icon="mdi-cash-plus">
						Proses Deposit
					</v-btn>
				</div>
			</form>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/lib/axios'

const toast = useToast()
const loading = ref(false)
const members = ref<any[]>([])
const pegawais = ref<any[]>([])
const form = reactive({ id_member: '', id_pegawai: '', deposit: '' })
const errors = reactive<Record<string, string[]>>({})

onMounted(async () => {
	try {
		const [r1, r2] = await Promise.all([api.get('https://gymflow-api-production.up.railway.app/api/member'), api.get('https://gymflow-api-production.up.railway.app/api/pegawai')])
		members.value = r1.data.data
		pegawais.value = r2.data.data
	} catch { toast.error('Gagal memuat data.', { timeout: 2000 }) }
})

async function store() {
	loading.value = true
	Object.keys(errors).forEach(k => delete errors[k])
	try {
		await api.post('https://gymflow-api-production.up.railway.app/api/depositReguler', form)
		toast.success('Berhasil Deposit Reguler!', { timeout: 2000 })
		form.id_member = ''
		form.id_pegawai = ''
		form.deposit = ''
	} catch (e: any) {
		if (e.response?.data?.errors) Object.assign(errors, e.response.data.errors)
		else toast.error('Gagal memproses deposit.', { timeout: 2000 })
	} finally { loading.value = false }
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

.form-card {
	background: #111111 !important;
	border: 1px solid rgba(255, 255, 255, 0.06) !important;
}

.form-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 4px 24px;
}

@media (max-width: 768px) {
	.form-grid {
		grid-template-columns: 1fr;
	}
}

.field-label {
	font-size: 0.75rem;
	font-weight: 600;
	color: #9ca3af;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	margin-bottom: 4px;
}

.form-actions {
	display: flex;
	justify-content: flex-end;
}

.save-btn {
	background: linear-gradient(135deg, #f97316, #ea580c) !important;
	color: white !important;
}
</style>