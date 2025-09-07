<template>
    <div>
        <div>
            <main>
                <router-view />
            </main>
        </div>
    </div>
</template>

<script>
export default {
    name: "MobileHomeIndex",
    components: {},
    props: {},
    data() {
        return {
            active: 0,
        };
    },
    methods: {
        OnSwitchRoutes(activePath) {
            this.$router.push({ path: activePath });
        },
    },
    created() {},
};
</script>

<style scoped></style>
