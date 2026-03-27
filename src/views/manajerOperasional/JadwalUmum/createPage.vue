<template>
	<div class="page-header">
		<h2 class="page-title">Tambah Jadwal Umum</h2>
		<p class="page-subtitle">Tambah jadwal kelas mingguan</p>
	</div>

	<v-card class="form-card" rounded="xl">
		<v-card-text class="pa-6">
			<form @submit.prevent="store">
				<div class="form-grid">
					<div>
						<p class="field-label">Hari</p>
						<v-select v-model="form.hari"
							:items="['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']"
							placeholder="Pilih hari" variant="outlined" density="comfortable" color="orange"
							bg-color="#1a1a1a" :error-messages="errors.hari" />
					</div>
					<div>
						<p class="field-label">Kelas</p>
						<v-select v-model="form.id_kelas" :items="kelass" item-title="nama_kelas" item-value="id_kelas"
							placeholder="Pilih kelas" variant="outlined" density="comfortable" color="orange"
							bg-color="#1a1a1a" :error-messages="errors.id_kelas" />
					</div>
					<div>
						<p class="field-label">Instruktur</p>
						<v-select v-model="form.id_instruktur" :items="instrukturs" item-title="nama_instruktur"
							item-value="id_instruktur" placeholder="Pilih instruktur" variant="outlined"
							density="comfortable" color="orange" bg-color="#1a1a1a"
							:error-messages="errors.id_instruktur" />
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
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '@/lib/axios'

const router = useRouter()
const toast = useToast()
const loading = ref(false)
const kelass = ref<any[]>([])
const instrukturs = ref<any[]>([])
const form = reactive({ hari: '', id_kelas: '', id_instruktur: '', jam: '' })
const errors = reactive<Record<string, string[]>>({})

onMounted(async () => {
	try {
		const [r1, r2] = await Promise.all([api.get('https://gymflow-api-production.up.railway.app/api/kelas'), api.get('https://gymflow-api-production.up.railway.app/api/instruktur')])
		kelass.value = r1.data.data
		instrukturs.value = r2.data.data
	} catch { toast.error('Gagal memuat data.', { timeout: 2000 }) }
})

async function store() {
	loading.value = true
	Object.keys(errors).forEach(k => delete errors[k])
	try {
		await api.post('https://gymflow-api-production.up.railway.app/api/jadwalUmum', form)
		toast.success('Berhasil Tambah Jadwal!', { timeout: 2000 })
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