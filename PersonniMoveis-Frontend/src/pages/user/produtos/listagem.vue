<template>
    <div class="container">

      <div class="catalogo-top">
            <h1 class="page-title">Catálogo</h1>

            <el-input v-model="productSearchInput" placeholder="Procurar produto">
              <template #prefix>
                <el-icon class="el-input__icon"><search /></el-icon>
              </template>
            </el-input>
      </div>

            <el-divider />

            <div class="catalogo-content">
              <div class="filters">
                <div class="filters-item">
                  <el-divider content-position="center">Categorias</el-divider>
                  <el-radio-group @change="applyFilters" v-model="filterCategory" size="large">
                    <el-radio-button
                      v-for="category in categories"
                      :key="category.id"
                      :label="category.id"
                      :value="category.id">
                      {{ category.name }}
                    </el-radio-button>
                  </el-radio-group>
                </div>

              <div class="filters-item">
                  <el-divider content-position="center">Preço</el-divider>
                  <el-radio-group @change="applyFilters" v-model="priceFilter" size="large">
                    <el-radio-button label="crescente">
                      Menor para maior 
                      <!-- Se filtro para ordenar pelo maior é selecionado -->
                      <el-icon><CaretTop /></el-icon>
                    </el-radio-button>
                    <el-radio-button label="decrescente">
                      Maior para Menor <el-icon><CaretBottom /></el-icon>
                    </el-radio-button>
                  </el-radio-group>
                </div>

                <div class="filters-item">
                  <el-divider content-position="center">Disponibilidade</el-divider>
                  <el-radio-group @change="applyFilters" v-model="stockFilter" size="large">
                    <el-radio-button label="disponivel">
                      Disponível
                    </el-radio-button>
                    <el-radio-button label="fora">
                      Fora de estoque
                    </el-radio-button>
                  </el-radio-group>
                </div>

                <div class="filters-item">
                  <el-divider content-position="center">Personalizável</el-divider>
                  <el-radio-group @change="applyFilters" v-model="persoFilter" size="large">
                    <el-radio-button label="sim">
                      Sim
                    </el-radio-button>
                    <el-radio-button label="nao">
                      Não
                    </el-radio-button>
                  </el-radio-group>
                </div>

                <el-button class="cta" @click="removeFilters">Remover Filtros</el-button>
              
              
            </div>


              <div class="produtos-listing">
                <div class="produto-card" v-for="product in filteredProducts" :key="product">
                  <router-link :to='"/produtos/" + product.productId'>
                    <el-card :body-style="{ padding: '0px' }">
                        <el-image v-if="product.mainImg"
                          :src="product.mainImg"
                          class="image"
                        />
                        <div v-else>
                          <img :src="storeConfig.placeholder" class="image placeholder"/>
                          </div>
                        <div style="padding: 14px">
                          <div class="card-bottom">
                            <h2>{{  product.name }}</h2>
                            <div class="card-bottom-details">
                              <div class="details-left">                            
                                <el-text v-if="product.quantity > 0" class="mx-1" type="success" size="small">Disponível</el-text>
                              <el-text v-else class="mx-1" type="danger" size="small">Fora de estoque</el-text>
                              <br>
                              <el-text v-if="product.editable == true" class="mx-1" type="success" size="small">Personalizável</el-text>
                              <el-text v-else class="mx-1" type="danger" size="small"></el-text></div>
                              <h3 v-if="product.quantity > 0">R$ {{ product.value }}</h3>
                            </div>

                          </div>
                        </div>
                    </el-card>
                  </router-link>
                </div>
              </div>

          </div>

        </div>
</template>

<script>
import axios from 'axios';
import { ElLoading, ElMessage } from 'element-plus';
import AuthService from '@/store/authService.js';

