<template>
    <div class="admin-container">
      <div class="top-content">
        <div class="left">
          <h1>Pedidos</h1>
        </div>
        <el-input v-model="pedidosSearch" placeholder="Procurar por nome">
          <template #prefix>
            <el-icon class="el-input__icon"><search /></el-icon>
          </template>
        </el-input>
      </div>

      <el-table :data="filteredList() ? filteredList() : pedidos" style="width: 100%;" class="admin-table">
          <el-table-column prop="orderId" label="ID" sortable width="80">
            <template v-slot="scope">
              <div class="orderId">
                <h4># {{ scope.row.orderId }}</h4>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="Tipo" sortable width="*">
            <template v-slot="scope">
              <div class="client_name">
                <h4>{{ scope.row.type }}</h4>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="Valor" sortable width="*">
            <template v-slot="scope">
              <div class="totalPrice">
                <h2>{{ formatPrice(scope.row.totalPrice) }}</h2>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="user.name" label="Cliente" sortable width="*">
            <template v-slot="scope">
              <div class="client_name">
                <h4>{{ scope.row.user.name }}</h4>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="user.email" label="Email" sortable width="*">
            <template v-slot="scope">
              <div class="client_name">
                <h4>{{ scope.row.user.email }}</h4>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status" sortable width="*">
            <template v-slot="scope">
              <div class="status">
                <el-text type="success" v-if="scope.row.status == 'CONCLUIDO'">CONCLUÍDO</el-text>
                <el-text type="danger" v-else-if="scope.row.status == 'CANCELADO'">CANCELADO</el-text>
                <el-text type="warning" v-else-if="scope.row.status == 'ATIVA'">ATIVO</el-text>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="Data" sortable width="*">
            <template v-slot="scope">
              <div class="date">
                <h4>{{ scope.row.date }}</h4>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Ações" prop="id"> 
            <template #default="scope"> 
              <el-button plain @click="showDetailsModal(scope)">Detalhes</el-button>
            </template>
          </el-table-column>
          <!--<el-pagination layout="prev, pager, next" :total="this.categorias.length" @current-change="setPage">
          </el-pagination>-->
      </el-table> 
    </div>

    <el-dialog v-model="showModal">
      <template #header>
        <h2 class="pedidoId" v-if="order.orderCmpId">Pedido móvel modelado <span>#{{ order.orderId }}</span></h2>
        <h2 class="pedidoId" v-else>Pedido móvel catálogo <span>#{{ order.orderId }}</span></h2>
      </template>
        
        <div class="clientInfo">
          <h2> Dados do cliente: </h2>
          <h4>{{ order.user.name }}</h4>
          <h4>{{ order.user.email }}</h4>
          <h4>{{ deliveryAddress.Rua }} {{ deliveryAddress.Número }}</h4>
          <h4>{{ deliveryAddress.Observações }}</h4>
          <h4>{{ deliveryAddress.Bairro }}</h4>
          <h4>{{ deliveryAddress.Cidade }}</h4>
          <h4>{{ deliveryAddress.CEP }}</h4>
        </div>
        <div class="orderInfo" v-if="order.orderCmpId">

          <h2>Escolhas:</h2>
            <el-table :data="selectedOptionsTable" style="100%">
              <el-table-column prop="section" label="Seção" sortable>
              <template v-slot="scope">
                <div class="nome">
                  <p>{{ scope.row.section }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="element" label="Elemento" sortable>
              <template v-slot="scope">
                <div class="nome">
                  <p>{{ scope.row.element }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="img" label="Imagem">
              <template v-slot="scope">
                <div class="nome">
                  <div v-if="scope.row.image" class="table-image">
                    <el-image :src="scope.row.image" />
                  </div>
                  <!--<div v-else class="table-image">
                    <img :src="storeConfig.placeholder" />
                  </div>-->
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="option" label="Opção" sortable>
              <template v-slot="scope">
                <div class="nome">
                  <p>{{ scope.row.option }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="Preço" sortable>
              <template v-slot="scope">
                <div class="nome">
                  <p>{{ scope.row.price != 0 ? "R$ " + scope.row.price : "--" }}</p>
                </div>
              </template>
            </el-table-column>
          </el-table>
            
          <h2 class="total">Total: <span>{{ formatPrice(order.totalPrice) }}</span></h2>
        </div>
        <div class="orderInfo" v-else>
        <h2>Produtos:</h2>
          <el-table :data="padroes" style="100%">
            <el-table-column prop="products[0].productId" label="ID" sortable width="80">
              <template v-slot="scope">
                <div class="orderId">
                  <h3># {{ scope.row.products[0].productId }}</h3>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="products[0].mainImg" label="Imagem" width="100">
              <template v-slot="scope">
                <div class="orderId">
                  <img :src="scope.row.products[0].mainImg" width="50px" height="50px">
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="selectedAmountOfProducts" label="Quantidade" sortable width="130"/>
            <el-table-column prop="products[0].name" label="Nome" sortable width="*">
              <template v-slot="scope">
                <div class="client_name">
                  <h3>{{ scope.row.products[0].name }}</h3>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="Preço" sortable width="*">
              <template v-slot="scope">
                <div class="client_name">
                  <h3>{{ formatPrice(parseInt(scope.row.products[0].value)) }}</h3>
                </div>
              </template>
            </el-table-column>
          </el-table>

        <h2 class="total">Total: <span>{{ formatPrice(order.totalPrice) }}</span></h2>
      </div>
      
    </el-dialog>

    <el-dialog v-model="showModalCmp">
      <template #header>
        <h2 class="pedidoId">Pedido Modelado<span>#{{ currentProdCmp }}</span></h2>
      </template>
        <div class="orderInfo">
        <h2>Produtos:</h2>
      </div>
    </el-dialog>
</template>

<script>
import { ElLoading } from 'element-plus';
import axios from 'axios';
import AuthService from '@/store/authService.js';
import jwtDecode from 'jwt-decode';

export default {
    data() {
    return {
      pedidos: [],
      showModalCmp: false,
      currentProdCmp: '',
      order: null,
      page: 1,
      pageSize: 10,
      pedidosSearch: '',
      showModal: false,
      personalizados: [],
      padroes: [],
      modelados: [],
      deliveryAddress: {},
    }
  },
  created() {
    this.getOrders();
    this.getCmps();
    const token = AuthService.getToken();

    if (token) {
      const usuario = jwtDecode(token);

      if (usuario) {
        if (usuario.userRole === 'COLABORATOR' || usuario.userRole === 'ADMIN') {
          // Usuário tem permissão de colab ou admin, continue carregando a página
        } else if (usuario.userRole === 'USER') {
          this.$router.push("/"); // Para voltar à página anterior
        }
      }
    }
  },

  methods: {
    getOrders() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Carregando pedidos...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axios.get('http://localhost:8081/orders')
        .then(response => {
          // Transforma datas para formato dia/mes/ano.
          response.data = response.data.map(order => {
          const dataArray = order.date;
          const data = new Date(dataArray[0], dataArray[1] - 1, dataArray[2]);
          const day = data.getDate();
          const month = data.getMonth() + 1; // Meses em JavaScript são indexados de 0 a 11
          const year = data.getFullYear();
          // Atribuir a string formatada de volta a order.date
          order.date = `${day}/${month}/${year}`;
          order.type = 'CATALOGO'
          
          this.pedidos.reverse()
          this.pedidos.push(order);

          return order;
        });
        // Fazendo set dos valores na lista de pedidos em tela.
        setTimeout(() => {
            loading.close()
          }, 250)
        })
        .catch(error => {
          console.error('Erro ao obter dados da API:', error);
        });
    },
    getCmps() {
      axios.get('http://localhost:8081/orders/cmp')
        .then(response => {
          // Transforma datas para formato dia/mes/ano.
          console.log(response.data)
          response.data = response.data.map(order => {
          const dataArray = order.date;
          const data = new Date(dataArray[0], dataArray[1] - 1, dataArray[2]);
          const day = data.getDate();
          const month = data.getMonth() + 1; // Meses em JavaScript são indexados de 0 a 11
          const year = data.getFullYear();
          // Atribuir a string formatada de volta a order.date
          order.date = `${day}/${month}/${year}`;
          order.type = 'MODELADO'

          
          order.orderId = order.orderCmpId

          this.pedidos.reverse()
          this.pedidos.push(order);

          return order;
        });
        })
        .catch(error => {
          console.error('Erro ao obter dados da API:', error);
        });
    
    },
    filteredList() {
      return this.pedidos.filter(pedido => {
        return pedido.user.name.toLowerCase().includes(this.pedidosSearch.toLowerCase()) || pedido.user.email.toLowerCase().includes(this.pedidosSearch.toLowerCase())
      })
    },
    showDetailsModal(scope) {
      this.showModal = true;
      if (scope.row.orderCmpItems){
        
        this.selectedOptionsTable = [];
        this.order = this.pedidos.find(o => o.orderCmpId === scope.row.orderCmpId);
        scope.row.orderCmpItems[0].productCmps[0].sectionCmps.forEach((section) => {
          section.elementCmps.forEach((element) => {
            this.selectedOptionsTable.push({
              image: element.optionCmps[0].img,
              section: section.name,
              element: element.name,
              option: element.optionCmps[0].name,
              price: element.optionCmps[0].price,
            });
          });
        });

      }
      else {
        this.order = this.pedidos.find(o => o.orderId === scope.row.orderId);
      }

      //this.personalizados = this.order.orderItems.filter(item => item.options);
      // format this "CEP: 82300-310, Cidade: Curitiba, Bairro: São Braz, Rua: Rua João Obrzut, Número: 474, Observações: " into different items into deliveryAddress array and remove text before :

      const address = this.order.deliveryAddress.split(', ');
      address.forEach(item => {
        const split = item.split(': ');
        this.deliveryAddress[split[0]] = split[1];
      });
      //this.padroes = this.order.orderItems.filter(item => !item.options);
    },
    formatPrice(x) {
      return x.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

  },

}
</script>

<style scoped lang="scss">
.clientInfo, .orderInfo{
  h2{
    font-size: 2.5rem;
    font-weight: 800;
    margin-top: 20px;
    margin-bottom: 0;
  }
  h4{
    font-size: 1.6rem;
    font-weight: 400;
    margin-top: 10px !important;
    margin-bottom: 0;
  }
  h2.total{
    font-weight: 400;
    font-size: 2rem;
    text-align: end !important;

    span{
      font-weight: 800;
      font-size: 2.5rem;
    }
  }
}
.pedidoId {
  margin: 0;
  padding: 0;
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 1rem;

  span{
    color: var(--cta-color);
    font-weight: 700;
  }
}

</style>