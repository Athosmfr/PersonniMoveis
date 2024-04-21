<script setup>
import { LocationFilled, Select, WalletFilled } from '@element-plus/icons-vue';
</script>

<template>
    <el-menu mode="horizontal" :ellipsis="false" background-color="#FEFEFE" text-color="var(--tertiary-color)"
        active-text-color="var(--tertiary-color)" @select="handleSelect">
        <el-menu-item><router-link to="/"><img style="width: 200px;" :src="storeConfig.logo" /></router-link></el-menu-item>

        <el-steps align-center :active="currentStep" finish-status="success" simple class="checkout-steps">
            <el-step title="Endereço de entrega" :icon="LocationFilled" />
            <el-step title="Forma de pagamento" :icon="WalletFilled" />
            <el-step title="Finalizar pedido" :icon="Select" />
        </el-steps>
    </el-menu>

    <div class="container">

        <div class="carrinho-content">

            <div class="endereco" v-if="currentStep == 0">
                <h1>Endereço de entrega</h1>
                <el-radio-group v-model="addressChoice">
                    <el-radio border size="large" label="existingAddress">Escolher endereço cadastrado</el-radio>
                    <el-radio-group v-if="addressChoice === 'existingAddress'" v-model="selectAddress"
                        class="existing-address-radio">
                        <div v-for="address in userAddresses" :key="address.addressId">
                            <el-radio border size="default" :label="address.addressNickname"
                                @change="selectExistingAddress(address)">
                            </el-radio>
                        </div>
                    </el-radio-group>
                    <el-radio border size="large" label="newAddress" @change="clearSelectedAddress">Cadastrar novo
                        endereço</el-radio>
                </el-radio-group>

                <el-form :model="endereco" label-position="top" v-if="addressChoice === 'newAddress'">
                    <el-col :span="10">
                        <el-form-item label="Apelido">
                            <el-input v-model="endereco.addressNickname" required></el-input>
                        </el-form-item>
                        <el-form-item label="CEP">
                            <el-input placeholder="#####-###" v-model="endereco.cep" required @blur="consultarCEP"
                                v-mask="'#####-###'" maxlength="9"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-alert type="info" v-if="!cepExists" show-icon :closable="false">
                        <p>O endereço será automaticamente preenchido assim que o CEP for validado.</p>
                    </el-alert>

                    <div class="after-cep" v-loading="cepLoading">
                        <el-form-item label="Rua">
                            <el-input v-model="endereco.street" :disabled="!cepExists" required></el-input>
                        </el-form-item>
                        <div class="small-inputs">
                            <el-form-item label="Número">
                                <el-input v-model="endereco.number" :disabled="!cepExists" required></el-input>
                            </el-form-item>
                            <el-form-item label="Complemento (Opcional)">
                                <el-input v-model="endereco.details" :disabled="!cepExists"></el-input>
                            </el-form-item>
                            <el-form-item label="Cidade">
                                <el-input v-model="endereco.city" :disabled="!cepExists" required></el-input>
                            </el-form-item>
                            <el-form-item label="Estado">
                                <el-input v-model="endereco.state" :disabled="!cepExists" required></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>

                <div class="actions">
                    <router-link to="/carrinho"><el-button type="info" plain><el-icon>
                                <DArrowLeft />
                            </el-icon> Retornar ao carrinho</el-button></router-link>
                    <el-button type="primary" @click="nextStep">Próximo passo <el-icon>
                            <ArrowRightBold />
                        </el-icon></el-button>
                </div>
            </div>

            <div class="forma-pagamento" v-if="currentStep == 1">
                <h1>Forma de pagamento</h1>

                <el-radio-group v-model="metodoPagamento">
                    <el-radio label="card" size="large" border disabled>Cartão de crédito</el-radio>
                    <el-radio label="card" size="large" border disabled>Cartão de débito</el-radio>
                    <el-radio label="pix" size="large" border>PIX</el-radio>
                </el-radio-group>

                <el-form :model="endereco" v-if="metodoPagamento == 'card'">
                    <el-form-item label="Nome no cartão">
                        <el-input v-model="cartao.nomeCartao"></el-input>
                    </el-form-item>
                    <el-form-item label="Número do cartão">
                        <el-input placeholder="#### #### #### ####" maxlength="15" v-model="cartao.NumeroCartao"></el-input>
                    </el-form-item>
                    <div class="smaller-inputs">
                        <el-form-item label="Mês">
                            <el-input placeholder="##" maxlength="2" v-model="cartao.mes"></el-input>
                        </el-form-item>
                        <el-form-item label="Ano">
                            <el-input placeholder="##" maxlength="2" v-model="cartao.ano"></el-input>
                        </el-form-item>
                        <el-form-item label="CVV">
                            <el-input placeholder="###" maxlength="3" v-model="cartao.CvvCartao"></el-input>
                        </el-form-item>
                    </div>
                </el-form>



                <div class="actions">
                    <el-button type="info" plain @click="previousStep"><el-icon>
                            <ArrowLeftBold />
                        </el-icon> Voltar</el-button>
                    <el-button type="primary" @click="nextStep">Próximo passo <el-icon>
                            <ArrowRightBold />
                        </el-icon></el-button>
                </div>

            </div>

            <div class="side-info" v-if="currentStep !== 3 && currentStep !== 2">

                <el-card class="box-card" shadow="never">
                    <div class="card-header card-item">
                        <h2><el-icon>
                                <GoodsFilled />
                            </el-icon> Resumo do pedido</h2>
                    </div>
                    <div class="card-item" v-for="product in products" :key="product">
                        <div class="card-item-inner">
                            <div class="card-item-about">
                                <h3 v-if="product.name">{{ product.amount }} x {{ product.name }}</h3>
                                <h3 v-else>{{ product.amount }} x Móvel modelado</h3>
                                <el-text v-if="product.custom" type="success"> Personalizado </el-text>
                                <el-text type="info" size="small"
                                    v-if="product.description !== 'string' && product.description">{{ product.description
                                    }}</el-text>
                            </div>
                            <div class="card-item-price">
                                <h4>{{ formatPrice(product.value * product.amount) }}</h4>
                            </div>
                        </div>
                    </div>
                    <div class="card-item frete">
                        <el-text type="info" size="small">Frete: </el-text>
                        <h4> {{ frete != 0 ? formatPrice(frete) : "--" }}
                        </h4>
                    </div>
                    <div class="card-item subtotal">
                        <el-text type="info" size="medium">Total ({{ totalAmount() }} itens): </el-text>
                        <h3> {{ totalPrice() != 0 ? totalPrice() : "--" }}
                        </h3>
                    </div>


                </el-card>

            </div>

            <div class="finalizar" v-if="currentStep == 2">
                <h1>Finalizar pedido</h1>

                <div class="finalizar-content">
                    <div class="finalizar-left">
                        <div class="user-info">
                            <el-card class="box-card" shadow="never">
                                <div class="card-header card-item">
                                    <h2><el-icon>
                                            <LocationFilled />
                                        </el-icon> Endereço de entrega</h2>
                                </div>
                                <div class="card-item">
                                    <template v-if="selectedAddress">
                                        <h4>{{ selectedAddress.name }}</h4>
                                        <h4>{{ selectedAddress.street }} {{ selectedAddress.number }}</h4>
                                        <h4>{{ selectedAddress.cep }}</h4>
                                        <h4>{{ selectedAddress.district }}</h4>
                                        <h4>{{ selectedAddress.city }}, {{ selectedAddress.state }}</h4>
                                    </template>
                                    <!-- Display the new address if entered -->
                                    <template v-else-if="endereco.cep">
                                        <h4>{{ endereco.name }}</h4>
                                        <h4>{{ endereco.street }} {{ endereco.number }}</h4>
                                        <h4>{{ endereco.cep }}</h4>
                                        <h4>{{ endereco.district }}</h4>
                                        <h4>{{ endereco.city }}, {{ endereco.state }}</h4>
                                    </template>
                                </div>
                            </el-card>

                        </div>

                        <div class="pagamento-info">
                            <el-card class="box-card" shadow="never">
                                <div class="card-header card-item">
                                    <h2><el-icon>
                                            <WalletFilled />
                                        </el-icon> Forma de pagamento</h2>
                                </div>
                                <div class="card-item">
                                    <img src="../../../assets/img/logoPix.png"
                                        style="width: 100%; max-width: 200px; margin-bottom: 20px;/">

                                </div>
                            </el-card>
                        </div>

                        <div class="frete">
                            <el-card class="box-card" shadow="never">
                                <div class="card-header card-item">
                                    <h2><el-icon>
                                            <Promotion />
                                        </el-icon> Frete</h2>
                                </div>
                                <div class="card-item">
                                    <h3>{{ formatPrice(frete) }}</h3>
                                    <h4>Entrega em até 20 dias úteis</h4>
                                </div>
                            </el-card>
                        </div>

                    </div>

                    <div class="finalizar-right">
                        <el-card class="box-card" shadow="never">
                            <div class="card-header card-item">
                                <h2><el-icon>
                                        <GoodsFilled />
                                    </el-icon> Resumo do pedido</h2>
                            </div>
                            <div class="card-item" v-for="product in products" :key="product">
                                <div class="card-item-inner">
                                    <div class="card-item-about">
                                        <h3 v-if="product.name">{{ product.amount }} x {{ product.name }}</h3>
                                        <h3 v-else>{{ product.amount }} x Móvel modelado</h3>
                                        <el-text v-if="product.custom" type="success"> Personalizado </el-text>
                                        <el-text type="info" size="small"
                                            v-if="product.description != 'string' && product.description != ''">{{
                                                product.description }}</el-text>
                                    </div>
                                    <div class="card-item-price">
                                        <h4>{{ formatPrice(product.value * product.amount) }}</h4>
                                    </div>
                                </div>
                            </div>
                            <div class="card-item frete">
                                <el-text type="info" size="small">Frete: </el-text>
                                <h4> {{ frete != 0 ? formatPrice(frete) : "--" }}
                                </h4>
                            </div>
                            <div class="card-item subtotal">
                                <el-text type="info" size="medium">Total ({{ totalAmount() }} itens): </el-text>
                                <h3> {{ totalPrice() != 0 ? formatPrice(totalPrice()) : "--" }}
                                </h3>
                            </div>
                        </el-card>
                        <div class="actions">
                            <el-button type="info" plain @click="previousStep"><el-icon>
                                    <ArrowLeftBold />
                                </el-icon> Voltar</el-button>
                            <el-button type="success" @click="makeOrder()" size="large">Confirmar pedido</el-button>
                        </div>

                    </div>
                </div>
            </div>

            <div class="final-step" v-if="currentStep == 3">
                <h1>Pedido concluído</h1>
                <h2>Tempo Restante: {{ minutos }}:{{ segundos < 10 ? '0' : '' }}{{ segundos }} minutos</h2>
                        <h2>Não saia dessa tela</h2>
                        <img v-if="QrCode != null" :src=QrCode>
                        <div class="mega-icon">
                            <el-icon color="#67c23a">
                                <SuccessFilled />
                            </el-icon>
                        </div>

                        <router-link to="/"><el-text tag="ins" type="info">Voltar para a página
                                inicial</el-text></router-link>


            </div>

        </div>

    </div>
