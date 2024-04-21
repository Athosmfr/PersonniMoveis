<template>
    <div class="admin-container">
        <h1><router-link class="underline-router" to="/admin/produtos">Produtos</router-link> > Editar</h1>
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
                            <!-- Use v-if para condicionalmente renderizar o el-upload -->
                            <el-upload v-if="this.images.length < 999" class="avatar-uploader secondary-image-uploader"
                                multiple :auto-upload="false" :limit="999" @change="handleSecondaryImagesChange">
                                <el-icon class="avatar-uploader-icon">
                                    <Upload />
                                </el-icon>
                            </el-upload>
                            <!-- Use v-for para percorrer a lista de imagens secundárias -->
                            <div v-for="(image, index) in this.images" :key="index" class="avatar-container"
                                @click="removerimg(index)">
                                <div class="image-wrapper">
                                    <img :src="image.img" class="avatar" />
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
                <el-button class="cta" type="primary" @click="editProduct" :disabled="!product.name">Salvar</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import AuthService from '@/store/authService.js';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import imgConverter from '@/store/imgConverter.js';

export default {
    data() {
        return {
            config: { headers: { Authorization: AuthService.getToken() } },
            product: {
                productId: null,
                name: '',
                value: 0,
                quantity: 1,
                editable: false,
                mainImg: '',
                description: '',
                available: true,
                sections: [],
                details: [],
                secondaryImages: {
                    img: [],
                    productImgId: 0,
                },
            },
            uniqueKey: 0,
            images: [],
            fetchedCategories: [],
            secondaryImagesArray: [],
            selectedCategory: null,
            productWasAvailable: null
        }
    },
    created() {
        if (!AuthService.isUserColaborator()) {
            this.$router.replace('/');
        }
        // Adquire dados.
        this.getProduct();
        this.getCategories();
    },
    methods: {
        PrincipalImgRemove() {
            this.product.mainImg = null;
            this.uniqueKey += 1; // Isso forçará a recriação do componente
        },
        removerimg(index) {
            // Obtém a imagem com base no índice
            const imagemRemovida = this.images[index];

            // Verifica se a imagem tem um productImgId
            if (imagemRemovida.productImgId !== null && imagemRemovida.productImgId !== 0) {
                // Se tiver um productImgId, faz uma requisição axios.delete
                axios.delete(`http://localhost:8081/productImg/${imagemRemovida.productImgId}`)
                    .then(response => {
                        ElMessage.success('Imagem deletada com sucesso!');
                        // Remove a imagem do array local após a exclusão bem-sucedida
                        this.images.splice(index, 1);
                    })
                    .catch(error => {
                        // Lida com o erro (se necessário)
                        console.error(error);
                    });
            } else {
                // Se não tiver um productImgId, remove do array local
                this.images.splice(index, 1);
            }
        },



        getCategories() {
            axios.get('http://localhost:8081/category')
                .then(response => {
                    this.fetchedCategories = response.data;
                }).catch(error => {
                    console.error('Erro ao obter categorias: ', error);
                });
        },
        getProduct() {
            // Id é adquirido do parâmetro da URL.
            const productId = this.$route.params.id;
            if (productId != null) {
                // Faz requisição para adquirir produto "convencional" se o id não for nulo.
                axios.get('http://localhost:8081/products/' + productId)
                    .then(response => {
                        this.product = response.data;
                        this.selectedCategory = this.product.categoryId;
                        // Seta se produto estava indisponível no inicio da edição. Se mudar para disponível passa no fluxo de notificação dos clientes.
                        this.productWasAvailable = this.product.available;
                        this.product.secondaryImages.forEach(element => {
                            this.images.push({ productImgId: element.productImgId, img: element.img })
                        });
                    })
                    .catch(error => {
                        console.error('Erro ao obter dados da API:', error);
                    });
            } else {
                ElMessage.error('Id do produto é nulo. Não é possível fazer requsição para adquirir produto.');
            }
        },
        getCategories() {
            axios.get('http://localhost:8081/category')
                .then(response => {
                    this.fetchedCategories = response.data;
                }).catch(error => {
                    console.error('Erro ao obter categorias: ', error);
                });

        },
        editProduct() {
            // Produto deve ter ao menos 1 em qtde para ser disponível.
            if (this.product.quantity < 1 && this.product.available) {
                ElMessage.error('Para que o produto esteja "disponível", é necessário ter ao menos "1" em estoque');
                return;
            }
            // Produto deve ter valor numerico maior que 0 em preço.
            if (isNaN(this.product.value) || this.product.value < 1) {
                ElMessage.error('Para que o produto seja editado, é necessário que seu "Preço" seja um valor numérico maior que 0');
                return;
            }
            // Filtra as imagens que não têm um productImgId definido (são novas).
            const novasImagens = this.images.filter(img => img.productImgId === null || img.productImgId === 0);

            // Atribui diretamente as novas imagens ao campo img de secondaryImages.
            this.product.secondaryImages = {
                img: novasImagens.map(img => img.img)
            };


            // Começa loading.
            const loading = ElLoading.service({
                lock: true,
                text: 'Editando produto',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            // Se id do produto na URl não é nulo, manda requisição para editar produto.
            if (this.product.productId != null) {
                const config = { params: { categoryId: this.selectedCategory } }
                axios.put(`http://localhost:8081/products/save-full-product`, this.product, config)
                    .then(response => {
                        ElMessage.success('Produto editado com sucesso!');
                        loading.close();
                        this.$router.replace('/admin/produtos')
                    })
                    .catch(error => {
                        ElMessage.error('Erro ao editar produto.')
                        console.error(error);
                        loading.close();
                    });

                // Se o produto estava indisponível e passou a estar disponível, 
                // iniciar fluxo de envio de emails aos clientes que estavam na lista de espera pelo produto.
                if (this.product.quantity > 0 && this.product.available && this.productWasUnavailable()) {
                    const productUrl = `${window.location.origin}/produtos/${this.product.productId}`;
                    //console.log("trigger")
                    // axios.post(`http://localhost:8081/products/notify-clients-email/${this.product.productId}/${productUrl}`)
                    //     .then(reponse => {
                    //         // Não faz nada.
                    //     })
                    //     .catch(error => {
                    //         ElMessage.error('Erro ao enviar e-mails de notificação aos clientes.')
                    //         console.error(error);
                    //     });
                }
            }
        },
        /** Identifica se produto estava indisponível e ficou disponível. */
        productWasUnavailable() {
            return !this.productWasAvailable && this.product.available;
        },
        newDetail() {
            this.product.details.push({
                detailField: 'Novo detalhe',
                fieldContent: ''
            });
        },
        newSection() {
            this.product.sections.push({
                name: 'Nova seção',
                imgUrl: '',
                options: []
            });
        },
        newOption(section) {
            section.options.push({
                name: 'Nova opção',
                imgUrl: '',
                price: 0
            });
        },
        /** Deleta o item selecionado de qualquer coleção com itens. */
        removeDetail(details, detailToBeRemoved) {
            // Se o detalhe já existia no banco e foi possível resgatar o id do produto para encontrar o indice na lista, faz req para remover.
            if (this.shouldMakeDeleteReq(details, detailToBeRemoved, detailToBeRemoved.detailId)) {
                axios.delete(`http://localhost:8081/details/${detailToBeRemoved.detailId}`)
                    .then(response => {
                        // Se removido com sucesso não faz nada.
                    })
                    .catch(error => {
                        ElMessage.error('Erro ao remover detalhe do produto.');
                    });
            }
            this.removeItem(details, detailToBeRemoved);
        },
        removeSection(sections, sectionToBeRemoved) {
            if (this.shouldMakeDeleteReq(sections, sectionToBeRemoved, sectionToBeRemoved.sectionId)) {
                axios.delete(`http://localhost:8081/sections/${sectionToBeRemoved.sectionId}`)
                    .then(response => {
                        ElMessage.error("asd")
                        // Se removido com sucesso não faz nada.
                    })
                    .catch(error => {
                        ElMessage.error('Erro ao remover seção do produto.');
                    });
            }
            this.removeItem(sections, sectionToBeRemoved);
        },
        removeOption(options, optionToBeRemoved) {
            if (this.shouldMakeDeleteReq(options, optionToBeRemoved, optionToBeRemoved.optionId)) {
                axios.delete(`http://localhost:8081/options/${optionToBeRemoved.optionId}`)
                    .then(response => {
                        // Se removido com sucesso não faz nada.
                    })
                    .catch(error => {
                        ElMessage.error('Erro ao remover opção do produto.');
                    });
            }
            this.removeItem(options, optionToBeRemoved);
        },
        /** Encontra e faz splice removendo o item da lista recebida. */
        removeItem(items, item) {
            items.splice(this.getItemIndex(items, item), 1);
        },
        /** Encontra item na lista e retorna índice (-1 se não existir na lista). */
        getItemIndex(items, itemToBeRemoved) {
            return items.findIndex(item => item == itemToBeRemoved);
        },
        /**
         * Identifica se deve fazer requisição para exclusão.
         * Se foi possível resgatar o index para encontrar o item na lista, o item já existia no banco (tem id) e o produto tem id, faz req para remover.
         */
        shouldMakeDeleteReq(items, item, itemId) {
            const itemIndex = this.getItemIndex(items, item);
            if (itemIndex != -1 && itemId != null && this.product.productId != null) {
                return true;
            }
            return false;
        },
        /** Se quantidade do produto é zero, torna indisponível. */
        manageProdQuantity() {
            if (this.product.quantity < 1) {
                this.product.available = false;
            }
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
                option.mainImg = await imgConverter.fileToBase64String(file.raw);
            } catch (error) {
                ElMessage.error('Erro - não foi possível fazer o upload da imagem.')
            }
        },
        async handleSecondaryImagesChange(file, fileList) {
            try {
                // Adquire a imagem como string base64.
                const base64String = await imgConverter.fileToBase64String(file.raw);

                // Adiciona a nova imagem ao array existente
                this.images.push({ productImgId: null, img: base64String });
            } catch (error) {
                ElMessage.error('Erro - não foi possível fazer o upload da imagem.');
            }
        },
        /**
         * Adiciona seção no produto
         * @param {Product} product Produto onde será adicionado a seção.
         */
        newSection() {
            this.product.sections.push({
                name: "Nova seção",
                mainImg: "",
                options: []
            })
        },
        /**
         * Adiciona a opção na seção.
         * @param {Section} section Seção onde será adicionada a opção.
         */
        newOption(section) {
            section.options.push({
                name: '',
                mainImg: '',
                price: 0
            });
        },
        /**Insere novo detalhe do produto */
        newDetail() {
            this.product.details.push({
                fieldContent: '',
                detailContent: ''
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

.avatar {
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
    width: 102px;
    height: 102px;
    display: block;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

:deep(.el-upload) {
    border: 1px dashed $admin-grey;

    &:hover{
        border: 1px dashed var(--cta-color);
    }
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;

    &:hover{
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
.divider-button{
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
