<template>
  <div class="container">
    <h1 class="page-title">Meu perfil</h1>
    <el-tabs class="profile-links" v-model="activeName" @tab-click="handleClick">

      <el-tab-pane label="Geral" name="dashboard">
        <div class="dashboard-container">
          <div class="dashboard-left">
            <div class="user-info">
              <h2>Meus dados</h2>

              <div class="info-box">
                <h3 class="info-item title">Nome: </h3>
                <h3 class="info-item text">{{ user.name }}</h3>
              </div>
              <div class="info-box">
                <h3 class="info-item title">Email: </h3>
                <h3 class="info-item text">{{ user.email }}</h3>
              </div>
              <div class="info-box">
                <h3 class="info-item title">CPF: </h3>
                <h3 class="info-item text">{{ formatCPF(user.cpf) }}</h3>
              </div>
              <div class="info-box">
                <h3 class="info-item title">Telefone: </h3>
                <h3 class="info-item text">{{ formatPhoneNumber(user.phoneNumber) }}</h3>
              </div>
              <el-button class="cta" type="primary" @click="activeName = 'configuracoes'">Editar</el-button>
            </div>
            <el-text class="sair-text" type="info" @click="handleLogout">Fazer logout</el-text>
          </div>
          <div class="dashboard-right">
            <div class="dashboard-enderecos">
              <h2> Meus endereços </h2>
              <el-table :data="enderecosDash" style="width: 100%">
                <el-table-column prop="addressNickname" label="Apelido" width="*" />
                <el-table-column label="Rua" width="*">
                  <template #default="{ row }">
                    <span>{{ row.street }}, {{ row.number }} <span v-if=row.details>, {{ row.details }}</span></span>
                  </template>
                </el-table-column>
                <el-table-column prop="cep" label="CEP" width="*" />
                <el-table-column prop="city" label="Cidade" width="*" />
                <el-table-column prop="state" label="Estado" width="*" />
              </el-table>
              <el-button class="cta" type="primary" @click="activeName = 'enderecos'">Ver todos</el-button>
            </div>
            <div class="dashboard-pedidos">
              <h2> Meus pedidos </h2>
              <el-table :data="pedidosDash" style="width: 100%">
                <el-table-column prop="orderId" label="ID" sortable width="80">
                  <template v-slot="scope">
                    <div class="orderId">
                      <h4># {{ scope.row.orderId }}</h4>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="date" label="Data" width="*" />
                <el-table-column prop="status" label="Status" width="*">
                  <template #default="{ row }">
                    <span v-if="row.status == 'ATIVA'"> ATIVO </span>
                    <span v-else>{{ row.status }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="totalPrice" label="Preço Total" width="180">
                  <template #default="{ row }">
                    {{ formatPrice(row.totalPrice) }}
                  </template>
                </el-table-column>
              </el-table>
              <el-button class="cta" type="primary" @click="activeName = 'pedidos'">Ver todos</el-button>
            </div>

          </div>
        </div>
      </el-tab-pane>


      <el-tab-pane label="Endereços" name="enderecos">
        <div class="enderecos-container">
          <div v-if="!showAddAddressForm && !showUserConfigs && !showEditAddressForm" class="address-list">
            <div class="address-list-left">
              <h1>Meus endereços</h1>
              <h2>Adicione, edite ou exclua seus endereços.</h2>
              <el-button type="primary" class="cta" @click="showAddAddressForm = true">Adicionar Novo Endereço</el-button>
            </div>
            <div class="address-list-right">
              <div v-for="address in addresses" :key="address.addressId" class="address-summary">
                <h3>{{ address.addressNickname }} <span><el-icon @click="deleteAddress(address)">
                      <Delete />
                    </el-icon> <el-icon @click="showEditAddressForm = true; getAddressToEdit(address)">
                      <Edit />
                    </el-icon></span></h3>
                <p class="dados-endereco">{{ address.street }}</p>
                <p class="dados-endereco">{{ address.number }}</p>
                <p class="dados-endereco">{{ address.details }}</p>
                <p class="dados-endereco">{{ address.district }}</p>
                <p class="dados-endereco">{{ address.city }} - {{ address.state }}</p>
                <p class="dados-endereco">{{ address.cep }}</p>
              </div>
            </div>
          </div>
          <!-- </div> -->

          <div v-if="showAddAddressForm && !showUserConfigs" class="address-list">
            <div class="address-list-left">
              <h1 class="info-title">Adicionar Novo Endereço</h1>
              <h2>Preencha os campos para adicionar um novo endereço.</h2>
              <el-button @click="showAddAddressForm = false">Cancelar</el-button>
            </div>
            <div class="address-list-right add-address-form">
              <form @submit.prevent="addAddress" class="address-form">
                <div class="form-group">
                  <label for="addressNickname" class="title">Apelido do Endereço:</label>
                  <el-input v-model="newAddress.addressNickname" required />
                </div>
                <div class="form-group">
                  <label for="CEP" class="title">CEP:</label>
                  <el-input placeholder="#####-###" @blur="consultarCEP" v-mask="'#####-###'" maxlength="9"
                    v-model="newAddress.cep" required />
                </div>
                <el-alert type="info" v-if="!cepExists" show-icon :closable="false">
                  <p>O endereço será automaticamente preenchido assim que o CEP for validado.</p>
                </el-alert>
                <div class="form-group">
                  <label for="street" class="title">Rua:</label>
                  <el-input v-model="newAddress.street" required :disabled="!cepExists" />
                </div>
                <div class="form-group">
                  <label for="number" class="title">Número:</label>
                  <el-input v-model="newAddress.number" required :disabled="!cepExists" />
                </div>
                <div class="form-group">
                  <label for="district" class="title">Complemento</label>
                  <el-input v-model="newAddress.details" :disabled="!cepExists" />
                </div>
                <div class="form-group">
                  <label for="district" class="title">Bairro:</label>
                  <el-input v-model="newAddress.district" required :disabled="!cepExists" />
                </div>
                <div class="form-group">
                  <label for="city" class="title">Cidade:</label>
                  <el-input v-model="newAddress.city" required :disabled="!cepExists" />
                </div>
                <div class="form-group">
                  <label for="state" class="title">Estado:</label>
                  <el-input v-model="newAddress.state" required :disabled="!cepExists" />
                </div>
                <div class="form-group">
                  <el-button class="cta" type="primary" native-type="submit">Salvar</el-button>
                </div>
              </form>
            </div>
          </div>

          <div class="address-list" v-if="showEditAddressForm" >
            <div class="address-list-left">
              <h1 class="info-title">Editar Endereço</h1>
              <h2>Preencha os campos para editar um endereço existente.</h2>
              <el-button @click="showEditAddressForm = false">Cancelar</el-button>
            </div>
            <div class="address-list-right add-address-form">
              <form class="address-form">
            <div class="form-group">
              <label class=" title">Apelido: </label>
              <el-input v-model="editedAddress.addressNickname"></el-input>
            </div>
            <div class="form-group">
              <label class=" title">Rua: </label>
              <el-input v-model="editedAddress.street"></el-input>
            </div>
            <div class="form-group">
              <label class=" title">Número: </label>
              <el-input v-model="editedAddress.number"></el-input>
            </div>
            <div class="form-group">
                  <label for="district" class=" title">Complemento</label>
                  <el-input v-model="newAddress.details"/>
                </div>
            <div class="form-group">
              <label class=" title">Bairro: </label>
              <el-input v-model="editedAddress.district"></el-input>
            </div>
            <div class="form-group">
              <label class=" title">Cidade: </label>
              <el-input v-model="editedAddress.city"></el-input>
            </div>
            <div class="form-group">
              <label class="title">Estado: </label>
              <el-input v-model="editedAddress.state"></el-input>
            </div>
            <div class="form-group">
              <label class=" title">CEP: </label>
              <el-input v-model="editedAddress.cep"></el-input>
            </div>
            <el-button type="primary" class="cta" @click="saveEditedAddress(editedAddress)">Salvar</el-button>
          </form>
          </div>
          </div>

        </div>
      </el-tab-pane>


      <el-tab-pane label="Pedidos" name="pedidos">
        <div class="pedidos-container">
          <div class="pedidos-left">
            <h1>Meus pedidos</h1>
            <h2>Veja aqui todos os seus pedidos.</h2>
          </div>
          <div class="pedidos-right">
            <div class="pedidos-table">
              <h2>Móveis do catálogo</h2>
            <el-table :data="pedidosAll" class="perfil-table" style="width: 100%">
              <el-table-column prop="orderId" label="ID" sortable width="80">
                <template v-slot="scope">
                  <div class="orderId">
                    <h4># {{ scope.row.orderId }}</h4>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="date" label="Data" width="300" />
              <el-table-column prop="status" label="Status" width="*">
                <template #default="{ row }">
                  <span v-if="row.status == 'ATIVA'"> ATIVO </span>
                  <span v-else>{{ row.status }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="totalPrice" label="Preço Total" width="180">
                <template #default="{ row }">
                  {{ formatPrice(row.totalPrice) }}
                </template>
              </el-table-column>
              <el-table-column prop="" label="Detalhes" width="180">
                <template #default="scope"> 
              <el-button plain @click="showDetailsModal(scope)">Detalhes</el-button>
            </template>
              </el-table-column>
            </el-table>
          </div>

            <div class="pedidos-table">
              <h2>Móveis modelados</h2>
            <el-table :data="pedidosCmp" style="display: block;">
              <el-table-column prop="orderCmpId" label="ID" sortable>
              <template v-slot="scope">
                <div class="nome">
                  <h4># {{ scope.row.orderCmpId }}</h4>
                </div>
              </template>
            </el-table-column>
              <el-table-column prop="date" label="Data" width="300" />
              <el-table-column prop="status" label="Status" width="*">
                <template #default="{ row }">
                  <span v-if="row.status == 'ATIVA'"> ATIVO </span>
                  <span v-else>{{ row.status }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="totalPrice" label="Preço Total" width="180">
                <template #default="{ row }">
                  {{ formatPrice(row.totalPrice) }}
                </template>
              </el-table-column>
              <el-table-column prop="" label="Detalhes" width="180">
                <template #default="scope"> 
              <el-button plain @click="showDetailCmp(scope)">Detalhes</el-button>
              </template>
              </el-table-column>
            </el-table>
          </div>
          </div>
        </div>

        <el-dialog v-model="showModalCmp">
          <template #header>
            <h2 class="pedidoId">Pedido móvel modelado<span> #{{ order.orderCmpId }}</span></h2>

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
            <div class="orderInfo">
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

        </el-dialog>

        <el-dialog v-model="showModal">
          <template #header>
            <h2 class="pedidoId">Pedido móvel catálogo <span>#{{ order.orderId }}</span></h2>

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
            <div class="orderInfo">
            <h2>Produtos:</h2>
            <el-table :data="order.orderItems" style="100%">
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
          
          <span v-if="hasPerso == true">
            <h2>Personalizações:</h2>
            <el-table :data="order?.orderItems?.options" style="100%">
              <el-table-column prop="section" label="Seção" width="*"/>
              <el-table-column prop="option" label="Opção" sortable width="*"/>
              <el-table-column prop="price" label="Preço" sortable width="*">
                <template v-slot="scope">
                <div class="client_name">
                  <h3>{{ formatPrice(parseInt(scope.row.price)) }}</h3>
                </div>
              </template>
            </el-table-column>
            </el-table>
          </span>
            <h2 class="total">Total: <span>{{ formatPrice(order.totalPrice) }}</span></h2>
          </div>

        </el-dialog>
      </el-tab-pane>


      <el-tab-pane label="Configurações" name="configuracoes">
        <div class="config-container">
          <div class="config-left">
            <h1 class="info-title">Configurações da minha conta</h1>
            <h2>Altere seus dados pessoais e/ou redefina sua senha.</h2>
          </div>
          <div class="config-right">
            <div class="info-box">
              <label class="info-item title">Name: </label>
              <el-input v-model="editUser.name"></el-input>
            </div>
            <div class="info-box">
              <label class="info-item title">Email: </label>
              <el-input v-model="editUser.email"></el-input>
            </div>
            <div class="info-box">
              <label class="info-item title">CPF: </label>
              <el-input v-model="editUser.cpf"></el-input>
            </div>
            <div class="info-box">
              <label class="info-item title">Telefone: </label>
              <el-input v-model="editUser.phoneNumber"></el-input>
            </div>
            <div class="info-box">
              <label class="info-item title">Senha Atual: </label>
              <el-input v-model="editUser.currentPassword"></el-input>
            </div>
            <div class="info-box">
              <label class="info-item title">Nova Senha: </label>
              <el-input v-model="editUser.newPassword"></el-input>
            </div>
            <div class="form-group">
              <el-button type="primary" @click="saveUser" class="cta">Salvar</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>


    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios';
import cartService from '@/store/cartService.js';
import AuthService from '@/store/authService.js';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      user: {},
      hasPerso: false,
      pedidosCmp: null,
      showModal: false,
      selectedOptionsTable: [],
      currentProdCmp: {
      },
      showModalCmp: false,
      enderecosDash: [],
      pedidosDash: [],
      pedidosAll: [],
      activeName: 'dashboard',
      showAddAddressForm: false,
      showEditAddressForm: false,
      showUserConfigs: false,
      newAddress: {
        addressNickname: '',
        street: '',
        number: '',
        district: '',
        city: '',
        state: '',
        cep: '',
      },
      editUser: {
        name: "",
        email: "",
        phoneNumber: "",
        cpf: "",
        currentPassword: "",
        newPassword: ""
      },
      editedAddress: {
        addressId: null, // O ID do endereço a ser editado
        addressNickname: "",
        street: "",
        number: "",
        district: "",
        city: "",
        state: "",
        cep: ""
      },
      persoProducts: [],
      cepExists: false,
      order: null,
      deliveryAddress: {},
    };
  },
  created() {
    if (AuthService.shouldRedirectToLogin(this.$router)) {
      // Interrompe carregamento da tela já que usuário não logou ainda, senão erros aparecem em tela.
      return;
    }
    this.getCmps()
    this.getPedidos(),
    this.getUserInfo();
    this.loadAddresses();
    this.updateUserInfo();
    this.getPedidosAll();
  },
  methods: {
    getPersoProducts(order) {
            order.orderItems.options = [];
            this.persoProducts = cartService.getPersoCart();

            if (this.persoProducts == []) {
              return;
            }

            else {
              order.orderItems.forEach((item) => {
                this.persoProducts.forEach((product) => {
                  if (item.products[0].productId === product.productId) {
                    this.hasPerso = true;
                    order.orderItems.options = product.options;
                  }
                });
              });
              
            }


            console.log(this.order)
        },
    formatPrice(price) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    },
    showDetailsModal(scope) {
      this.showModal = true;
      this.showCmpModal = false;

                
      this.order = this.pedidosAll.find(o => o.orderId === scope.row.orderId);
      this.hasPerso = false;
      console.log(this.order)
      this.getPersoProducts(this.order);

      const address = this.order.deliveryAddress.split(', ');
          address.forEach(item => {
            const split = item.split(': ');
            this.deliveryAddress[split[0]] = split[1];
          });

    },
    showEditAddress(address) {
      this.getAddressToEdit(address.addressId);
      this.showEditAddressForm = true;
    },
    getUserInfo() {
      const config = { headers: { Authorization: AuthService.getToken() } };

      axios.get('http://localhost:8081/users/user-info', config)
        .then((response) => {
          this.user = response.data;
          this.$emit('user-loaded', this.user.name); // Emitir o nome do usuário para a Navbar
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    },

    getPedidos() {
      const config = { headers: { Authorization: AuthService.getToken() } };

      axios.get('http://localhost:8081/orders/client-orders', config)
        .then((response) => {
          // Transforma datas para formato dia/mes/ano.
          response.data = response.data.map(order => {
            const dataArray = order.date;
            const data = new Date(dataArray[0], dataArray[1] - 1, dataArray[2]);

            const day = data.getDate();
            const month = data.getMonth() + 1; // Meses em JavaScript são indexados de 0 a 11
            const year = data.getFullYear();

            // Atribuir a string formatada de volta a order.date
            order.date = `${day}/${month}/${year}`;

            return order;
          });

          response.data.reverse();
          this.pedidosDash = response.data.slice(0, 3);
          
          


          
        })
        .catch((error) => {
          console.error('Erro:', error);
        });
    },

    getCmps() {
      const config = { headers: { Authorization: AuthService.getToken() } };
      axios.get('http://localhost:8081/orders/client-cmp-orders', config)
        .then((response) => {
          response.data = response.data.map(order => {
            const dataArray = order.date;
            const data = new Date(dataArray[0], dataArray[1] - 1, dataArray[2]);

            const day = data.getDate();
            const month = data.getMonth() + 1; // Meses em JavaScript são indexados de 0 a 11
            const year = data.getFullYear();

            // Atribuir a string formatada de volta a order.date
            order.date = `${day}/${month}/${year}`;

            return order;
          });
          response.data.reverse();
          this.pedidosCmp = response.data;
        })
        .catch(error => {
          console.log(error)
        })
    },

    getPedidosAll() {
      const config = { headers: { Authorization: AuthService.getToken() } };

      axios.get('http://localhost:8081/orders/client-orders', config)
        .then((response) => {
          // Transforma datas para formato dia/mes/ano.
          response.data = response.data.map(order => {
            const dataArray = order.date;
            const data = new Date(dataArray[0], dataArray[1] - 1, dataArray[2]);

            const day = data.getDate();
            const month = data.getMonth() + 1; // Meses em JavaScript são indexados de 0 a 11
            const year = data.getFullYear();

            // Atribuir a string formatada de volta a order.date
            order.date = `${day}/${month}/${year}`;
            

            return order;
          });

          response.data.reverse();
          // Fazendo set dos valores na lista de pedidos em tela.
          this.pedidosAll = response.data;

        })
        .catch((error) => {
          console.error('Erro:', error);
        });
    },


    loadAddresses() {
      // Faça uma solicitação ao servidor para carregar a lista de endereços do usuário
      const config = { headers: { Authorization: AuthService.getToken() } };

      axios.get('http://localhost:8081/users/get-user-address', config)
        .then((response) => {
          // limit enderecos dash to 3 items
          this.enderecosDash = response.data.slice(0, 3);
          this.addresses = response.data;
        })
        .catch((error) => {
          console.error('Erro:', error);
        });
    },

    // handleLogout(){  
    //   // Limpar o localStorage
    //   clearLocalStorage();
    // },
    handleLogout() {
      this.$confirm('Tem certeza que deseja sair?', 'Confirmação', {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        // Usuário confirmou a saída, então faz o logout
        AuthService.clearToken();
        clearLocalStorage();
        this.$router.push({ path: '/login' });
      }).catch(() => {
        // Usuário cancelou a saída, não faz nada
      });
    },

    addAddress() {
      const config = { headers: { Authorization: AuthService.getToken() } };

      axios
        .post('http://localhost:8081/users/create-new-address', this.newAddress, config)
        .then((response) => {
          ElMessage.success('Endereço adicionado com sucesso.');
          // reload
          setTimeout(() => {
            window.location.reload();
          }, 2000);

        })
        .catch((error) => {
          ElMessage.error('Erro ao adicionar endereço.');
          console.error('Erro:', error);
        });
    },

    getAddressToEdit(address) {
      const config = { headers: { Authorization: AuthService.getToken() } };
      axios.get(`http://localhost:8081/users/get-user-address/${address.addressId}`, config)
        .then(response => {
          console.log("Resposta ao editar endereço:", response.data);
          this.editedAddress = response.data;
          this.showEditAddressForm = true;
        })
        .catch(error => {
          ElMessage.error('Erro ao obter dados do endereço para edição');
        });
    },

    saveEditedAddress(address) {
      const config = { headers: { Authorization: AuthService.getToken() } };
      const addressId = address.addressId;
      console.log(addressId);

      axios.put(`http://localhost:8081/users/edit-user-address/`, address, config)
        .then(response => {
          ElMessage.success('Endereço editado com sucesso!');
          this.showEditAddressForm = false;
          setTimeout(() => {
              window.location.reload();
            }, 2000);
        })
        .catch(error => {
          ElMessage.error('Erro ao editar endereço');
        });
    },


    updateUserInfo() {
      const config = { headers: { Authorization: AuthService.getToken() } };

      axios.get('http://localhost:8081/users/user-info', config)
        .then((response) => {
          this.editUser = response.data;
        })
        .catch((error) => {
          console.error('Erro:', error);
        });
    },
    saveUser() {
      const config = { headers: { Authorization: AuthService.getToken() } };

      axios.put('http://localhost:8081/users/update-user', this.editUser, config)
        .then((response) => {
          if (response.status === 204) {
            ElMessage.success('Dados do usuário atualizados com sucesso!');
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            console.error('Erro ao atualizar os dados do usuário:', response.statusText);
          }
        })
        .catch((error) => {
          ElMessage({
            message: 'Erro ao atualizar os dados do usuário.',
            type: 'error',
          });
          console.error('Erro:', error);
        });
    },

    deleteAddress(address) {
      // Implementar lógica de exclusão de endereço
      const config = { headers: { Authorization: AuthService.getToken() } };
      axios.delete(`http://localhost:8081/users/delete-user-address/${address.addressId}`, config)
        .then(response => {
          this.addresses = response.data;
          ElMessage.success('Endereço deletado com Sucesso!')
          setTimeout(() => {
            window.location.reload()
          }, 2000);
        })
        .catch(error => {
          ElMessage.error('Erro ao deletar Usuário');
        });
    },

    formatPhoneNumber(phoneNumber) {
      if (!phoneNumber) return '';
      return `+55 (${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 7)}-${phoneNumber.substring(7)}`;
    },
    formatCPF(cpf) {
      if (!cpf) return '';
      return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`;
    },

    consultarCEP() {
      const cep = this.newAddress.cep;

      // Verifique se o CEP foi fornecido antes de fazer a solicitação
      if (cep) {
        this.cepLoading = true;
        axios.get(`https://viacep.com.br/ws/${cep}/json/`)
          .then((response) => {
            const data = response.data;

            if (!data.erro) {
              // Preencha os campos com os dados retornados pela API
              this.newAddress.street = data.logradouro;
              this.newAddress.district = data.bairro;
              this.newAddress.city = data.localidade;
              this.newAddress.state = data.uf;
              this.cepExists = true;
              setTimeout(() => {
                this.cepLoading = false;
              }, 400)

              // Preencha outros campos, se necessário
            } else {
              // Trate o caso em que o CEP não foi encontrado
              // Exiba uma mensagem de erro ou limpe os campos, por exemplo
            }
          })
          .catch((error) => {
            // Trate erros na solicitação, se necessário
            ElMessage.error('CEP não encontrado.');
          });
      }
    },

    showDetailCmp(scope) {
      this.showModalCmp = true;
      this.showModal = false;
      this.selectedOptionsTable = [];
      this.order = this.pedidosCmp.find(o => o.orderCmpId === scope.row.orderCmpId);
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

      const address = this.order.deliveryAddress.split(', ');
          address.forEach(item => {
            const split = item.split(': ');
            this.deliveryAddress[split[0]] = split[1];
          });

      
      
      //this.currentProdCmp = scope.row;
    },
  },

}

