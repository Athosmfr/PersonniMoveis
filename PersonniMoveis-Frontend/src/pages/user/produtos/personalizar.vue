<template>
    <div class="container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/produtos' }">Produtos</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/produtos/' + product.productId }">{{ product.name }}</el-breadcrumb-item>
            <el-breadcrumb-item>Personalizar</el-breadcrumb-item>
        </el-breadcrumb>

        <h1>Personalizar {{ product.name }}</h1>    
        <div class="content">
            <div class="dropdown-list">
                <div class="dropdown-outer" v-for="section in product.sections" :key="section">
                    <el-collapse accordion v-model="currentSection">
                    <el-collapse-item :title="section.name" :name="section.sectionId">
                    <div class="dropdown-content">
                        <el-radio-group v-model="selected[section.sectionId]">
                            <el-radio-button v-for="option in section.options" :key="option.optionId" @change="resumoCmp"
                                :label="option.optionId" size="large">

                                <el-image :src="option.mainImg"/>{{ option.name }} (R${{ option.price }})
                            </el-radio-button>
                        </el-radio-group>
                    </div>
                    </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
            <div class="product-image">
                <el-image style="width: 500px; height: 500px" :src="product.mainImg" :fit="fit" />
            </div>
            <div class="resumo">
                <h1>Resumo</h1>
                <div class="resumo-item">
                    <el-divider/>
                    <div class="resumo-item-inner" v-for="optionInfo in selectedOptionsInfo" :key="optionInfo">
                        <h3 class="label">{{ optionInfo.section }}</h3>
                        <div class="resumo-item-inner-escolhido">
                            <el-text type="info" class="nome">{{ optionInfo.option }}</el-text>
                            <h2 class="preco">{{ optionInfo.price != 0 ? "R$" + formatPrice(optionInfo.price) : "--" }}</h2>
                        </div>
                        <el-divider/>
                    </div>

                </div>

                <h2 class="total"><span>Total:</span> {{ calcularTotal() != 0 ? "R$" + formatPrice(calcularTotal()) : "--" }}</h2>
                <el-button class="cta" color="var(--cta-color)" size="small" @click="addToCart">Adicionar ao carrinho</el-button>
            </div>
        </div>
    </div>
</template>


<script>
import { ElLoading, ElMessage } from 'element-plus';
import cartService from '@/store/cartService.js';
import axios from 'axios';