export default {
    data() {
      return{
        categories: [],
        products: [],
        filteredProducts: [],
        loading: true,
        filterCategory: null,
        productSearchInput: '',
        priceFilter: null,
        stockFilter: null,
        persoFilter: null,
        storeConfig: {
          placeholder: '',
        },
      }
    },
  async created() {
    const loading = ElLoading.service({
          lock: true,
          text: 'Carregando catálogo...',
          background: 'rgba(0, 0, 0, 0.7)'
    });
    this.getStoreConfig();
    axios.get('http://localhost:8081/category')
      .then(response => {
        this.categories = response.data;

      })
      .catch(error => {
        console.error('Erro ao obter dados da API:', error);
    });
    if (this.$route.query.category) {
      this.filterCategory = this.$route.query.category;

      axios.get("http://localhost:8081/category/products-in-category/" + this.$route.query.category)
        .then(response => {
          response.data.forEach(product => this.products.push(product));
          this.filteredProducts = this.products;
          this.products.forEach(product => {
          if (product.available == 0) {
            this.products.splice(this.products.indexOf(product), 1);
          }
        });
          this.$forceUpdate();
        })
        setTimeout(() => {
          loading.close()
        }, 250)
      
    }
    else{
      axios.get('http://localhost:8081/products')
      .then(response => {
        this.products = response.data;
        // if product.available false, remove from array
        this.products.forEach(product => {
          if (product.available == 0) {
            this.products.splice(this.products.indexOf(product), 1);
          }
        });
        this.filteredProducts = this.products;
        setTimeout(() => {
          loading.close()
        }, 250)
      })
      .catch(error => {
        console.error('Erro ao obter dados da API:', error);
    });
    }
  },
  methods: {
    inputSearch(searchInput, products) {
      return products.filter(product => product.name.toUpperCase().includes(searchInput.toUpperCase()));
    },
    filterPrice(result) {
      if (this.priceFilter == 'crescente') {
        return result.slice().sort((a, b) => a.value - b.value);
      } else if (this.priceFilter == 'decrescente') {
        return result.slice().sort((a, b) => b.value - a.value);
      } else {
        return result.slice();
      }
    },
    filterStock(result) {
      if (this.stockFilter == 'disponivel') {
        return result.slice().filter(product => product.quantity > 0);
      } else if (this.stockFilter == 'fora') {
        return result.slice().filter(product => product.quantity == 0);
      } else {
        return result.slice();
      }
    },
    filterPerso(result) {
      if (this.persoFilter == 'sim') {
        return result.slice().filter(product => product.editable == true);
      } else if (this.persoFilter == 'nao') {
        return result.slice().filter(product => product.editable == false);
      } else {
        return result.slice();
      }
    },
    filterByCategory(result) {
      if (this.filterCategory == null) {
        return result.slice();
      }
      else{
        return result.slice().filter(product => this.filterCategory == '' || product.categoryId == this.filterCategory);
      }
    },


    applyFilters() {
      let result = this.products;

      result = this.filterPrice(result); 
      result = this.filterStock(result);
      result = this.filterPerso(result); 
      result = this.filterByCategory(result);

      this.filteredProducts = result;
    },
    removeFilters() {
      this.priceFilter = null;
      this.stockFilter = null;
      this.persoFilter = null;
      this.filterCategory = null;
      this.filteredProducts = this.products;
      this.$route.query.category = null;
      this.$router.push({ path: '/produtos' });
      this.$forceUpdate();
    },

    /** Remove filtro de preço após filtro ser selecionado. */
    removePriceFilter() {
      this.priceFilter = null;
    },
    getStoreConfig() {
      const config = { headers: { Authorization: AuthService.getToken() } };
      axios.get(`http://localhost:8081/store`, config)
        .then((response) => {
        if (response.status === 200) {
            this.storeConfig.placeholder = response.data.storePlaceholdeImgPath

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

<style scoped lang="scss">
@import '@/assets/styles/scss/basics.scss';

div.catalogo-top{
  display: flex;
  justify-content: space-between;

  .el-input{
    height: 40px;
    width: 200px;
  }

}
div.catalogo-content{
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 50px;
  margin-bottom: 50px;

  .filters-item{
    margin-bottom: 4rem;


  
  }
}
:deep(.el-radio-button__inner){
  border: 1px solid $grey-border !important;
}
div.el-card{
    width: 250px;
    transition: all 0.2s ease-in-out;
    box-shadow: none;

      &:hover{
        transform: scale(1.05);
      }

      div.card-bottom{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 100px;
        max-height: 100px;

        h3{
          margin: 0;
          font-size: 1.5rem;
          font-weight: 400;
        }
        h2{
          font-size: 2rem;
          font-weight: 400;
        }

        span{
          word-break: normal;
        }

        div.card-bottom-details{
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

      }
}
div.produtos-listing{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 70vw;

  div.produto-card{
    margin: 0 15px 30px 15px;
  }
}

.el-image.image, .image {
          width: 100%;
          height: 200px;
        }
.placeholder{
  object-fit: contain;
  padding: 10px;
}

@media (max-width: 768px) {
  div.catalogo-content{
    flex-direction: column;
    align-items: center;
    margin-top: 0;
    margin-bottom: 0;

    .filters-item{
      margin-bottom: 2rem;
    }
    .filters{
      button{
        margin-bottom: 3rem;
      }
    }
  }
  div.produtos-listing{
    width: 100vw;
    justify-content: center;
  }
  div.produto-card{
    margin: 0 15px 30px 15px;
  }
  div.catalogo-top{
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
    h1{
      font-size: 4rem;
    }
  }
}
</style>