// Função para limpar o localStorage
function clearLocalStorage() {
  localStorage.clear();
  console.log('localStorage limpo.');
}
</script>

<style scoped lang="scss">
@import "@/assets/styles/scss/basics.scss";

div.pedidos-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .pedidos-left {
    flex-basis: 30%;
    border: 1px solid $grey-border;
    background-color: $primary-color;
    padding: 20px;
    height: 100%;
  }

  .pedidos-right {
    flex-basis: 65%;
     div.pedidos-table{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid $grey-border;
      background-color: $primary-color;
      padding: 20px;
      margin-bottom: 20px;

      h2{
        font-size: 2rem;
        font-weight: 400;
        margin-top: 0;
        color: $text-color;
      
      }
     }
  }
}

.el-alert.el-alert--info.is-light {
  margin-bottom: 20px;
}

div.config-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .config-left {
    flex-basis: 30%;
    border: 1px solid $grey-border;
    background-color: $primary-color;
    padding: 20px;
    height: 100%;
  }

  .config-right {
    flex-basis: 65%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid $grey-border;
    background-color: $primary-color;
    padding: 20px;
  }

}

div.enderecos-container,
div.pedidos-container,
div.config-container {
  margin-top: 20px;

  h3 {
    font-size: 1.6rem;
    margin-top: 0;
  }

  p {
    font-size: 1.4rem;

  }

  h1 {
    font-size: 5rem;
    font-weight: 300;
    margin-bottom: 0;
  }

  h2 {
    font-size: 2rem;
    font-weight: 400;
    margin-top: 0;
    color: $admin-grey;
  }

  .add-address-form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border: 1px solid $grey-border;
    background-color: $primary-color;
    margin-bottom: 20px;

    .address-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: baseline;

      .form-group {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        :deep(.el-input) {
          width: 80%;
        }
      }
    }
  }

  .address-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .address-list-left {
      flex-basis: 30%;
      border: 1px solid $grey-border;
      background-color: $primary-color;
      height: 100%;
      padding: 20px;
    }

    .address-list-right {
      flex-basis: 65%;
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;

      .address-summary {
        width: 45%;
        background-color: $primary-color;
        border: 1px solid $grey-border;
        margin-bottom: 20px;
        padding: 20px;
        margin-right: 20px;

        h3 {
          display: flex;
          justify-content: space-between;

          i {
            margin-left: 5px;
            cursor: pointer;
          }
        }
      }
    }
  }
}

