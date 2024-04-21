<template>
    <div class="admin-container">
      <div class="top-content">
        <div class="left">
          <h1>Categorias</h1>
          <router-link :to="{path: '/admin/categorias/adicionar'}"><el-button class="cta" color="$admin-cta">+ Nova Categoria</el-button></router-link>
        </div>
        <el-input v-model="categorySearch" placeholder="Procurar por nome">
          <template #prefix>
            <el-icon class="el-input__icon"><search /></el-icon>
          </template>
        </el-input>
      </div>

      <el-table :data="filteredList() ? filteredList() : categorias" style="width: 100%;" class="admin-table">
          <el-table-column prop="id" label="ID" sortable width="80">
            <template v-slot="scope">
              <div class="id">
                <h4># {{ scope.row.id }}</h4>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Nome" sortable width="*">
            <template v-slot="scope">
              <div class="nome">
                <h2>{{ scope.row.name }}</h2>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="allow_creation" sortable label="Possibilitar modelagem">
            <template v-slot="scope">
              <div class="personalizavel">
                <el-icon v-if="scope.row.allow_creation == false" color="#F56C6C"><CircleCloseFilled /></el-icon>
                <el-icon v-if="scope.row.allow_creation == true" color="#67c23a"><SuccessFilled /></el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Ações" prop="id"> 
            <template #default="scope"> 
              <el-icon class="table-edit" size="20" color="#A8A8A8" @click="redirectToEditCategory(scope)"><Edit/></el-icon>
              <el-icon class="table-delete" size="20" color="#F56C6C" plain @click="showDeleteMessage(scope.row.id)"><Delete/></el-icon> 
            </template>
          </el-table-column>
          <!--<el-pagination layout="prev, pager, next" :total="this.categorias.length" @current-change="setPage">
      </el-pagination>-->
    </el-table> 
    </div>
</template>

<script>
import axios from 'axios'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import AuthService from '@/store/authService.js';
import jwtDecode from 'jwt-decode';

export default {
  data() {
    return {
      categorias: [],
      page: 1,
      pageSize: 10,
      categorySearch: '',
    }
  },
  created() {
  if (!AuthService.isUserColaborator()) {
      this.$router.replace('/');
  }
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

  },
  mounted() {
    //this.categorias = Object.values(this.getCategorias())
  },
  computed: {
    pagedCategorias() {
      /*return this.categorias.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page)*/
    },
  },
  methods: {
    /*setPage(page) {
      this.page = page
    },*/
    redirectToEditCategory(scope) {
      return this.$router.push(`/admin/categorias/${scope.row.id}`);
    },
    filteredList() {
      return this.categorias.filter(categoria => {
        return categoria.name.toLowerCase().includes(this.categorySearch.toLowerCase())
      })
    },
    showDeleteMessage(scope) {
      ElMessageBox.confirm('Tem certeza que deseja remover a categoria?', 'Confirmação', {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não', // Nesse caso não faz nada.
        type: 'warning',
      })
      .then(() => {
        // Usuário marcou sim -> deletar produto e atualizar tabela.
        this.deleteCategory(scope);
      })
      .catch(() => {
        // Nada é feito na seleção do 'não'.
      });
    },
    deleteCategory(id) {
      axios.delete(`http://localhost:8081/category/${id}`)
      .then(response => {
        ElMessage.success('Categoria deletada com Sucesso!')  
        this.categorias = this.categorias.filter(categoria => categoria.id != id);
      })
      .catch(error => {
        ElMessage.error('Erro ao deletar Categoria');
      });
    },
  },
}
</script>


<style>

</style>
