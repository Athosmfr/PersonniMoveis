<template>
    <div class="admin-container">
        <h1><router-link class="underline-router" to="/admin/produtos">Produtos</router-link> > Adicionar</h1>
        <el-form :model="product" label-width="*" label-position="top">

            <div class="product-content">
                <div class="left-content">
                    <h2>Produto</h2>
                    <el-form-item required label="Nome" size="large">
                        <el-input placeholder="Novo produto" v-model="product.name"></el-input>
                    </el-form-item>
                    <!-- Preço -->
                    <el-form-item label="Preço">
                        <el-input controls-position="right" v-model="product.value" class="preco-input">
                            <template #prepend>R$</template>
                        </el-input>
                    </el-form-item>
                    <!-- Estoque -->
                    <el-form-item label="Estoque">
                        <el-input-number v-model="product.quantity" :min="0" controls-position="right">
                        </el-input-number>
                    </el-form-item>
                    <!-- Descrição -->
                    <el-form-item label="Descrição">
                        <el-input :maxlength="250" type="textarea" placeholder="Descrição..."
                            v-model="product.description"></el-input>
                    </el-form-item>
                    <!-- Disponível -->
                    <el-form-item label="Mostrar no catálogo">
                        <el-switch active-text="Sim" inactive-text="Não" v-model="product.available"></el-switch>
                    </el-form-item>
                    <!-- Imagem principal -->
                    <el-form-item label="Imagem principal">
                        <!-- Adicione a diretiva v-if para condicionalmente renderizar o el-upload -->
                        <el-upload v-if="!product.mainImg" class="avatar-uploader" :auto-upload="false" :limit="1"
                            @change="handleImageChange">
                            <el-icon class="avatar-uploader-icon">
                                <Upload />
                            </el-icon>
                        </el-upload>
                        <div class="avatar-container">
                            <div class="image-wrapper-principal">
                                <img v-if="product.mainImg" :src="product.mainImg" class="avatar-principal" />
                                <div class="overlayPrincipal" @click="PrincipalImgRemove" v-if="product.mainImg">
                                    <el-icon class="table-delete" size="50" color="#A8A8A8" style="border: 50px;">
                                        <Delete />
                                    </el-icon>
                                </div>
                            </div>
                        </div>
                    </el-form-item>

                    <!-- Imagens secundárias -->
                    <el-form-item label="Imagens secundárias">
                        <div class="secondary-image-list">
                            <el-upload class="avatar-uploader secondary-image-uploader" multiple :auto-upload="false"
                                :limit="999" @change="handleSecondaryImagesChange">
                                <el-icon v-if="secondaryImagesArray.length < 999" class="avatar-uploader-icon">
                                    <Upload />
                                </el-icon>
                            </el-upload>
                            <div v-for="(image, index) in secondaryImagesArray" :key="index" class="avatar-container"
                                @click="removerimg(index)">
                                <div class="image-wrapper">
                                    <img :src="image" class="avatar" />
                                    <div class="overlay">
                                        <el-icon class="table-delete" size="50" color="#A8A8A8" style="border: 50px;">
                                            <Delete />
                                        </el-icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-form-item>



                    <!-- Categoria -->
                    <el-form-item label="Categoria">
                        <el-select filterable collapse-tags clearable v-model="this.selectedCategory"
                            placeholder="Selecione">
                            <el-option v-for="category in this.fetchedCategories" :key="category.id" :label="category.name"
                                :value="category.id" />
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="Imagens secundárias">

                    </el-form-item> -->
                </div>

                <el-divider direction="vertical" />

                <!-- Detalhes do produto -->
                <div class="center-content">
                    <h2>Detalhes do produto</h2>
                    <div class="details">
                        <div class="detail-item" v-for="detail in product.details" v-bind:key="detail">
                            <el-divider />
                            <el-icon v-on:click="removeItem(product.details, detail)"
                                style="margin-right: 35px; float: right; margin-top: 33px; cursor: pointer;" :size="20"
                                color="#A8A8A8">
                                <CloseBold />
                            </el-icon>
                            <div>
                                <el-form-item label="Título">
                                    <el-input v-model="detail.fieldContent" placeholder="Novo título"></el-input>
                                </el-form-item>
                                <el-form-item label="Descrição">
                                    <el-input type="textarea" maxlength="250" placeholder="Descrição..." show-word-limit
                                        label="Conteúdo" v-model="detail.detailField"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <el-divider class="divider-button" v-on:click="newDetail()">
                            <el-icon>
                                <Plus />
                            </el-icon> Detalhe
                        </el-divider>
                    </div>
                </div>

                <el-divider direction="vertical" />

                <div class="right-content">
                    <h2>Permitir personalização</h2>
                    <el-form-item>
                        <el-switch v-model="product.editable" active-text="Sim" inactive-text="Não"></el-switch>
                    </el-form-item>

                    <div class="criar-content" v-if="product.editable">

                        <div class="elements">
                            <el-collapse accordion v-model="currentOpenSection">
                                <div v-for="section in product.sections" v-bind:key="section">
                                    <el-collapse-item class="element-item" :name="section.sectionID">
                                        <template #title>
                                            <h1> {{ section.name ? section.name : 'Nova seção' }} </h1>
                                            <p v-if="section.options.length"> - {{ section.options.length }} {{
                                                section.options.length != 1 ? 'opções' : 'opção' }} </p>
                                            <el-icon v-on:click="removeItem(product.sections, section)"
                                                style="margin-left: 8px; cursor: pointer;" :size="20" color="#A8A8A8">
                                                <Delete />
                                            </el-icon>
                                        </template>

                                        <div>

                                            <el-form-item label="Nome">
                                                <el-input v-model="section.name"></el-input>
                                            </el-form-item>



                                            <div class="option-item" v-for="option in section.options" v-bind:key="option">
                                                <el-divider />
                                                <div class="inputs">
                                                    <div class="basic-inputs">
                                                        <el-form-item label="Opção">
                                                            <el-input v-model="option.name" size="small"></el-input>
                                                        </el-form-item>
                                                        <el-form-item label="Preço">
                                                            <el-input v-model="option.price" size="small">
                                                                <template #prepend>R$</template></el-input>
                                                        </el-form-item>
                                                    </div>
                                                    <el-form-item label="Imagem">
                                                        <div>
                                                            <el-upload class="avatar-uploader" :auto-upload="false"
                                                                limit="1" @change="handleOptionImageChange($event, option)">
                                                                <img v-if="option.mainImg" :src="option.mainImg"
                                                                    class="avatar" />
                                                                <el-icon v-else class="avatar-uploader-icon">
                                                                    <Upload />
                                                                </el-icon>
                                                            </el-upload>
                                                        </div>
                                                    </el-form-item>
                                                    <el-icon v-on:click="deleteCascade(section, option)"
                                                        style="margin-left: 8px; float: right; cursor: pointer;" :size="20"
                                                        color="#A8A8A8">
                                                        <Delete />
                                                    </el-icon>
                                                </div>
                                            </div>
                                            <el-button class="option-button" v-on:click="newOption(section)">
                                                <el-icon>
                                                    <Plus />
                                                </el-icon> Opção
                                            </el-button>

                                        </div>
                                    </el-collapse-item>

                                </div>


                                <el-button class="section-button" v-on:click="newSection()">
                                    <el-icon>
                                        <Plus />
                                    </el-icon> Seção
                                </el-button>

                            </el-collapse>
                        </div>

                    </div>
                </div>
            </div>
            <el-form-item>
                <el-button class="cta" type="primary" @click="createProduct" :disabled="!product.name">Salvar</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus'
