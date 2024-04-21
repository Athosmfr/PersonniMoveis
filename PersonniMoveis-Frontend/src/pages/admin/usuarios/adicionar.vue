<template>
  <div class="admin-container">
    <h1><router-link class="underline-router" to="/admin/usuarios">Usuários</router-link > > Adicionar</h1>
    <el-form :model="categoria" label-width="*" label-position="top">
      <h2>Cadastrar novo Usuário</h2>
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
          <el-form-item label="Senha">
            <el-input v-model="usuario.password"></el-input>
          </el-form-item>
          <el-form-item label="Perfil">
              <el-select v-model="usuario.profile" placeholder="Selecione o perfil">
                  <el-option label="Usuário" value="USER"></el-option>
                  <el-option label="Colaborador" value="COLLABORATOR"></el-option>
                  <el-option label="Administrador" value="ADMIN"></el-option>
              </el-select>
          </el-form-item>
        <el-form-item>
            <el-button type="primary" class="cta" @click="criarUsuario">Salvar</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script> 
import axios from 'axios';
import AuthService from '@/store/authService.js';
import jwtDecode from 'jwt-decode';

export default {
    data() {
      return {
      currentSection: 1,
      selected: [],
      usuario:{      
          name : "",
          email : "",
          cpf : "",
          phoneNumber : "",
          password : "",
          profile : "",        
      }
      };
    },
  created() {

    if (!AuthService.isUserColaborator()) {
      this.$router.replace('/');
    }
  },    
  methods: {
      criarUsuario() {
          // const token = AuthService.getToken();
          axios.post('http://localhost:8081/users/admin-create-account', this.usuario, {
      //   headers: {
      //     Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
      //   },
      }) 
      .then((response) => {
          if (response.status === 201) {
          // A resposta da API indica que o recurso foi criado com sucesso.
          // Você pode realizar ações adicionais aqui, se necessário.
          console.log('Recurso criado com sucesso', response.data);
          this.$router.push('/admin/usuarios');
      
          } else {
          console.error('Erro ao criar recurso:', response.statusText);
          }
      })
  .catch((error) => {
  console.error('Erro ao criar recurso:', error);
      })},
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