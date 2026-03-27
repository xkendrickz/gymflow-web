<template>
  <div class="page-header">
    <h2 class="page-title">Presensi Kelas</h2>
    <p class="page-subtitle">Daftar booking kelas hari ini</p>
  </div>

  <v-card class="table-card" rounded="xl">
    <v-card-text class="pa-6">
      <div v-if="loading" class="d-flex justify-center pa-8">
        <v-progress-circular indeterminate color="orange" />
      </div>
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Kelas</th>
              <th>Instruktur</th>
              <th>Member</th>
              <th>Hari</th>
              <th>Jenis</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="bookings.length === 0">
              <td colspan="7" class="empty-row">Tidak ada data booking.</td>
            </tr>
            <tr v-for="item in bookings" :key="item.id_presensi_kelas">
              <td>{{ item.nama_kelas }}</td>
              <td>{{ item.nama_instruktur }}</td>
              <td>{{ item.nama_member }}</td>
              <td>{{ item.hari }}</td>
              <td>
                <span :class="['jenis-badge', item.jenis === 'Paket' ? 'jenis-paket' : 'jenis-reguler']">
                  {{ item.jenis }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', item.status == 1 ? 'status-active' : 'status-inactive']">
                  {{ item.status == 1 ? 'Hadir' : 'Belum' }}
                </span>
              </td>
              <td>
                <v-btn v-if="item.status != 1" size="small" rounded="lg" class="presensi-btn"
                  :loading="processingId === item.id_presensi_kelas"
                  @click="presensi(item.id_presensi_kelas)">
                  Presensi
                </v-btn>
                <span v-else style="color: #22c55e; font-size: 0.8rem;">✓ Tercatat</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/lib/axios'

const toast = useToast()
const bookings = ref<any[]>([])
const loading = ref(true)
const processingId = ref<number | null>(null)

onMounted(async () => {
	try {
		const res = await api.get('https://gymflow-api-production.up.railway.app/api/presensiKelas')
		bookings.value = res.data.data
	} catch { toast.error('Gagal memuat data.', { timeout: 2000 }) }
	finally { loading.value = false }
})

async function presensi(id: number) {
	processingId.value = id
	try {
		const res = await api.get(`https://gymflow-api-production.up.railway.app/api/cetakStruk/${id}`)
		const data = res.data.data
		printStruk(data)
		const item = bookings.value.find(b => b.id_presensi_kelas === id)
		if (item) item.status = 1
		toast.success('Presensi berhasil!', { timeout: 2000 })
	} catch { toast.error('Gagal mencatat presensi.', { timeout: 2000 }) }
	finally { processingId.value = null }
}

function printStruk(data: any) {
	const isReguler = data.jenis === 'Reguler'
	const popup = window.open('', '_blank')
	if (!popup) return
	popup.document.write(`
    <html><head><title>Struk Presensi Kelas</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; padding: 40px; background: #f5f5f5; }
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
      <span class="badge">STRUK PRESENSI KELAS</span>
      <hr class="divider">
      <p class="label">No Struk</p><p class="value">${data.no_struk}</p>
      <p class="label">Tanggal</p><p class="value">${data.tanggal}</p>
      <p class="label">Member</p><p class="value">${data.member_id} / ${data.nama_member}</p>
      <p class="label">Kelas</p><p class="value">${data.nama_kelas}</p>
      <p class="label">Instruktur</p><p class="value">${data.nama_instruktur}</p>
      ${isReguler
			? `<p class="label">Tarif</p><p class="value">Rp ${data.tarif}</p>
           <p class="label">Sisa Deposit</p><p class="value">${data.sisa_deposit_reguler}</p>`
			: `<p class="label">Sisa Deposit Paket</p><p class="value">${data.sisa_deposit_paket}x</p>
           <p class="label">Berlaku Sampai</p><p class="value">${data.berlaku_sampai}</p>`
		}
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

.data-table tr:last-child td {
	border-bottom: none;
}

.status-badge,
.jenis-badge {
	font-size: 0.7rem;
	font-weight: 600;
	padding: 3px 10px;
	border-radius: 99px;
}

.status-active {
	background: rgba(34, 197, 94, 0.1);
	color: #22c55e;
}

.status-inactive {
	background: rgba(156, 163, 175, 0.1);
	color: #9ca3af;
}

.jenis-reguler {
	background: rgba(59, 130, 246, 0.1);
	color: #60a5fa;
}

.jenis-paket {
	background: rgba(249, 115, 22, 0.1);
	color: #f97316;
}

.presensi-btn {
	background: linear-gradient(135deg, #f97316, #ea580c) !important;
	color: white !important;
	font-size: 0.75rem !important;
}

.empty-row {
	text-align: center;
	color: #6b7280;
	padding: 32px !important;
}
</style><template>
	<div class="page-header">
		<h2 class="page-title">Presensi Kelas</h2>
		<p class="page-subtitle">Daftar booking kelas hari ini</p>
	</div>

	<v-card class="table-card" rounded="xl">
		<v-card-text class="pa-6">
			<div v-if="loading" class="d-flex justify-center pa-8">
				<v-progress-circular indeterminate color="orange" />
			</div>
			<div v-else class="table-wrapper">
				<table class="data-table">
					<thead>
						<tr>
							<th>Kelas</th>
							<th>Instruktur</th>
							<th>Member</th>
							<th>Hari</th>
							<th>Jenis</th>
							<th>Status</th>
							<th>Aksi</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="bookings.length === 0">
							<td colspan="7" class="empty-row">Tidak ada data booking.</td>
						</tr>
						<tr v-for="item in bookings" :key="item.id_presensi_kelas">
							<td>{{ item.nama_kelas }}</td>
							<td>{{ item.nama_instruktur }}</td>
							<td>{{ item.nama_member }}</td>
							<td>{{ item.hari }}</td>
							<td>
								<span
									:class="['jenis-badge', item.jenis === 'Paket' ? 'jenis-paket' : 'jenis-reguler']">
									{{ item.jenis }}
								</span>
							</td>
							<td>
								<span :class="['status-badge', item.status == 1 ? 'status-active' : 'status-inactive']">
									{{ item.status == 1 ? 'Hadir' : 'Belum' }}
								</span>
							</td>
							<td>
								<v-btn v-if="item.status != 1" size="small" rounded="lg" class="presensi-btn"
									:loading="processingId === item.id_presensi_kelas"
									@click="presensi(item.id_presensi_kelas)">
									Presensi
								</v-btn>
								<span v-else style="color: #22c55e; font-size: 0.8rem;">✓ Tercatat</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/lib/axios'

const toast = useToast()
const bookings = ref<any[]>([])
const loading = ref(true)
const processingId = ref<number | null>(null)

onMounted(async () => {
  try {
    const res = await api.get('https://gymflow-api-production.up.railway.app/api/presensiKelas')
    bookings.value = res.data.data
  } catch { toast.error('Gagal memuat data.', { timeout: 2000 }) }
  finally { loading.value = false }
})

async function presensi(id: number) {
  processingId.value = id
  try {
    const res = await api.get(`https://gymflow-api-production.up.railway.app/api/cetakStruk/${id}`)
    const data = res.data.data
    printStruk(data)
    const item = bookings.value.find(b => b.id_presensi_kelas === id)
    if (item) item.status = 1
    toast.success('Presensi berhasil!', { timeout: 2000 })
  } catch { toast.error('Gagal mencatat presensi.', { timeout: 2000 }) }
  finally { processingId.value = null }
}

function printStruk(data: any) {
  const isReguler = data.jenis === 'Reguler'
  const popup = window.open('', '_blank')
  if (!popup) return
  popup.document.write(`
    <html><head><title>Struk Presensi Kelas</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; padding: 40px; background: #f5f5f5; }
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
      <span class="badge">STRUK PRESENSI KELAS</span>
      <hr class="divider">
      <p class="label">No Struk</p><p class="value">${data.no_struk}</p>
      <p class="label">Tanggal</p><p class="value">${data.tanggal}</p>
      <p class="label">Member</p><p class="value">${data.member_id} / ${data.nama_member}</p>
      <p class="label">Kelas</p><p class="value">${data.nama_kelas}</p>
      <p class="label">Instruktur</p><p class="value">${data.nama_instruktur}</p>
      ${isReguler
        ? `<p class="label">Tarif</p><p class="value">Rp ${data.tarif}</p>
           <p class="label">Sisa Deposit</p><p class="value">${data.sisa_deposit_reguler}</p>`
        : `<p class="label">Sisa Deposit Paket</p><p class="value">${data.sisa_deposit_paket}x</p>
           <p class="label">Berlaku Sampai</p><p class="value">${data.berlaku_sampai}</p>`
      }
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

.data-table tr:last-child td {
	border-bottom: none;
}

.status-badge,
.jenis-badge {
	font-size: 0.7rem;
	font-weight: 600;
	padding: 3px 10px;
	border-radius: 99px;
}

.status-active {
	background: rgba(34, 197, 94, 0.1);
	color: #22c55e;
}

.status-inactive {
	background: rgba(156, 163, 175, 0.1);
	color: #9ca3af;
}

.jenis-reguler {
	background: rgba(59, 130, 246, 0.1);
	color: #60a5fa;
}

.jenis-paket {
	background: rgba(249, 115, 22, 0.1);
	color: #f97316;
}

.presensi-btn {
	background: linear-gradient(135deg, #f97316, #ea580c) !important;
	color: white !important;
	font-size: 0.75rem !important;
}

.empty-row {
	text-align: center;
	color: #6b7280;
	padding: 32px !important;
}
</style>