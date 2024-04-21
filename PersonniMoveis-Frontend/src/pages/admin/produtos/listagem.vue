<template>
  <div class="admin-container">
    <div class="top-content">
      <div class="left">
        <h1>Produtos</h1>
        <router-link :to="{path: '/admin/produtos/adicionar'}"><el-button class="cta" color="$admin-cta">+ Novo produto</el-button></router-link>
      </div>
      <el-input v-model="productSearch" placeholder="Procurar por nome">
              <template #prefix>
                <el-icon class="el-input__icon"><search /></el-icon>
              </template>
            </el-input>
    </div>

    <el-table :data="filteredList() ? filteredList() : tableData" style="width: 100%;" class="admin-table">
      <el-table-column prop="productId" label="ID" sortable width="80">
        <template v-slot="scope">
          <div class="id">
            <h4># {{ scope.row.productId }}</h4>
          </div>
        </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="Categoria" sortable width="150">
        <template v-slot="scope">
          <div class="categoria">
            <h4>{{ scope.row.categoryName }}</h4>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainImg" label="Imagem" width="100" >
        <template v-slot="scope">
          <img :src="scope.row.mainImg"/>
        </template>
      </el-table-column>
      <el-table-column class="nome" prop="name" label="Nome" sortable width="*">
        <template v-slot="scope">
          <div class="nome">
            <h2>{{ scope.row.name }}</h2>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="value" sortable label="Preço" width="100">
        <template v-slot="scope">
          <div class="preco">
            <h3>{{ formatPrice(scope.row.value) }}</h3>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" sortable label="Estoque" width="100">
        <template v-slot="scope">
          <div class="estoque">
            <el-text type="success" v-if="scope.row.quantity >= 1">{{ scope.row.quantity }}</el-text>
            <el-text type="danger" v-else-if="scope.row.quantity == 0">0</el-text>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="editable" sortable label="Personalizável" width="150">
        <template v-slot="scope">
          <div class="personalizavel">
            <el-icon v-if="scope.row.editable == false" color="#F56C6C"><CircleCloseFilled /></el-icon>
            <el-icon v-if="scope.row.editable == true" color="#67c23a"><SuccessFilled /></el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="available" sortable label="Catálogo" width="120">
        <template v-slot="scope">
          <div class="personalizavel">
            <el-icon v-if="scope.row.available == false" color="#F56C6C"><CircleCloseFilled /></el-icon>
            <el-icon v-if="scope.row.available == true" color="#67c23a"><SuccessFilled /></el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="acoes" label="Ações" width="100" class="actions">
        <template #default="scope">
          <el-icon class="table-edit" size="20" color="#A8A8A8" @click="redirectToEditProduct(scope)"><Edit/></el-icon>
          <el-icon class="table-delete" size="20" color="#F56C6C" plain @click="showDeleteMessage(scope)"><Delete/></el-icon>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import AuthService from '@/store/authService.js';
import jwtDecode from 'jwt-decode';

export default {
  data() {
    return {
      tableData: [],
      productSearch: '',
    }
  },
  created() {
    // Adquire todos produtos.
    this.getProducts();
    if (!AuthService.isUserColaborator()) {
      this.$router.replace('/');
    }
  },
  methods: {
    filteredList() {
      return this.tableData.filter(product => {
        return product.name.toLowerCase().includes(this.productSearch.toLowerCase())
      })
    },
    formatPrice(x) {
      // to BRL
      return x.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    },
    /** Faz redirecionamento para tela de edição do produto. */
    redirectToEditProduct(scope) {
      return this.$router.push(`/admin/produtos/${scope.row.productId}`);
    },
    /** Deleta produto e atualiza tabela. */
    showDeleteMessage(scope) {
      ElMessageBox.confirm('Tem certeza que deseja remover o produto?', 'Confirmação', {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não', // Nesse caso não faz nada.
        type: 'warning',
      })
      .then(() => {
        // Usuário marcou sim -> deletar produto e atualizar tabela.
        this.deleteProduct(scope);
        // Atualiza lista de produtos.
        const excludedProductId = scope.row.productId;
        this.tableData = this.tableData.filter(product => product.productId != excludedProductId);
      })
      .catch(() => {
        // Nada é feito na seleção do 'não'.
      });
    },
    /** Envia requisição para remover produto. */
    deleteProduct(scope) {
      axios.delete(`http://localhost:8081/products/${scope.row.productId}`)
        .then(response => {
          ElMessage.success('O produto foi removido com sucesso!');
        })
        .catch(error => {
          console.error('Não foi possível remover o produto.', error);
        });
    },
    async getProducts() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Carregando produtos...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    
      try {
        const response = await axios.get('http://localhost:8081/products');
        this.tableData = response.data;
      
        for (const product of this.tableData) {
          product.categoryName = await this.getCategoryName(product.categoryId);
        }
      
        setTimeout(() => {
          loading.close();
        }, 250);
      } catch (error) {
        console.error('Erro ao obter dados da API:', error);
      }
    },
    
    async getCategoryName(id) {
      try {
        const response = await axios.get(`http://localhost:8081/category/${id}`);
        return response.data.name;
      } catch (error) {
        console.error('Erro ao obter dados da API:', error);
      }
    },

    trueOrFalse(isEditable) {
      return isEditable ? 'Sim' : 'Não';
    },
  }
}
</script>

<style scoped lang="scss">
</style>