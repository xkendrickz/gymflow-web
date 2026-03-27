<template>
	<div class="page-header">
		<h2 class="page-title">Laporan Aktivitas Kelas</h2>
		<p class="page-subtitle">Aktivitas penggunaan kelas bulanan</p>
	</div>

	<v-card class="form-card" rounded="xl">
		<v-card-text class="pa-6">
			<form @submit.prevent="cetak">
				<div class="form-grid">
					<div>
						<p class="field-label">Bulan</p>
						<v-select v-model="form.bulan" :items="dropdown.months" item-title="month" item-value="month"
							placeholder="Pilih bulan" variant="outlined" density="comfortable" color="orange"
							bg-color="#1a1a1a" />
					</div>
					<div>
						<p class="field-label">Tahun</p>
						<v-select v-model="form.tahun" :items="dropdown.years" item-title="year" item-value="year"
							placeholder="Pilih tahun" variant="outlined" density="comfortable" color="orange"
							bg-color="#1a1a1a" />
					</div>
				</div>
				<v-divider class="my-6" style="border-color: rgba(255,255,255,0.06);" />
				<div class="form-actions">
					<v-btn type="submit" :loading="loading" rounded="lg" class="cetak-btn" prepend-icon="mdi-printer">
						Cetak Laporan
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
const dropdown = ref<any>({ months: [], years: [] })
const form = reactive({ bulan: '', tahun: '' })

onMounted(async () => {
	try {
		const res = await api.get('https://gymflow-api-production.up.railway.app/api/dropdownAktivitasKelas')
		dropdown.value = res.data.data
	} catch { toast.error('Gagal memuat data.', { timeout: 2000 }) }
})

async function cetak() {
	if (!form.bulan || !form.tahun) { toast.error('Pilih bulan dan tahun.', { timeout: 2000 }); return }
	loading.value = true
	try {
		const res = await api.get(`https://gymflow-api-production.up.railway.app/api/dropdownAktivitasKelas/${form.bulan}/${form.tahun}`)
		const { data, total, bulan, tahun, tanggal } = res.data
		const popup = window.open('', '_blank')
		if (!popup) return
		popup.document.write(`
      <html><head><title>Laporan Aktivitas Kelas</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; padding: 40px; background: #f5f5f5; }
        .card { width: 650px; background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .gym-name { font-size: 20px; font-weight: 800; color: #f97316; margin: 0 0 2px; }
        .address { font-size: 11px; color: #9ca3af; margin: 0 0 16px; }
        h3 { font-size: 14px; text-decoration: underline; margin: 16px 0 8px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #e5e7eb; padding: 8px 12px; font-size: 13px; }
        th { background: #f9fafb; font-weight: 600; }
        .total-row td { font-weight: 700; background: #fff7ed; }
      </style></head><body>
      <div class="card">
        <p class="gym-name">GymFlow</p>
        <p class="address">Jl. Qlipoth Tree No. 5, Yogyakarta</p>
        <h3>LAPORAN AKTIVITAS GYM — ${bulan} ${tahun}</h3>
        <p style="font-size:12px;color:#6b7280;">Tanggal cetak: ${tanggal}</p>
        <table>
          <tr><th>Kelas</th><th>Instruktur</th><th>Jumlah Peserta</th><th>Jumlah libur</th></tr>
          ${data.map((item: any) => `<tr><td>${item.nama_kelas}</td><td>${item.nama_instruktur}</td><td>${item.total_peserta}</td><td>${item.total_libur}</td></tr>`).join('')}
          <tr class="total-row"><td>TOTAL</td><td>${total}</td></tr>
        </table>
      </div>
      </body></html>
    `)
		popup.document.close(); popup.focus(); popup.print(); popup.close()
	} catch { toast.error('Gagal mengambil data laporan.', { timeout: 2000 }) }
	finally { loading.value = false }
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

.cetak-btn {
	background: linear-gradient(135deg, #f97316, #ea580c) !important;
	color: white !important;
}
</style>