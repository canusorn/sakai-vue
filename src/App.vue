<script>
export default {
    created() {
        this.$store.dispatch('tryLogin');

        if (!this.$store.getters.device) {
             this.$store.dispatch('getDevice');
            // console.log(this.$store.getters.device.device[0]);
        }
    }
};
</script>

<template>
    <router-view />
</template>

<style scoped></style>
