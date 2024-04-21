<template>
    <div class="admin-container">
      <h1><router-link class="underline-router" to="/admin/usuarios">Usuários</router-link> > Editar</h1>
      <el-form :model="usuario" label-width="*" label-position="top">
        <h2>Detalhes do usuário</h2>
        <el-form-item label="Nome">
          <el-input v-model="usuario.name"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="usuario.email"></el-input>
        </el-form-item>
        <el-form-item label="CPF">
          <el-input v-model="usuario.cpf"></el-input>
        </el-form-item>
        <el-form-item label="Telefone">
          <el-input v-model="usuario.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="Perfil">
          <el-select v-model="usuario.profile" placeholder="Selecione o perfil">
            <el-option label="Usuário" value="USER"></el-option>
            <el-option label="Colaborador" value="COLLABORATOR"></el-option>
            <el-option label="Administrador" value="ADMIN"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="cta" @click="editarUsuario">Salvar</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>

  <script>
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  import AuthService from '@/store/authService.js';
  import jwtDecode from 'jwt-decode';
  
  export default {
    data() {
      return {
        usuario: {
          id: 0,
          name: "",
          email: "",
          cpf: "",
          phoneNumber: "",
          profile: "",
        }
      }
    },
    created() {
    
      if (!AuthService.isUserColaborator()) {
        this.$router.replace('/');
      }
    },
    mounted() {
      const userId = this.$route.params.id;
      const config = { headers: { Authorization: AuthService.getToken() } };
      // Fazer uma solicitação GET para buscar dados do usuário por ID
      axios.get(`http://localhost:8081/users/adminUser-info/${userId}`, config)
        .then((response) => {
          if (response.status === 200) {
            this.usuario = response.data;
          } else {
            ElMessage.error('Erro ao buscar dados da API:', response.statusText);
          }
        })
        .catch((error) => {
          console.error('Erro ao buscar dados da API:', error);
        });
    },
    methods: {
      editarUsuario() {
        const id = this.$route.params.userId;
        const config = { headers: { Authorization: AuthService.getToken() } };
        // Atualiza o usuário com base no ID
        axios.put(`http://localhost:8081/users/admin-update-user`, this.usuario, config)
          .then((response) => {
            if (response.status === 204) {
              console.log('Usuário editado com sucesso', response.data);
              this.$router.push('/admin/usuarios');
            } else {
              console.error('Erro ao editar usuário:', response.statusText);
            }
          })
          .catch((error) => {
            console.error('Erro ao editar usuário:', error);
          });
      }
    }
  }
  </script>

<style scoped lang="scss">
@import "@/assets/styles/scss/basics.scss";
hr{
  border: 1px solid $admin-grey;
  margin: 30px 0;
}
.el-input.section-input {
    width: 50%;
}
.elements{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.element-card{
    border: 2px solid $admin-grey;
    padding: 0 20px 20px 20px;
    width: 300px;
    margin: 20px 20px 0 0;
    h2{
        text-align: center;
        color: $admin-grey;
    }
}
</style>