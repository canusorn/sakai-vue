<script>
export default {
    props: ['value', 'label']
};
</script>

<template>
    <div class="card shadow-2 p-3 border-round">
        <div class="flex justify-content-center mb-1">
            <div>
                <span class="text-center block text-500 font-bold  mb-3">{{ label }}</span>
                <div class="text-center text-900 font-medium font-bold text-xl text-danger">{{ value }}</div>
            </div>
        </div>
        <!-- <span class="text-green-500 font-medium">24 new </span>
                    <span class="text-500">since last visit</span> -->
    </div>
</template>
