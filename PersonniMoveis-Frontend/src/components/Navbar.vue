<template>
  <el-menu
    mode="horizontal"
    :ellipsis="false"
    background-color="var(--tertiary-color)"
    text-color="var(--cta-color)"
    active-text-color="var(--tertiary-color)"
    @select="handleSelect"
  >
    <el-menu-item><router-link to="/"><img style="width: 150px;" :src="storeConfig.logo"/></router-link></el-menu-item>
    <div class="flex-grow" />
    <el-menu-item v-if="isUserSysColaborator()"><router-link to="/admin">Admin</router-link></el-menu-item>
    <el-menu-item><router-link to="/produtos">Catálogo</router-link></el-menu-item>
    <el-menu-item><router-link to="/perfil">Meu perfil</router-link></el-menu-item>
    <el-menu-item><router-link to="/carrinho">Carrinho <span v-if="cartItemsCounter > 0">({{ cartItemsCounter }})</span></router-link></el-menu-item>
    <router-link to="/modelar"><el-button class="cta" color="var(--cta-color)">Começar à modelar</el-button></router-link>
  </el-menu>
</template>

<script>
import AuthService from '@/store/authService';
import cartService from '@/store/cartService';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

export default {
  data() {
    return {
      cartItemsCounter: cartService.amountOfProductsInCart(),
      storeConfig: {
        logo: '',
      },
    };
  },
  computed: {
    isHomepage() {
      return this.$route.path === '/';
    },
  },
  created() {
    this.getAmountOfProductsInCart();
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
    /** Cria o eventListner e atualiza a quantidade de itens no icone do carrinho. */
    getAmountOfProductsInCart() {
      window.addEventListener('cartUpdated', () => {
        this.cartItemsCounter = cartService.amountOfProductsInCart();
      });
    },
    /** Retorna true para usuários logados com permissão de colab ou admin. */
    isUserSysColaborator() {
      const token = AuthService.getToken();  // Obtém o token JWT
      if (token) {
        const usuario = jwtDecode(token);  // Decodifica o token para obter as informações do usuário
        // Verifica se o perfil do usuário é "COLABORATOR" ou "ADMIN"
        return usuario && (usuario.userRole === 'COLABORATOR' || usuario.userRole === 'ADMIN');
      }
      return false;  // Retorna false se não houver token ou se o perfil não for "COLABORATOR" ou "ADMIN"
      //return AuthService.isUserColaborator();
      // return true
    }
  },
}
</script>

<style scoped lang="scss">


.flex-grow {
  flex-grow: 1;
}
.el-menu{
  z-index: 2;
  padding-right: 10px;
  text-transform: uppercase;
  height: 75px !important;
  border-bottom: 0 !important;
}
.cta{
  margin: 0 20px;
}


@media (max-width: 768px) {
  .el-menu{
    height: 100% !important;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding-bottom: 2rem;
    padding-right: 0;

    .el-menu-item:first-child {
      width: 100%;
      height: 100%;
    }
  }
  .cta{
    margin: 0 10px;
  }
}
</style>