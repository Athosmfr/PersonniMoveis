<template>
  <div>
      <el-col :span="12">
          <el-menu
            class="el-menu-vertical"
            :default-active="currentPageMenuIndex()"
          >

            <div class="menu-items">         
              
              <router-link to="/"><h1><img :src="storeConfig.altLogo" class="img-item"/></h1></router-link>

              <router-link to="/admin">
                <el-menu-item index="0">
                  <el-icon><Histogram /></el-icon>
                    <span>Dashboard</span>
                </el-menu-item>
              </router-link>

              <router-link to="/admin/produtos">
                <el-menu-item index="1">
                    <el-icon><Handbag /></el-icon>
                    <span>Produtos</span>
                </el-menu-item>
              </router-link>
            
              <router-link to="/admin/categorias">
                <el-menu-item index="2">
                    <el-icon><Menu /></el-icon>
                    <span>Categorias</span>
                </el-menu-item>
              </router-link> 
            
              <router-link to="/admin/pedidos">
                <el-menu-item index="3">
                    <el-icon><List /></el-icon>
                    <span>Pedidos</span>
                </el-menu-item>
              </router-link> 
            
              <router-link to="/admin/usuarios">
                <el-menu-item index="4">
                    <el-icon><UserFilled /></el-icon>
                    <span>Usuários</span>
                </el-menu-item>
              </router-link>
              
              <router-link to="/admin/configuracoes">
                <el-menu-item index="5">
                    <el-icon><setting /></el-icon>
                    <span>Configurações</span>
                </el-menu-item>
              </router-link>
            </div>
            
              <router-link to="/" class="voltar">
                <el-icon><Back /></el-icon>
                <span>Voltar ao site</span>
              </router-link>
          </el-menu>
      </el-col>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import AuthService from '@/store/authService.js';

export default {
  data() {
    return {
      storeConfig: {
        altLogo: '',
      },
    }
  },
  created() {
    this.getStoreConfig();
  },
methods: {
  currentPageMenuIndex() {
    const path = this.$route.path;
    if (path === '/admin') {
      return '0';
    } else if (path.includes('/admin/produtos')) {
      return '1';
    } else if (path.includes('/admin/categorias')) {
      return '2';
    } else if (path.includes('/admin/pedidos')) {
      return '3';
    } else if (path.includes('/admin/usuarios')) {
      return '4';
    } else if (path.includes('/admin/configuracoes')) {
      return '5';
    }
  },
  getStoreConfig() {
      const config = { headers: { Authorization: AuthService.getToken() } };
      axios.get(`http://localhost:8081/store`, config)
      .then((response) => {
      if (response.status === 200) {
          this.storeConfig.altLogo = response.data.storeSecondaryImgPath

      } else {
          ElMessage.error('Erro ao receber config da empresa:', response.statusText);
          }
      })
      .catch((error) => {
          console.error('Erro ao buscar dados da API:', error);
      });
  },

},
}
</script>

<style lang="scss"  scoped>
@import "@/assets/styles/scss/basics.scss";

.el-menu{
  border-right: 0;
}
.el-menu-vertical {
  width: 200px;
  height: 100vh;
  background-color: var(--tertiary-color);
  position: fixed;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h1 {
      color: #fff;
      font-size: 20px;
      text-align: center;
      margin: 0;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      margin-top: 20px;
      margin-bottom: 20px;
  }

  .el-menu-item {
      color: #fff;
      font-size: 16px;
      text-align: center;
      margin: 0;

      &:hover{
          color: #545c64;
      }

      &.is-active{
          color: $primary-color !important;
          background-color: var(--cta-color);
      }
  }
  

  a.router-link-active {
      color:  $primary-color !important;
  
  }

  .voltar{
      color: #fff;
    font-size: 16px;
    text-align: center;
    margin: 0;


    display: flex;
    align-items: center;
    height: var(--el-menu-item-height);
    line-height: var(--el-menu-item-height);

    padding: 0 var(--el-menu-base-level-padding);
    list-style: none;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;

    i {
      margin-right: 10px;
    }
  }




}

</style>