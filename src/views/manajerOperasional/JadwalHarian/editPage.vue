<template>
	<div class="page-header">
		<h2 class="page-title">Edit Jadwal Harian</h2>
		<p class="page-subtitle">Ubah status kelas hari ini</p>
	</div>

	<v-card class="form-card" rounded="xl">
		<v-card-text class="pa-6">
			<div v-if="fetchLoading" class="d-flex justify-center pa-8">
				<v-progress-circular indeterminate color="orange" />
			</div>
			<form v-else @submit.prevent="update">
				<div>
					<p class="field-label">Status Kelas</p>
					<v-select v-model="form.status" :items="['Libur', 'Digantikan']" placeholder="Pilih status"
						variant="outlined" density="comfortable" color="orange" bg-color="#1a1a1a"
						:error-messages="errors.status" />
				</div>
				<v-divider class="my-6" style="border-color: rgba(255,255,255,0.06);" />
				<div class="form-actions">
					<v-btn variant="outlined" color="grey" rounded="lg"
						@click="router.push({ name: 'mo.jadwalHarian.index' })">Batal</v-btn>
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
const form = reactive({ status: '' })
const errors = reactive<Record<string, string[]>>({})

onMounted(async () => {
	try {
		const res = await api.get(`https://gymflow-api-production.up.railway.app/api/jadwalHarian/${id}`)
		form.status = res.data.data[0]?.status ?? ''
	} catch { toast.error('Gagal memuat data.', { timeout: 2000 }) }
	finally { fetchLoading.value = false }
})

async function update() {
	loading.value = true
	Object.keys(errors).forEach(k => delete errors[k])
	try {
		await api.put(`https://gymflow-api-production.up.railway.app/api/jadwalHarian/${id}`, form)
		toast.success('Berhasil Edit Jadwal!', { timeout: 2000 })
		router.push({ name: 'mo.jadwalHarian.index' })
	} catch (e: any) {
		if (e.response?.data?.errors) Object.assign(errors, e.response.data.errors)
		else toast.error('Gagal menyimpan.', { timeout: 2000 })
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