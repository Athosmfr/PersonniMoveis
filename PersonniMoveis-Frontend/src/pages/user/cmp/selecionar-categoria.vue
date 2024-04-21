<template>
   <el-menu mode="horizontal" :ellipsis="false" background-color="#FEFEFE" text-color="var(--tertiary-color)"
        active-text-color="var(--tertiary-color)" @select="handleSelect">
        <el-menu-item><router-link to="/"><img style="width: 200px;"
                    :src="storeConfig.logo" /></router-link></el-menu-item>

        <h1> Modelagem de móveis </h1>
    </el-menu>
    <div class="container">

        <h2>Escolha a Categoria</h2>

        <div class="categorias-grid">
          <router-link :to="'/modelar/' + i.id" v-for="i in categorias" :key="i">
          <div class="categoria-item" v-if="i.allow_creation">
            <h3> {{  i.name }} </h3>
          </div>
        </router-link>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import { ElLoading, ElMessage } from 'element-plus'
import AuthService from '@/store/authService.js';

export default {
  data() {
    return {
      categorias: [],
      storeConfig: {
        logo: '',
      },
    }
  },
  async created() {
    const loading = ElLoading.service({
            lock: true,
            text: 'Carregando categorias...',
            background: 'rgba(0, 0, 0, 0.7)'
      });
      axios.get('http://localhost:8081/category')
        .then(response => {
          this.categorias = response.data;
          
          setTimeout(() => {
            loading.close()
          }, 250)
        
        })
        .catch(error => {
          console.error('Erro ao obter dados da API:', error);
      });
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
        
    }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/scss/basics.scss';
.el-menu{
  justify-content: space-between;
  height: 100px;
  h1 {
  font-size: 32px;
  font-weight: 300;
  color: $text-color;
  margin-right: 5%;
  margin-bottom: 0;
}
}

h2{
    text-align: center;
    font-size: 2.5rem;
    font-family: lato-regular;
    font-weight: 400;
}
div.categorias-grid{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

div.categoria-item{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 2rem;
  padding: 2rem;
  transition: all 0.3s ease-in-out;
  background-color: $secondary-darker;
  height: 200px;
  width: 30vw;

  &:hover{
    transform: scale(1.1);

    h3{
        color: var(--cta-color);
    }
  }

  img{
    width: 100%;
    max-width: 150px;
    height: auto;
    border-radius: 10px;
  }

  h3{
    font-size: 5rem;
    color: var(--tertiary-color);
    font-family: josefin;
    transition: all 0.3s ease-in-out;
    font-weight: 400;
  }
}

@media screen and (max-width: 768px) {
  div.categoria-item{
    width: 80vw;
  }

  .el-menu{
    height: 200px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h1{
      margin-bottom: 20px;
    }
  }
}
</style>