import imgConverter from '@/store/imgConverter.js';
import AuthService from '@/store/authService';
import jwtDecode from 'jwt-decode';

export default {
    data() {
        return {
            product: {
                name: '',
                value: 0,
                quantity: 1,
                editable: false,
                mainImg: null,
                description: '',
                available: true,
                sections: [],
                details: [],
                secondaryImages: {
                    img: [],
                    productImgId: 0,
                },
                material: '',
                tags: []
            },
            uniqueKey: 0,
            fetchedCategories: [],
            materials: [],
            fetchedTags: [],
            selectedTags: [],
            fetchedMaterials: [],
            selectedCategory: null,
            selectedMaterial: null,
            secondaryImagesArray: [], // Array para armazenar as imagens selecionadas
            currentOpenSection: ""
        };
    },

    created() {
        if (!AuthService.isUserColaborator()) {
            this.$router.replace('/');
        }
        // Carrega dados necessários ao entrar na tela.
        const loading = ElLoading.service({
            lock: true,
            text: 'Carregando..',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        this.getCategories();
        setTimeout(() => {
            loading.close()
        }, 250)
    },

    methods: {

        PrincipalImgRemove() {
            this.product.mainImg = null;
            this.uniqueKey += 1; // Isso forçará a recriação do componente
        },
        removerimg(index) {
            // Função para remover a imagem com base no índice
            this.secondaryImagesArray.splice(index, 1);
        },

        async handleSecondaryImagesChange(file, fileList) {
            try {
                // Adquire a imagem como string base64.
                const base64String = await imgConverter.fileToBase64String(file.raw);

                // Adiciona a nova imagem ao array existente
                this.secondaryImagesArray.push(base64String);
            } catch (error) {
                ElMessage.error('Erro - não foi possível fazer o upload da imagem.');
            }
        },


        /** Faz requisição para adquirir todas categorias. Produto só deve ter UMA CATEGORIA. */
        getCategories() {
            axios.get('http://localhost:8081/category')
                .then(response => {
                    this.fetchedCategories = response.data;
                }).catch(error => {
                    console.error('Erro ao obter categorias: ', error);
                });

        },
        /** Faz requisição para criar produto. */
        createProduct() {
            // Se categoria foi atribuida, adquire id e seta na requisição como parâmetro opcional, senão mostra exceção.
            if (this.selectedCategory == '' || this.selectedCategory == null) {
                ElMessage.error('Para ser cadastrado, o produto deve ter uma categoria selecionada!');
                return;
            }
            if (isNaN(this.product.value) || this.product.value < 1) {
                ElMessage.error('Para que o produto seja criado, é necessário que seu "Preço" seja um valor numérico maior que 0');
                return;
            }
            if (this.product.value != '') {
                this.product.value = this.product.value.replace(/\./g, '').replace(',', '.');
            }
            if (this.product.quantity < 1 && this.product.available) {

                ElMessage.error('Para que o produto esteja "disponível", é necessário ter ao menos 1 em estoque');
                return;
            }
            // Produto deve ter ao menos 1 em qtde para ser disponível.
            const loading = ElLoading.service({
                lock: true,
                text: 'Criando produto',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            const config = { params: { categoryId: this.selectedCategory } }

            this.product.secondaryImages.img = this.secondaryImagesArray;
            // Fazendo requisição para criação do produto e seus subitens, redireciona para página de listagem.
            axios.post('http://localhost:8081/products/save-full-product', this.product, config)
                .then((response) => {
                    ElMessage.success('Produto criado com sucesso.')
                    loading.close()
                    this.$router.push('/admin/produtos')
                })
                .catch((error) => {
                    ElMessage.error('Erro ao criar produto.');
                    loading.close()
                });
        },
        async handleImageChange(file, fileList) {
            try {
                // Adquire imagem como string base64.
                this.product.mainImg = await imgConverter.fileToBase64String(file.raw);
            } catch (error) {
                ElMessage.error('Erro - não foi possível fazer o upload da imagem.')
            }
        },
        async handleOptionImageChange(file, option) {
            try {
                // Adquire imagem como string base64.
                console.log(option)
                option.mainImg = await imgConverter.fileToBase64String(file.raw);
            } catch (error) {
                ElMessage.error('Erro - não foi possível fazer o upload da imagem.')
            }
        },
        /**
         * Adiciona seção no produto
         * @param {Product} product Produto onde será adicionado a seção.
         */
        newSection() {
            this.product.sections.push({
                name: "",
                mainImg: "",
                options: [],
                sectionID: this.product.sections.length + 1
            })

            setTimeout(() => {
                this.currentOpenSection = this.product.sections.length
            }, 100)
        },
        /**
         * Adiciona a opção na seção.
         * @param {Section} section Seção onde será adicionada a opção.
         */
        newOption(section) {
            section.options.push({
                name: '',
                mainImg: '',
                price: 0,
            });
        },
        /**Insere novo detalhe do produto */
        newDetail() {
            this.product.details.push({
                fieldContent: '',
                detailField: ''
            })
        },
        /** Deleta o item selecionado de qualquer coleção com itens. */
        removeItem(itemList, itemToBeRemoved) {
            // Encontra índice do item a ser removido e faz splice removendo.
            const index = itemList.indexOf(itemToBeRemoved);
            itemList.splice(index, 1);
        },
        deleteCascade(Seccao, Option) {
            const product = this.product;
            // remote option from section
            const index = Seccao.options.indexOf(Option);
            Seccao.options.splice(index, 1);
        },
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/styles/scss/basics.scss";


.image-wrapper-principal {
    position: relative;
    overflow: hidden;
}

.image-wrapper {
    position: relative;
    overflow: hidden;
}

.avatar-principal {
    width: 102px;
    height: 102px;
    display: block;
}

.avatar-container:hover .avatar {
    filter: blur(4px);
    /* Adiciona o efeito de desfoque à imagem ao passar o mouse */
    cursor: pointer;
}

.avatar{
    height: 102px;
    width: 102px;
}

.overlayPrincipal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.overlayPrincipal i {
    color: #A8A8A8;
}

.overlayPrincipal:hover {
    opacity: 1;
    /* Torna o overlay visível ao passar o mouse */
}

.overlayPrincipal i:hover {
    filter: blur(0);
    /* Adiciona o efeito de desfoque ao ícone ao passar o mouse */
}

.avatar-container:hover .avatar-principal {
    filter: blur(4px);
    /* Adiciona o efeito de desfoque à imagem ao passar o mouse */
    cursor: pointer;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.overlay i {
    color: #A8A8A8;
}

.overlay:hover {
    opacity: 1;
    /* Torna o overlay visível ao passar o mouse */
}

.overlay i:hover {
    filter: blur(0);
    /* Adiciona o efeito de desfoque ao ícone ao passar o mouse */
}


.avatar-container {
    position: relative;
    overflow: hidden;
}

.image-wrapper {
    position: relative;
    overflow: hidden;
}

.avatar-container:hover .avatar {
    filter: blur(4px);
    /* Adiciona o efeito de desfoque à imagem ao passar o mouse */
    cursor: pointer;
}

.avatar-container:hover .overlay {
    opacity: 1;
    /* Torna o overlay visível ao passar o mouse */
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    /* Define uma cor de fundo para o overlay */
    opacity: 0;
    transition: opacity 0.3s ease;
    /* Adiciona uma transição suave para a opacidade */
}

.overlay i {
    color: #A8A8A8;
    /* Define a cor do ícone no overlay */
}


hr {
    border: 1px solid $admin-grey;
    margin: 30px 0;
}

h2 {
    font-size: 20px;
    font-weight: 400;
}

.el-input.section-input {
    width: 50%;
}

.elements {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.element-card {
    border: 1px solid $admin-grey;
    padding: 0 20px 20px 20px;
    width: 300px;
    margin: 20px 20px 0 0;

    h2 {
        text-align: center;
        color: $admin-grey;
    }
}

.avatar-uploader .avatar-principal {
    width: 178px;
    height: 178px;
    display: block;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

:deep(.el-upload) {
    border: 1px dashed $admin-grey;

    &:hover {
        border: 1px dashed var(--cta-color);
    }
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;

    &:hover {
        color: var(--cta-color);
    }
}

.avatar-uploader .avatar {
    width: 100px;
    height: 100px;
    display: block;
    min-width: 100px;
    min-height: 100px;
}

:deep(ul.el-upload-list) {
    display: none;
}

.product-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .left-content,
    .right-content,
    .center-content {
        flex-basis: 30%;
    }

    .el-divider--vertical {
        height: auto;
        border-left: 2px var(--el-border-color) var(--el-border-style);
    }
}

.preco-input {
    width: 50%;
}

:deep(.el-divider__text.is-center) {
    display: flex;
    align-items: center;
    color: var(--cta-color);

    .el-icon {
        margin-right: 10px;
    }
}

.divider-button {
    border-top: 1px solid var(--cta-color);
    cursor: pointer;
    height: 10px;
}

.detail-item {
    width: 100%;

    &>i {
        margin: 0 !important
    }
}



.inputs {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

div.element-card {
    width: 100%;
    margin: 0 0 20px 0;
}

div.element-item {
    width: 100%;
    margin-bottom: 15px;
    border: 1px solid $grey-border;

    :deep(.el-collapse-item__header) {
        border-bottom: 0;

        h1 {
            font-size: 20px;
            margin: 0;
            padding-left: 10px;
        }

        p {
            font-size: 14px;
            color: $admin-grey;
            margin: 0;
            margin-left: 5px;
        }
    }

    :deep(.el-collapse-item__content) {
        padding: 20px;
        background: #f6f6f6;
    }
}

.basic-inputs {
    padding-right: 15%;
}

.el-collapse {
    width: 100%;
}

.section-button {
    width: 100%;
    height: 48px;
    background: transparent;
    border: 1px solid $admin-grey;
    color: $admin-grey;
    font-size: 20px;

    &:hover {
        color: var(--cta-color);
        background: transparent;
        border-color: var(--cta-color);
    }

    &:active,
    &:focus {
        background: transparent;
        border-color: $admin-grey;
        color: $admin-grey;
    }

    i {
        margin-right: 5px;
    }

}

.option-button {
    width: auto;
    height: 20px;
    background: transparent;
    border: 1px solid $admin-grey;
    color: $admin-grey;
    font-size: 14px;
    margin: 0;
    width: 100%;

    &:hover {
        color: var(--cta-color);
        background: transparent;
        border-color: var(--cta-color);
    }

    &:active,
    &:focus {
        background: transparent;
        border-color: $admin-grey;
        color: $admin-grey;
    }

    i {
        margin-right: 5px;
    }

}

.secondary-image-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    img {
        width: 102px;
        height: 102px;
    }
}
</style>