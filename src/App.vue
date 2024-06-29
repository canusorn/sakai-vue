<script>
export default {
    created() {
        this.$store.dispatch('tryLogin');

        // setInterval(() => {
           if (!this.$store.getters.device) {
             this.$store.dispatch('getDevice');
            // console.log(this.$store.getters.device);
        } 
        // }, 2000)
        
    }
};
</script>

<template>
    <router-view />
</template>

<style scoped></style>
