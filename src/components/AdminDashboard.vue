<template>
    <DashboardLayout :nav-groups="navGroups" role-label="Administrator" />
</template>

<script setup lang="ts">
import DashboardLayout from '@/components/DashboardLayout.vue'

const navGroups = [
    {
        label: 'Management',
        items: [
            { name: 'instruktur', label: 'Instruktur', icon: 'mdi-account-star', route: 'admin.instruktur.index' },
        ],
    },
]
</script>