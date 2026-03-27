<template>
	<div class="page-header">
		<h2 class="page-title">Tambah Instruktur</h2>
		<p class="page-subtitle">Daftarkan instruktur baru</p>
	</div>

	<v-card class="form-card" rounded="xl">
		<v-card-text class="pa-6">
			<form @submit.prevent="store">
				<div class="form-grid">
					<div>
						<p class="field-label">Nama Instruktur</p>
						<v-text-field v-model="form.nama_instruktur" placeholder="Masukkan nama instruktur"
							variant="outlined" density="comfortable" color="orange" bg-color="#1a1a1a"
							:error-messages="errors.nama_instruktur" />
					</div>
					<div>
						<p class="field-label">Tanggal Lahir</p>
						<v-text-field v-model="form.tanggal_lahir" type="date" variant="outlined" density="comfortable"
							color="orange" bg-color="#1a1a1a" :error-messages="errors.tanggal_lahir" />
					</div>
					<div>
						<p class="field-label">Username</p>
						<v-text-field v-model="form.username" placeholder="Masukkan username" variant="outlined"
							density="comfortable" color="orange" bg-color="#1a1a1a" :error-messages="errors.username" />
					</div>
					<div>
						<p class="field-label">Password</p>
						<v-text-field v-model="form.password" :type="showPassword ? 'text' : 'password'"
							placeholder="Masukkan password" variant="outlined" density="comfortable" color="orange"
							bg-color="#1a1a1a" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
							@click:append-inner="showPassword = !showPassword" :error-messages="errors.password" />
					</div>
				</div>
				<v-divider class="my-6" style="border-color: rgba(255,255,255,0.06);" />
				<div class="form-actions">
					<v-btn variant="outlined" color="grey" rounded="lg"
						@click="router.push({ name: 'admin.instruktur.index' })">Batal</v-btn>
					<v-btn type="submit" :loading="loading" rounded="lg" class="save-btn">
						<v-icon start>mdi-content-save</v-icon>Simpan
					</v-btn>
				</div>
			</form>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '@/lib/axios'

const router = useRouter()
const toast = useToast()
const loading = ref(false)
const showPassword = ref(false)
const form = reactive({ nama_instruktur: '', tanggal_lahir: '', username: '', password: '' })
const errors = reactive<Record<string, string[]>>({})

async function store() {
	loading.value = true
	Object.keys(errors).forEach(k => delete errors[k])
	try {
		await api.post('https://gymflow-api-production.up.railway.app/api/instruktur', form)
		toast.success('Berhasil Tambah Instruktur!', { timeout: 2000 })
		router.push({ name: 'admin.instruktur.index' })
	} catch (e: any) {
		if (e.response?.data?.errors) Object.assign(errors, e.response.data.errors)
		else toast.error('Gagal menyimpan data.', { timeout: 2000 })
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
	gap: 12px;
}

.save-btn {
	background: linear-gradient(135deg, #f97316, #ea580c) !important;
	color: white !important;
}
</style>