div.dashboard-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;

  div.dashboard-left {
    flex-basis: 30%;
  }

  div.dashboard-right {
    flex-basis: 65%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    div.dashboard-enderecos,
    div.dashboard-pedidos {
      width: 100%;
      background-color: $primary-color;
      border: 1px solid $grey-border;
      margin-bottom: 50px;
      padding: 20px;

    }
  }

}

h2 {
  font-size: 2rem;
  font-weight: 400;
  margin-top: 0;
  color: $text-color;
}

.user-info {
  background-color: $primary-color;
  padding: 20px;
  border: 1px solid $grey-border;
  margin-bottom: 20px;
  box-shadow: none !important;

  :deep(.el-input) {
          width: 80%;
  }
}

.section-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.info-box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.info-item {
  font-size: 14px;
  /* font-weight: bold; */
  margin: 0;
}

.text {
  font-weight: 400;
}

.title {
  font-size: 16px;
  padding-right: 20px;
  width: 100px;
}

.info-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

.loading-message {
  font-size: 20px;
  font-weight: bold;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
}

.cta {
  margin-top: 20px;
}

.sair-text {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  text-decoration: underline;
  margin-top: 20px;
  cursor: pointer;
  display: inline-block;
  width: 100%;
}

.dados-endereco {
  font-size: 16px;
}

