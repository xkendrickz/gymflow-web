<template>
	<div class="page-header">
		<h2 class="page-title">Edit Jadwal Umum</h2>
		<p class="page-subtitle">Ubah hari dan jam kelas</p>
	</div>

	<v-card class="form-card" rounded="xl">
		<v-card-text class="pa-6">
			<div v-if="fetchLoading" class="d-flex justify-center pa-8">
				<v-progress-circular indeterminate color="orange" />
			</div>
			<form v-else @submit.prevent="update">
				<div class="form-grid">
					<div>
						<p class="field-label">Hari</p>
						<v-select v-model="form.hari"
							:items="['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']"
							variant="outlined" density="comfortable" color="orange" bg-color="#1a1a1a"
							:error-messages="errors.hari" />
					</div>
					<div>
						<p class="field-label">Jam</p>
						<v-text-field v-model="form.jam" type="time" variant="outlined" density="comfortable"
							color="orange" bg-color="#1a1a1a" :error-messages="errors.jam" />
					</div>
				</div>
				<v-divider class="my-6" style="border-color: rgba(255,255,255,0.06);" />
				<div class="form-actions">
					<v-btn variant="outlined" color="grey" rounded="lg"
						@click="router.push({ name: 'mo.jadwalUmum.index' })">Batal</v-btn>
					<v-btn type="submit" :loading="loading" rounded="lg" class="save-btn">
						<v-icon start>mdi-content-save</v-icon>Simpan
					</v-btn>
				</div>
			</form>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '@/lib/axios'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const id = route.params.id
const loading = ref(false)
const fetchLoading = ref(true)
const form = reactive({ hari: '', jam: '' })
const errors = reactive<Record<string, string[]>>({})

onMounted(async () => {
	try {
		const res = await api.get(`https://gymflow-api-production.up.railway.app/api/jadwalUmum/${id}`)
		form.hari = res.data.data.hari
		form.jam = res.data.data.jam
	} catch { toast.error('Gagal memuat data.', { timeout: 2000 }); router.push({ name: 'mo.jadwalUmum.index' }) }
	finally { fetchLoading.value = false }
})

async function update() {
	loading.value = true
	Object.keys(errors).forEach(k => delete errors[k])
	try {
		await api.put(`https://gymflow-api-production.up.railway.app/api/jadwalUmum/${id}`, form)
		toast.success('Berhasil Edit Jadwal!', { timeout: 2000 })
		router.push({ name: 'mo.jadwalUmum.index' })
	} catch (e: any) {
		if (e.response?.data?.errors) Object.assign(errors, e.response.data.errors)
		else toast.error('Gagal menyimpan jadwal.', { timeout: 2000 })
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