<template>
  <div class="container">
    <div class="logo-container"><img :src="storeConfig.logo" class="logo"/></div>
    <div class="login-container">
      <div class="side-image">
        <img src="../../assets/img/personni.png" class="img-item"/>
      </div>
    <!-- <div class="blue-rectangle"> -->
        <div class="dialog">
            <h1>Recuperar Senha</h1>
            <h3>informe o e-mail de sua conta para receber uma requisição de troca de senha.</h3>
                <el-input
                  v-model="email"
                  size="large"
                  placeholder="Email"
                />
                <el-button class="cta" color="var(--cta-color)" size="large" v-on:click="sendEmail()">Enviar</el-button>
        </div>
      </div>
      <h2><router-link class="voltar" to="/login"><el-icon><ArrowLeftBold /></el-icon> Voltar para login</router-link></h2>
  </div>

</template>

<script>
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import AuthService from '@/store/authService.js';

export default {
  data() {
      return {
        email: "",
        storeConfig: {
          logo: '',
        },
      }
  },
  created() {
    this.getStoreConfig();
  },
  methods: {
    getStoreConfig() {
      const config = { headers: { Authorization: AuthService.getToken() } };
      axios.get(`http://localhost:8081/store`, config)
        .then((response) => {
        if (response.status === 200) {
            this.storeConfig.logo = response.data.storeLogoPath

        } else {
            ElMessage.error('Erro ao receber config da empresa:', response.statusText);
        }
    })
    .catch((error) => {
        console.error('Erro ao buscar dados da API:', error);
    });
    },
    sendEmail() {
      const loading = ElLoading.service({
          lock: true,
          text: 'Enviando e-mail..',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      axios.put("http://localhost:8081/users/change-password", this.email)
        .then(response => {
            loading.close();
            ElMessage.success("E-mail enviado");
        })
        .catch(error => {
            loading.close();
        })
      }
    },
};
</script>

<style lang="scss" scoped>
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
h3 {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 2%;
  color: $secondary-color;
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

@media screen and (max-width: 768px) {
  div.login-container{
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    .side-image{
      display: none;
    }
    .dialog{
      flex-basis: 100%;
    }
  }
  div.container{
    padding-top: 0;
    padding-bottom: 0;
  }
  div.logo-container{
    width: 15rem;
    margin-bottom: 20px;
    height: 10rem;
  }
}
</style>