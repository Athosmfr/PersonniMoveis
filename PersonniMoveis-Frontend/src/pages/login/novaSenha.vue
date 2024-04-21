<template>
    <div class="container">
      <div class="logo-container"></div>
      <div class="login-container">
      <div class="side-image">
        <img src="../../assets/img/personni.png" class="img-item"/>
      </div>
          <div class="dialog">
              <h1>Mude sua senha</h1>
                  <el-input
                    v-model="password"
                    size="large"
                    placeholder="Nova senha"
                    label="Nova senha"
                  />
                  <el-button color="var(--cta-color)" class="cta" size="large" :loading-icon="Eleme" :loading="carregando" v-on:click="changePassword()">Mudar senha</el-button>
          </div>
      </div>
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
        password: null,
      }
    },
    created() {
    
    },
    methods: {
        changePassword() {
            const loading = ElLoading.service({
                lock: true,
                text: 'Carregando..',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            const token = jwtDecode(new URLSearchParams(window.location.search).get("token"));
            const request = {
                token: token,
                updatedPassword: this.password
            }
            axios.put("http://localhost:8081/users/update-pass", token)
                .then(response => {
                    loading.close();
                    ElMessage.success("Senha atualizada com sucesso!");
                })
                .catch(error => {
                    loading.close();
                })
            }
    }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/scss/basics.scss';

div.container{
  display: flex;
   justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  background-color: #CECECE;
  padding-top: 0;
  padding-bottom: 0;
  .logo-container{
    width: 25rem;
    margin-bottom: 20px;
    height: 15rem;
  }
}

div.login-container{
    img {
      object-fit: cover;
      height: 100%;
    }

    :deep(.side-image) {
      flex-basis: 50%;
    }
    .dialog{
      flex-basis: 70%;
    }
}


div.dialog{
    .el-link{
      color: $admin-grey;
      text-decoration: underline;
    }
    .el-link.is-underline:hover::after {
      border-bottom:none;
    }
    .recuperar-senha{
      text-align: right;

      .el-link{
        font-size: 12px;
      }
    }
    :deep(.el-divider){
      border-top: 1px solid $admin-grey;
    }
    :deep(.el-divider__text) {
      background-color: var(--tertiary-color);
      color: $admin-grey;
    }
    .register{
      text-align: center;

      .el-link{
        font-size: 16px;
      }
    }
}

h1{
    color: $primary-color;
    text-align: center;
    font-family: josefin;
    font-size: 4rem;
    font-weight: 400;   
}

h2 {
  text-align: center;
  margin-top: 20px;
  color: var(--cta-color);
  font-weight: 400;

  .voltar{
    display: flex;
    align-items: center;
  }
}
</style>
