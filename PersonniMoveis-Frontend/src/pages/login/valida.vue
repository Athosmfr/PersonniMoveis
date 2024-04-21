<template>
    <div class="header" >
        <h1>Sua conta foi criada com sucesso! Você já pode fechar essa guia.</h1>
        <a href="/">Voltar para página principal <el-icon><Right /></el-icon></a>
    </div>
</template>

<script>
import axios from 'axios';
import authService from '@/store/authService.js';
import jwtDecode from "jwt-decode";
import { ElMessage, ElLoading } from 'element-plus';

export default {
    data() {
      return {
        accountCreateRequest: null,
      }
    },
    created() {
        const loading = ElLoading.service({
            lock: true,
            text: 'Carregando..',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        const token = jwtDecode(new URLSearchParams(window.location.search).get("token"));
        const user = {
            name: token.name,
            email: token.email,
            cpf: token.cpf,
            phoneNumber: token.phone,
            password: token.password
        }
        axios.post("http://localhost:8081/users/create-account", user)
            .then(response => {
                accountCreateRequest = true;
                loading.close();
                
            })
            .catch(error => {
                loading.close();
                
            })
            ElMessage.success("Conta criada com sucesso!");
    },
}
</script>

<style scoped lang="scss">

.header {
    border: 200px;
    margin: 0 auto;
    margin-top: 60px;
    width: 100%;
    height: 310px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    justify-self: center;
}

a {
    font-size: 40px;
    text-decoration: underline;
}
</style>
