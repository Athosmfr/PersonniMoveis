<template>
    <div class="footer">
            <h2>Contato</h2>
            <div class="info">
            <p>Email: {{ storeConfig.email }}</p>
            <p>Fone: {{ storeConfig.phone }}</p>
            </div>
            <h1>{{ storeConfig.name }} © 2023</h1>
    </div>
</template>

<script>
import axios from 'axios';
import AuthService from '@/store/authService';
export default {
    data() {
        return {
            storeConfig: {
                name: '',
                phone: '',
                email: '',
            },
        }
    },
    async created() {
        this.getStoreConfig();
    },
    methods: {
        getStoreConfig() {
            const config = { headers: { Authorization: AuthService.getToken() } };
            axios.get(`http://localhost:8081/store`, config)
                .then((response) => {
                    if (response.status === 200) {
                        this.storeConfig.name = response.data.storeName;
                        this.storeConfig.phone = response.data.storePhone;
                        this.storeConfig.email = response.data.storeEmail;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
    

}
</script>

<style scoped lang="scss">
@import '@/assets/styles/scss/basics.scss';
div.footer{
    height: auto;
    background-color: var(--tertiary-color);
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
                
    h1{
        color: $admin-grey;
        font-weight: 300;
        margin-top: 20px;
    }
    h2{
        color: $admin-grey;
        font-weight: 300;
        margin-bottom: 0;
        font-size: 20px;
        margin-bottom: 10px;
    }
    p{
        color: $admin-grey;
        font-weight: 300;
        margin-bottom: 0;
        font-size: 16px;
    }
    div.info{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}

@media (max-width: 768px) {
    div.footer{
        height: 100%;
        padding-bottom: 20px;

        h1{
            font-size: 2rem;
        }
    }
}
</style>