.form-group {
  margin-bottom: 16px;
}

:deep(.el-table .cell) {
  word-break: normal;

  h3{
    font-size: 1.4rem;
    font-weight: 400;
    margin-top: 0;
    color: $text-color;
    margin-bottom: 0;
  
  }

  img{
    width: 50px;
    height: 50px;
  }
}
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

@media screen and (max-width: 768px) {

  h1.page-title{
    font-size: 4rem;
    text-align: center;
  }

  :deep(.el-dialog){
    width: 100% !important;
  }
  div.dashboard-container {
    flex-direction: column;
    align-items: center;

    div.dashboard-left {
      flex-basis: 100%;

      .sair-text{
        margin-bottom: 20px;
      }
    }

    div.dashboard-right {
      flex-basis: 100%;

      div.dashboard-enderecos,
      div.dashboard-pedidos {
        width: 350px;
        overflow-x: scroll;
      }
    }
  }

  div.pedidos-container {
    flex-direction: column;
    align-items: center;

    div.pedidos-left {
      flex-basis: 100%;
      margin-bottom: 20px;
    }

    div.pedidos-right {
      flex-basis: 100%;
       
      width: 340px;
      overflow: scroll;
    }
  }

  div.config-container {
    flex-direction: column;
    align-items: center;

    div.config-left {
      flex-basis: 100%;
      margin-bottom: 20px;
    }

    div.config-right {
      flex-basis: 100%;
    }
  }

  div.address-list {
    flex-direction: column !important;
    align-items: center;

    div.address-list-left {
      flex-basis: 100%;
      margin-bottom: 20px;
    }

    div.address-list-right {
      flex-basis: 100%;

      div.address-summary{
        width: 100% !important;
      }
    }
  }
}
</style>