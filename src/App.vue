<script>
export default {
    created() {
        this.$store.dispatch('tryLogin');
    }
};
</script>

<template>
    <router-view />
</template>

<style scoped></style>