</template>

<script>
import AuthService from '@/store/authService';
import cartService from '@/store/cartService.js';
import axios from 'axios';
import { ElLoading, ElMessage } from 'element-plus';
import { ref } from 'vue';

export default {
    data() {
        return {
            tempoRestante: 60 * 5, // 5 minutos em segundos
            QrCode: null,
            currentStep: 0,
            metodoPagamento: "pix",
            selected: [],
            loading: false,
            cepLoading: false,
            productsCmp: {
                id: 0,
                value: 0,
                quantity: 0,
                imgUrl: "string",
                description: "",
                sectionProductCmpDtos: [],
            },
            product: {
                sections: [],
                amount: 1,
            },
            categoria: {
                name: "",
                allow_creation: false,
                sectionCmps: [],
            },
            endereco: {
                addressNickname: "",
                cep: "",
                street: "",
                number: "",
                details: "",
                district: "",
                city: "",
                state: "",
            },
            cartao: {
                nomeCartao: "",
                NumeroCartao: "",
                mes: "",
                ano: "",
                CvvCartao: ""
            },
            orders: [
                {
                    requestProduct: {
                        product: null,
                        amount: null
                    },
                    requestCmp: {
                        productCmp: null,
                        amount: null
                    }
                }
            ],
            products: [],
            regularProducts: [],
            productCmps: [],
            userAddresses: [],
            cepExists: false,
            addressAdded: false,
            selectedAddress: null,
            selectAddress: "",
            addressChoice: 'existingAddress',
            storeConfig: {
                logo: '',
                address: '',
            },
            apiKey: "removed-for-public-repository",
            frete: 0,
        };
    },
    computed: {
        minutos() {
            return Math.floor(this.tempoRestante / 60);
        },
        segundos() {
            return this.tempoRestante % 60;
        },
    },
    mounted() {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=` + this.apiKey + `&callback=initGoogleMap`;
        script.defer = true;
        script.async = true;
        document.head.appendChild(script);

    },
    created() {
        // Usuário deve estar logado para acessar checkout.
        if (AuthService.shouldRedirectToLogin(this.$router)) {
            return;
        }

        const loading = ElLoading.service({
            lock: true,
            text: 'Carregando..',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        // Inicializa lista de produtos do carrinho (em tela) com os produtos adicionados no localstorage.
        this.getStoreConfig();
        this.regularProducts = cartService.getCartItems();
        this.cmpProducts = cartService.getCmpItems();

        // Faça a solicitação GET para obter os endereços do usuário
        this.loadUserAddresses();

        this.products = this.regularProducts.concat(this.cmpProducts);
        setTimeout(() => {
            loading.close()
        }, 250)
    },
    methods: {
        iniciarTemporizador() {
            // Verifique se a palavra "checkout" está presente na URL
            if (window.location.href.includes('checkout')) {
                this.temporizador = setInterval(() => {
                    if (this.tempoRestante > 0) {
                        this.tempoRestante--;
                    } else {
                        // Quando o temporizador atinge zero, redirecione para outra tela
                        clearInterval(this.temporizador);
                        // Adicione aqui o código para redirecionar para outra tela
                        this.$router.push('/');
                    }
                }, 1000);
            } else {
                // Se não estiver na página de checkout, cancele o temporizador
                console.log('Temporizador cancelado porque não está na página de checkout.');
            }
        },
        calcularFrete() {

            let totalPrice = 0;
            // Se houverem produtos no carrinho, soma ao valor do total.
            if (this.products && this.products.length > 0) {
                totalPrice += this.totalProducts();
            }
            // Se houverem cpms, soma ao valor do total.
            if (this.productCmps && this.productCmps.length > 0) {
                totalPrice += this.totalCmps();
            }

            let frete = parseInt(totalPrice) * 0.1;

            this.frete = frete;
        },


        beforeDestroy() {
            clearInterval(this.temporizador);
        },
        // selectAddress(address) {
        //     this.selectedAddress = address;
        // },
        selectExistingAddress(address) {
            this.selectedAddress = address;
        },
        clearSelectedAddress() {
            this.selectedAddress = null;
        },
        totalAmount() {
            let total = 0;
            // enumerate products
            if (this.products && this.products.length > 0) {
                total += this.products.reduce((total, product) => {
                    return total + product.amount;
                }, 0);
            }
            return total;
        },
        /** Faz pedidos e retorna qrcode pix. */
        makeOrder() {
            const loading = ElLoading.service({
                lock: true,
                text: 'Carregando...',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            // Inicializa ordersReq
            const ordersReq = {
                requestProduct: [],
                requestCmp: [],
                shipmentFee: Number(this.frete),
                deliveryAddress: "" // Inicializa com uma string vazia, você pode ajustar conforme necessário
            };

            // Insere produtos no array de prods.
            if (cartService.getCartItems().length > 0) {
                cartService.getCartItems().forEach(prod => {
                    ordersReq.requestProduct.push({
                        product: prod,
                        amount: prod.amount
                    });
                });
            }

            // Insere cmps no array de cmps.
            if (cartService.getCmpItems().length > 0) {
                cartService.getCmpItems().forEach(cmp => {
                    ordersReq.requestCmp.push({
                        productCmp: cmp,
                        amount: cmp.amount
                    });
                });
            }

            // Obtém o endereço escolhido
            let theAddress = null;
            if (this.addressChoice === 'existingAddress' && this.selectedAddress) {
                theAddress = this.selectedAddress;
            } else if (this.addressChoice === 'newAddress' && this.endereco) {
                theAddress = this.endereco;
            }

            if (theAddress) {
                const formatString = "CEP: %cep, Cidade: %city, Bairro: %district, Rua: %street, Número: %number, Observações: %details";

                ordersReq.deliveryAddress = formatString.replace(/%(\w+)/g, (match, key) => {
                    return theAddress[key.toLowerCase()];
                });

                console.log(ordersReq.deliveryAddress);

                // Faz requisição enviando pedidos.
                if (ordersReq.requestProduct.length > 0 || ordersReq.requestCmp.length > 0) {
                    const config = {
                        headers: { Authorization: AuthService.getToken() },
                        params: { shipmentFee: ordersReq.shipmentFee }
                    };

                    axios.post('http://localhost:8081/orders/create-order', ordersReq, config)
                        .then(response => {
                            ElMessage.success('Pedido registrado com sucesso.');
                            this.QrCode = response.data;
                            cartService.removeAllFromCarts();
                            this.currentStep = 3;
                            this.iniciarTemporizador();
                        })
                        .catch(error => {
                            ElMessage.error('Não foi possível registrar o pedido.');
                            console.error(error);
                        })
                        .finally(() => {
                            loading.close();
                        });
                } else {
                    ElMessage.warning('Devem haver produtos no carrinho para realizar o pedido!');
                    loading.close();
                }
            } else {
                console.error("Endereço inválido.");
                loading.close();
            }
        },
        consultarCEP() {
            const cep = this.endereco.cep;

            // Verifique se o CEP foi fornecido antes de fazer a solicitação
            if (cep) {
                this.cepLoading = true;
                axios.get(`https://viacep.com.br/ws/${cep}/json/`)
                    .then((response) => {
                        const data = response.data;

                        if (!data.erro) {
                            // Preencha os campos com os dados retornados pela API
                            this.endereco.street = data.logradouro;
                            this.endereco.district = data.bairro;
                            this.endereco.city = data.localidade;
                            this.endereco.state = data.uf;
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

        addAddress() {
            const config = { headers: { Authorization: AuthService.getToken() } };

            axios.post('http://localhost:8081/users/create-new-address', this.endereco, config)
                .then((response) => {
                    ElMessage.success('Endereço adicionado com sucesso.');

                    this.addressAdded = true;
                    // Atualize a lista de endereços do usuário após adicionar um novo endereço
                    // this.loadUserAddresses();

                    // reload
                    // setTimeout(() => {
                    //     window.location.reload();
                    // }, 2000);
                })
                .catch((error) => {
                    ElMessage.error('Erro ao adicionar endereço.');
                    console.error('Erro:', error);
                });
        },

        formatPrice(x) {
            return x.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        },

        nextStep() {
            if (this.currentStep == 0) {
                if (this.addressChoice === 'newAddress' && !this.addressAdded) {
                    this.addAddress();
                }
                if (this.selectAddress == "" && this.addressChoice != 'newAddress') {
                    ElMessage.error('Selecione um endereço.');
                    return;
                }
                this.calcularFrete();
            }
            this.currentStep++;
        },
        previousStep() {
            this.currentStep--;
        },
        /** Popula lista em tela com os produtos do carrinho armazenados em local storage. */

        /** Calcula o valor de todos os produtos e cmps selecionados pelo usuário. */
        totalPrice() {
            let total = 0;
            // Se houverem produtos no carrinho, soma ao valor do total.
            if (this.products && this.products.length > 0) {
                total += this.totalProducts();
            }
            // Se houverem cpms, soma ao valor do total.
            if (this.productCmps && this.productCmps.length > 0) {
                total += this.totalCmps();
            }

            this.productsCmp.value = total;

            total += this.frete
            console.log(total)
            return this.formatPrice(total);
        },
        // Calculo dos produtos e personalizações.
        totalProducts() {
            const productsTotal = this.products.reduce((total, product) => {
                // Se o produto é personalizável, calcula o total das personalizações
                let personalizationTotal = 0;
                if (product.editable && product.sections && product.sections.length > 0) {
                    personalizationTotal = this.totalOption(product.sections);
                }
                // Calcula o total do produto considerando o valor base e as personalizações
                let productTotal = (product.value + personalizationTotal) * product.amount;
                // Soma o total do produto ao total geral.
                return total + productTotal;
            }, 0);
            return productsTotal;
        },
        /** Calcula valor total das opções selecionadas em um produto. */
        totalOption(sections) {
            // Se não há opções no produto (não foi personalizado), retorna 0.
            if (!(sections.options && sections.options > 0)) {
                return 0;
            }
            return sections.reduce((sectionTotal, section) => {
                // Soma o preço de todas as opções selecionadas na seção
                let optionsTotal = section.options.reduce((optionTotal, option) => {
                    return optionTotal + option.price;
                }, 0);
                // Soma o total da seção ao total da personalização.
                return sectionTotal + optionsTotal;
            }, 0);
        },

        // Calculo dos cmps e edições.
        totalCmps() {
            // const cmpsTotal = this.productsCmp.reduce((total, cmp) => {
            //     let total = 0;
            // }, 0);
            return 0;
        },
        loadUserAddresses() {
            const config = { headers: { Authorization: AuthService.getToken() } };

            // Substitua a URL abaixo pela URL real do seu endpoint de endereços
            axios.get('http://localhost:8081/users/get-user-address', config)
                .then((response) => {
                    this.userAddresses = response.data; // Armazene os endereços na variável do componente
                })
                .catch((error) => {
                    // Lide com erros de forma apropriada, por exemplo, exibindo uma mensagem de erro
                    console.error('Erro ao carregar endereços:', error);
                });
        },
        getStoreConfig() {
            const config = { headers: { Authorization: AuthService.getToken() } };
            axios.get(`http://localhost:8081/store`, config)
                .then((response) => {
                    if (response.status === 200) {
                        this.storeConfig.logo = response.data.storeLogoPath
                        this.storeConfig.address = response.data.storeAddress

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
@import "@/assets/styles/scss/basics.scss";

.el-menu {
    display: flex;
    justify-content: space-between;
    height: 100px;
}

.checkout-steps {
    padding: 0 5% 0 20vw;
    width: 100%;
}

.el-steps--simple {
    background: transparent;
}

:deep(.el-step.is-simple .el-step__title) {
    font-size: 14px;
    line-height: 16px;
    word-break: normal !important;
}

:deep(.el-step__head.is-finish) {
    color: var(--tertiary-color);
    border-color: var(--tertiary-color);
}

:deep(.el-step__title.is-finish) {
    color: var(--tertiary-color);
}

.el-step.is-simple .el-step__title {
    font-size: 14px;
    line-height: 20px;
}

:deep(.el-step.is-simple .el-step__arrow::after),
:deep(.el-step.is-simple .el-step__arrow::before) {
    width: 2px;
}

.container {
    padding-top: 1%;
}

.el-radio-group {
    margin-bottom: 20px;
}

.el-radio.is-bordered.el-radio--large {
    width: 100%;
    margin: 0;
    margin-bottom: 10px;
}

:deep(.el-loading-mask) {
    background-color: transparent;
}

.small-inputs {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &>.el-form-item {
        width: 25rem;
    }
}

.smaller-inputs {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &>.el-form-item {
        width: 15rem;
    }
}

.final-step {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .mega-icon {
        margin-top: 50px;

        .el-icon {
            width: 100%;

            &>svg {
                height: 10em !important;
                width: 10em !important;
            }
        }
    }
}

.carrinho-content {
    margin-top: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    h1 {
        font-size: 32px;
        margin-bottom: 20px;
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        color: $text-color;
    }

    .endereco,
    .forma-pagamento,
    .revisao {
        flex-basis: 45%;
        margin: 0 10px;
    }

    .forma-pagamento {
        width: 100%;
    }

    .actions {
        display: flex;
        justify-content: space-between;
        margin-top: 3rem;
    }

    .side-info {
        flex-basis: 30%;
        margin: 0 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .actions {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            button {
                width: 100%;
                margin: 10px 0;
            }
        }
    }

}


.titulo-address {
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    .el-radio-group {
        margin-left: 20px;
        width: fit-content;
        display: inline-block;
    }

    .el-radio-button {
        display: inline;
        /* Faz o botão de rádio ficar em linha com o texto */
    }
}

body .el-radio-group {
    display: inline-block;
    flex-direction: column;
}

.radio-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    line-height: 22px;
    margin-top: 5px;
    margin-bottom: 30px;
}

.radio-button {
    width: 20px;
    height: 20px;
    border: 2px solid #007BFF;
    border-radius: 50%;
    margin-right: 10px;
    position: relative;
}

input[type="radio"] {
    display: none;
}

input[type="radio"]:checked+.radio-button::before {
    content: "X";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    font-weight: bold;
    color: #007BFF;
}

.finalizar {
    width: 100%;
}

.finalizar-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .finalizar-left,
    .finalizar-right {
        flex-basis: 45%;
    }
}

.box-card {
    width: 100%;
    margin-bottom: 20px;
}

.el-card {
    background-color: $primary-color;
    border: 2px solid var(--el-card-border-color);

    h2 {
        display: flex;
        align-items: center;
        font-size: 20px;
        margin-bottom: 4rem;

        i {
            margin-right: 10px;
        }
    }

    h3 {
        font-weight: 400;
        font-size: 18px;
        margin-bottom: 5px;
        margin-top: 0px;
    }

    h4 {
        font-size: 14px;
        font-weight: 400;
        margin-top: 0px;
        margin-bottom: 5px;
    }

    div.card-header.card-item {
        padding: 0.5rem 0 0 2rem;
    }

    .card-item {
        padding: 16px;
        padding-top: 0px;
    }

    .card-item-inner {
        font-size: 12px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-bottom: 2rem;
        border-bottom: 1px solid var(--el-card-border-color);

        .card-item-about {
            width: 70%;
            padding-right: 4rem;

            .el-text--small {
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: normal;
            }
        }

        .card-item-price {
            width: 30%;
            text-align: end;
            //margin-left: 30%;
        }

    }

    .card-item.subtotal {
        display: flex;
        justify-content: flex-end;
        align-items: baseline;

        h4 {
            margin-bottom: 0px;
        }

        h3 {
            margin-left: 1rem;
        }
    }

    .card-item.frete {
        display: flex;
        justify-content: flex-end;
        align-items: baseline;

        h4 {
            margin: 0;
            margin-left: 1rem;
        }
    }

    :deep(.el-card__body) {
        padding: 0px;
    }

    .preco-final {
        font-size: 20px;
        padding: 20px;
        text-align: center;

        h3 {
            color: green;
        }
    }
}

@media screen and (max-width: 768px) {
    .carrinho-content {
        flex-direction: column;
        width: 100%;

        .side-info {
            margin: 0;
            margin-top: 20px;
        }

        .forma-pagamento,
        .endereco {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0;
        }
    }

    div.finalizar {
        width: 100%;

        .finalizar-content {
            flex-direction: column;
            width: 100%;

            .finalizar-left,
            .finalizar-right {
                width: 100%;
            }
        }

        h1 {
            text-align: center;
        }
    }

    :deep(.el-radio) {
        width: 100%;
    }

    :deep(.el-radio-group) {
        width: 100%;
    }

    .actions {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;

        a {
            width: 100%;
        }

        :deep(.el-button) {
            width: 100%;
            margin: 0;
            margin-top: 20px;
        }
    }

    .el-menu {
        display: flex;
        flex-direction: column;
        height: 100%;

        li {
            height: 100px;
        }

        .checkout-steps {
            padding: 10px;
        }
    }
}</style>