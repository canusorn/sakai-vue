<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">{{ submitButtonCaption }}</div>
                        <span v-if="!formIsValid"
                            class="font-medium p-inline-message p-component p-inline-message-error" role="alert">
                            A simple warning alert—check it out!
                        </span>
                        <!-- <span v-else class="text-600 font-medium">Log in</span> -->

                    </div>
                    <div>
                        <form @submit.prevent="submitForm">
                            <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                            <InputText id="email1" type="text" placeholder="Email address"
                                class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model.trim="email" />

                            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                            <Password id="password1" v-model.trim="password" placeholder="Password" :toggleMask="false"
                                class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                            <div class="flex align-items-center justify-content-between mb-5 gap-5">
                                <!-- <div class="flex align-items-center">
                                    <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                                <a class="font-medium no-underline ml-2 text-right cursor-pointer"
                                    style="color: var(--primary-color)">Forgot password?</a> -->
                            </div>
                            <Button type="submit" :label="submitButtonCaption" class="w-full p-3 text-xl"></Button>
                        </form>
                        <div class="flex align-items-right justify-content-end mt-3">
                            <a class="font-medium no-underline ml-2 mt-3 text-right cursor-pointer"
                                style="color: var(--primary-color)" @click="switchAuthMode">{{ switchModeButtonCaption
                                }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
export default {
    data() {
        return {
            email: '',
            password: '',
            formIsValid: true,
            mode: 'login',
            // isLoading: false,
            // error: null,
        };
    },
    computed: {
        submitButtonCaption() {
            if (this.mode === 'login') {
                return 'Login';
            } else {
                return 'Sign up';
            }
        },
        switchModeButtonCaption() {
            if (this.mode === 'login') {
                return 'Sign up';
            } else {
                return 'Login';
            }
        },
    },
    methods: {
        async submitForm() {

            this.formIsValid = true;
            if (
                this.email === '' ||
                !this.email.includes('@') ||
                this.password.length < 3
            ) {
                this.formIsValid = false;
                return;
            }

            this.isLoading = true;

            const actionPayload = {
                email: this.email,
                password: this.password,
            };
            // console.log(actionPayload);

            // try {
                //     if (this.mode === 'login') {
                await this.$store.dispatch('login', actionPayload);
                //     } else {
                //         await this.$store.dispatch('signup', actionPayload);
                //     }

                const redirectUrl = '/' + (this.$route.query.redirect || '');
                this.$router.replace(redirectUrl);
            // } catch (err) {
            //     this.error = err.message || 'Failed to authenticate, try later.';
            // }

            // this.isLoading = false;
        },
        switchAuthMode() {
            if (this.mode === 'login') {
                this.mode = 'signup';
            } else {
                this.mode = 'login';
            }
        },
        // handleError() {
        //     this.error = null;
        // },
    },
};
</script>



<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