export default {
    data() {
        return {
            selectedOptionsInfo: [],
            selected: [],
            product: {
                sections: []
            },
            currentSection: ""
        }
    },
    methods: {
        encontrarElementoESeçãoPorOpção(optionIds) {
            const correspondencias = [];

            for (const section of this.product.sections) {
                for (const option of section.options) {
                    for (const optionId of optionIds) {
                        if (option.optionId == optionId) {
                            correspondencias.push({ section: section, option: option });
                        }
                    }
                }
            }

            return correspondencias;
        },

        // Método chamado quando uma opção é selecionada
        resumoCmp() {
            // IDs das opções selecionadas (por exemplo, IDs de opção de cor e tamanho)
            const selectedOptionIds = this.selected;

            // Encontre as correspondências de seção e opção com base nos IDs selecionados
            const correspondencias = this.encontrarElementoESeçãoPorOpção(selectedOptionIds);

            // Inicialize o array de informações de opções selecionadas
            const selectedOptionsInfo = [];

            correspondencias.forEach(({ section, option }) => {
                // Construa as informações da opção selecionada
                const optionInfo = {
                    section: section.name,
                    option: option.name,
                    price: option.price,
                    img: option.img,
                };

                // Adicione a informação ao array
                selectedOptionsInfo.push(optionInfo);
            });

            // Atualize as informações de opções selecionadas
            this.selectedOptionsInfo = selectedOptionsInfo;
        },
        calcularTotal() {
            let total = 0;
            for (let i = 0; i < this.product.sections.length; i++) {
                let section = this.product.sections[i];
                let selected = this.selected[section.sectionId];
                if (selected) {
                    total += section.options.find(option => option.optionId == selected).price;
                }
            }
            total += this.product.value;
            return total;
        },
        selecionarItem(item) {
            this.product.personalizacoes += item;
            item.selected = true;

        },
        formatPrice(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },

        addToCart() {
            const loading = ElLoading.service({
                lock: true,
                text: 'Carregando...',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            cartService.addToCart(this.product, this.selectedOptionsInfo);
            loading.close();
            ElMessage({
              message: 'Produto adicionado ao carrinho',
              type: 'success',
            })
        }
    },
    async created() {
        const loading = ElLoading.service({
            lock: true,
            text: 'Carregando personalização...',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        axios.get('http://localhost:8081/products/' + this.$route.params.id)
            .then(response => {
                this.product = response.data
                setTimeout(() => {
                    loading.close()
                }, 250)
            })
            .catch(error => {
                console.error('Erro ao obter dados da API:', error);
            });
    }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/scss/basics.scss';

h1{
    font-weight: 300;
}
div.content {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    div.dropdown-list {
        div.dropdown-outer {

            margin-bottom: 2rem;

            div.el-collapse{
                background-color: $primary-color;
                width: 250px;
                border: 1px solid $grey-border;
                transition: 0.2s all ease-in-out;

                :deep(.el-collapse-item__header){
                    background-color: transparent;
                    border: none;
                    color: $text-color;
                    font-size: 1.6rem;
                    font-weight: 400;
                    padding: 2rem;
                    transition: 0.2s all ease-in-out;
                }
                :deep(.el-collapse-item__wrap){
                    background-color: transparent;
                    padding: 0;
                    border: none !important;
                }
                :deep(.el-collapse-item__content){
                    background-color: #EEE;
                    padding: 10px 0;
                }
                :deep(.el-collapse-item:last-child) {
                    margin-bottom: 0;
                }
                &:hover{
                    border-color: var(--cta-color);
                    
                    :deep(.el-collapse-item__header){
                        color: var(--cta-color);
                    }
                }
            }

            div.dropdown-header {
                width: 250px;
                height: fit-content;
                text-align: center;

                h2 {
                    color: $user-grey;
                }

            }

            :deep(.el-radio-button){
                padding: 0 20px !important;
            }

            // secoes esquerda
            label.el-radio-button,
            :deep(span.el-radio-button__inner) {
                width: 100%;
                background-color: transparent;
                transition: 0.2s ease-in-out;
                padding: 0;
                justify-content: space-between;

                .el-image{
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;
                }

                &.is-active{
                    background-color: #18362d;
                }

            }

            label.el-radio-button:hover{
                    background-color: var(--tertiary-darker);

                    :deep(.el-radio-button__inner){
                    color: #fff;
                    }
            }



            div.dropdown-item {
                width: 250px;
                height: fit-content;
                border: 1px solid $user-grey;
                border-top: none;
                text-align: center;


                span,
                h3 {
                    color: #696969;
                }

                &:hover {
                    background-color: #555;
                    color: #fff;
                    cursor: pointer;

                    span,
                    h3 {
                        color: #fff;
                    }
                }

                .item_selecionado {
                    background-color: #555;

                    span,
                    h3 {
                        color: #fff;
                    }
                }

                div.dropdown-item-header {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-around;
                }
            }

        }

    }


    div.resumo {

        border: 1px solid $grey-border;
        padding: 2rem 3rem;
        display: flex;
        flex-direction: column;
        background-color: $primary-color;

        h1 {
            color: $text-color;
            font-size: 3.5rem;
            margin-bottom: 0rem;
            font-weight: 300;
            text-align: center;
        }

        div.resumo-item-inner {

            h3 {
                margin-bottom: 0;
                margin-top: 2rem;
                color: $user-grey;
                font-weight: 400;
            }

            .el-text{
                font-size: 2rem;
                color: $text-color;
            }

            div.resumo-item-inner-escolhido {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;


                h2.nome {
                    margin-right: 10px;
                }

                h2 {
                    font-weight: normal;
                }
            }
        }

        .total {
            margin-top: auto;
            font-weight: 400;
            font-size: 2rem;
            text-align: end;

            span{
                font-size: 1.6rem;
                margin-right: 0.6rem;
                color: var(--el-color-info);
            }
        }

        .cta {
            height: 50px;
            font-size: 2rem;
        }
    }
}
</style>