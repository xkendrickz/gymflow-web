<template>
	<div class="page-header">
		<h2 class="page-title">Aktivasi Member</h2>
		<p class="page-subtitle">Proses aktivasi tahunan member</p>
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
				</div>
				<v-divider class="my-6" style="border-color: rgba(255,255,255,0.06);" />
				<div class="form-actions">
					<v-btn type="submit" :loading="loading" rounded="lg" class="save-btn" prepend-icon="mdi-check">
						Proses Aktivasi
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
const form = reactive({ id_member: '', id_pegawai: '' })
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
		const res = await api.post('https://gymflow-api-production.up.railway.app/api/aktivasi', form)
		const idAktivasi = res.data.data.id_aktivasi
		const detail = await api.get(`https://gymflow-api-production.up.railway.app/api/aktivasi/${idAktivasi}`)
		printStruk(detail.data.data)
		toast.success('Berhasil Aktivasi Member!', { timeout: 2000 })
		form.id_member = ''
		form.id_pegawai = ''
	} catch (e: any) {
		if (e.response?.data?.errors) Object.assign(errors, e.response.data.errors)
		else toast.error('Gagal memproses aktivasi.', { timeout: 2000 })
	} finally { loading.value = false }
}

function printStruk(data: any) {
	const popup = window.open('', '_blank')
	if (!popup) return
	popup.document.write(`
    <html><head><title>Struk Aktivasi</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; padding: 40px; background: #f5f5f5; }
      .card { width: 380px; background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
      .gym-name { font-size: 20px; font-weight: 800; color: #f97316; margin: 0 0 2px; }
      .address { font-size: 11px; color: #9ca3af; margin: 0; }
      .no-struk { font-size: 12px; color: #6b7280; text-align: right; }
      .divider { border: none; border-top: 1px solid #e5e7eb; margin: 12px 0; }
      .label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
      .value { font-size: 13px; color: #111; font-weight: 500; margin-bottom: 8px; }
      .badge { display: inline-block; background: #f97316; color: white; font-size: 10px; padding: 2px 10px; border-radius: 99px; font-weight: 600; margin-bottom: 12px; }
    </style></head><body>
    <div class="card">
      <div class="header">
        <div><p class="gym-name">GymFlow</p><p class="address">Jl. Qlipoth Tree No. 5, Yogyakarta</p></div>
        <div class="no-struk">No: ${data.no_struk}<br>${data.tanggal_aktivasi}</div>
      </div>
      <span class="badge">STRUK AKTIVASI</span>
      <hr class="divider">
      <p class="label">Member</p><p class="value">${data.member_id} / ${data.nama_member}</p>
      <p class="label">Biaya Aktivasi</p><p class="value">Rp ${data.harga},-</p>
      <p class="label">Masa Aktif Hingga</p><p class="value">${data.masa_aktif}</p>
      <p class="label">Kasir</p><p class="value">P${data.id_pegawai} / ${data.nama_pegawai}</p>
    </div>
    </body></html>
  `)
	popup.document.close()
	popup.focus()
	popup.print()
	popup.close()
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