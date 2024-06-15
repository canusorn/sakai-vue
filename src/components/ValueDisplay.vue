<template>

            <!-- <div class="col-12 md:col-6 lg:col-3"> -->
                <div class="card shadow-2 p-3 border-round">
                    <div class="flex justify-content-center mb-3">
                        <div>
                            <span class="text-center block text-500 font-medium mb-3">{{label}}</span>
                            <div class="text-center text-900 font-medium text-xl">{{value}}</div>
                        </div>
                    </div>
                    <!-- <span class="text-green-500 font-medium">24 new </span>
                    <span class="text-500">since last visit</span> -->
                </div>
            <!-- </div> -->


</template>


<script>
export default {
  props: ['value', 'label'],
}
</script>