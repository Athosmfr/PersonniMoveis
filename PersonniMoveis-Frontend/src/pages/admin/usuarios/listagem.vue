<template>
  <div class="admin-container">
    <h1>Usuários</h1>
    <router-link :to="{path: '/admin/usuarios/adicionar'}"><el-button class="cta">+ Novo usuário</el-button></router-link>
 
    <el-table :data="usuarios" style="width: 100%;" class="admin-table">
        <el-table-column prop="userId" label="ID" sortable width="80" >
        <template v-slot="scope">
              <div class="id">
                <h4># {{ scope.row.userId }}</h4>
              </div>
            </template>
          </el-table-column>
        <el-table-column prop="name" label="Nome" sortable width="*"/>
        <el-table-column prop="email" label="Email" sortable width="*"/>
        <el-table-column prop="cpf" sortable label="CPF" width="*"/>
        <el-table-column prop="phoneNumber" sortable label="Telefone" width="*"/>
        <el-table-column prop="profile" sortable label="Perfil" width="*">

        </el-table-column>
        <el-table-column label="Ações" prop="userId"> 
          <template #default="scope"> 
            <el-icon class="table-edit" size="20" color="#A8A8A8" @click="redirectToEditCategory(scope)"><Edit/></el-icon>
          </template>
        </el-table-column>
        <!--<el-pagination layout="prev, pager, next" :total="this.categorias.length" @current-change="setPage">
    </el-pagination>-->
  </el-table> 
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus';
import AuthService from '@/store/authService.js';
import jwtDecode from 'jwt-decode';

export default {
data() {
  return {
    usuarios: [],
    page: 1,
    pageSize: 10,
  }
},
created() {
  const config = { headers: { Authorization: AuthService.getToken() } };

  if (!AuthService.isUserColaborator()) {
    this.$router.replace('/');
  }

  axios.get('http://localhost:8081/users', config)
    .then(response => {
       this.usuarios = response.data;
    })
    .catch(error => {
      console.error('Erro ao obter dados da API:', error);
    });
},
mounted() {
  //this.categorias = Object.values(this.getCategorias())
},
computed: {
  pagedUsuarios() {
    /*return this.categorias.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page)*/
  },
},
methods: {
  redirectToEditCategory(scope) {
      return this.$router.push(`/admin/usuarios/${scope.row.userId}`);
    },
  /*setPage(page) {
    this.page = page
  },*/
  deleteUser(id) {
    console.log("ID:", id);
    const config = { headers: { Authorization: AuthService.getToken() } };
    axios.delete(`http://localhost:8081/users/${id}`, config)
    .then(response => {
      this.usuarios = response.data;
      ElMessage.success('Usuário deletado com Sucesso!')  
      setTimeout(() => {
              window.location.reload()
          }, 2000);
    })
    .catch(error => {
      ElMessage.error('Erro ao deletar Usuário');
    });
  },
},
}
</script>


<style scoped lang="scss">
h1{
  margin-top: 0 !important; 
}
.el-icon{
  font-size: 20px;
}
</style>