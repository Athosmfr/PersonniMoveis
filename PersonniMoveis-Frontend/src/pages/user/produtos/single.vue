<template>
    <div class="container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/produtos' }">Catálogo</el-breadcrumb-item>
          <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
        </el-breadcrumb>


        <div class="main-single">
            <div class="image-container">
                <div v-if="images[0].img">
                <el-carousel :interval="5000" arrow="always" :autoplay="false" ref="carousel" >
                  <el-carousel-item v-for="image in images" :key="image" :name="parseInt(image.productImgId)">
                    <el-image style="width: 500px; height: 500px; cursor: pointer;" :src="image.img" :fit="fit" @click="showImageZoom = true; dialogImage = image.img" />
                  </el-carousel-item>
                </el-carousel>
                </div>

                <div v-else>
                    <img style="width: 500px; height: 500px" :src="storeConfig.placeholder" class="placeholder"/>
                </div>

                <el-dialog v-model="showImageZoom" width="50%" center>
                  <el-image :src="dialogImage" alt="Zoomed Image" style="width: 750px; height: 750px;" />
                </el-dialog>

                <div class="secondary-image-list" v-if="images.length > 1">
                    <div class="secondary-image-item" v-for="image in images" :key="image">
                        <el-image style="width: 100px; height: 100px; cursor: pointer;" :src="image.img" :fit="fit" @click="changeImage(parseInt(image.productImgId))"/>
                    </div>
                </div>
            </div>

            <div class="info-box">
                <h2 style="font-size: 4rem; font-weight: 400;">{{  product.name }}</h2>
                <el-text v-if="product.quantity > 0" class="mx-1" type="success" size="large">Disponível</el-text>
                <el-text v-else class="mx-1" type="danger" size="large">Fora de estoque</el-text>
                <el-text v-if="product.quantity > 0" class="mx-1" type="info" size="large">{{ product.quantity }} em estoque</el-text>
                <h3 style="font-size: 2.5rem; font-weight: 400;">{{ formatPrice(product.value) }}</h3>
                <p style="font-size: 1.6rem; ont-weight: 400;">{{ product.description }}</p>
                <div class="info-box-action" v-if="product.quantity > 0">
                    <el-button class="cta" color="var(--cta-color)" @click="addToCart">Adicionar ao carrinho</el-button>
                    <el-divider v-if="product.editable">OU</el-divider>
                    <router-link  v-if="product.editable" :to="{path: '/produtos/' + product.productId + '/personalizar'}"><h1>Personalizar <el-icon><Right /></el-icon></h1></router-link>
                </div>
            </div>


        </div>

        <el-divider></el-divider>

        <div class="about-single">
            <h1>Detalhes do Produto</h1>

            <el-table :data="product.details" style="width: 100%">
              <el-table-column prop="fieldContent" width="180" />
              <el-table-column prop="detailField" width="*" />
            </el-table>

        </div>
        
    </div>
</template>

<script>
import cartService from '@/store/cartService.js';
import axios from 'axios';
import { ElLoading } from 'element-plus';
import { ElMessage } from 'element-plus';
import AuthService from '@/store/authService.js';

export default {
    data(){
        return{
            product: {},
            images: [],
            showImageZoom: false,
            dialogImage: '',
            storeConfig: {
                placeholder: '',
            },
        }
    },
    async created() {
        const loading = ElLoading.service({
            lock: true,
            text: 'Carregando produto...',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        this.getStoreConfig();
        const id = this.$route.params.id;
        if (id != null) {
            axios.get(`http://localhost:8081/products/${this.$route.params.id}`)
                .then(response => {
                    this.product = response.data
                    this.images.push({productImgId: 1, img: this.product.mainImg})
                    this.product.secondaryImages.forEach(element => {
                        this.images.push({productImgId: this.images.length + 1, img: element.img})
                    });
                    console.log(this.images)
                    
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
        addToCart() {
            cartService.addToCart(this.product);
            ElMessage({
              message: 'Produto adicionado ao carrinho',
              type: 'success',
            })
        },
        formatPrice(){
            return this.product.value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        
        },
        changeImage(id){
            console.log(id)
            this.$refs.carousel.setActiveItem(parseInt(id) - 1);
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

    }
}
</script>

<style scoped lang="scss">

@import '@/assets/styles/scss/basics.scss';


div.container {

    :deep(.el-divider__text){
        background-color: $primary-color;
    }

    p {
        color: $user-grey;
        word-break: break-word;
    }
    div.main-single{
        display: flex;
        justify-content: space-evenly;
        align-items: flex-start;
        flex-direction: row;
        margin-top: 50px;

        .secondary-image-list {
          display: flex;
          flex-direction: row;
          margin-top: 10px;
          flex-wrap: wrap;
          width: 500px;

            .secondary-image-item {
               border: 1px solid $grey-border;
               margin: 5px 10px;
               width: 102px;
                height: 102px;
            }
        }

        div.el-carousel{
            width: 500px;
            height: 500px;
            border: 1px solid $grey-border;

            :deep(.el-carousel__button){
                display: none;
            }


            :deep(.el-carousel__container){
                height: 500px;
            }

            div.el-carousel__item{
                width: 500px;
                height: 500px;
                background: black;
                //transform: none ; 
            }
        }

        div.info-box{
            width: 600px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 2rem;
            background-color: $primary-color;
            border: 1px solid $grey-border;

            h2{
                margin-bottom: 0;
                margin-top: 0;
            }
            h3{
                color: $text-color !important;
            }
            .el-text{
                display: inline-block;
                width: 100%;
                text-align: start;
            }

            div.info-box-action{
                display: flex;
                flex-direction: column;
                width: fit-content;
                max-width: 150px;

                button {
                    width: fit-content;
                    margin: 0.5rem 0;
                }


                h1{
                    color: var(--cta-color);
                    width: 400px;
                    text-decoration: underline;
                }
            }
        }
    }
    div.about-single{

        div.el-table{
            background-color: transparent;
            margin-top: 2rem;
            :deep(.el-table__row), :deep(.el-table__cell)  {
                background-color: transparent;
                border-bottom: 0;
                padding: 2rem;
            }
            :deep(.el-table__header-wrapper){
                display: none;
            }
            :deep(tr.el-table__row > td:first-child){
                border-right: 1px solid #A6A6A6;
            }
        }

        h1{
            font-weight: 300;
        }

        
    }
}
:deep(.el-table .cell){
            word-break: normal;
        }

.placeholder{
    width: 500px;
    height: 500px;
    border: 1px solid $grey-border;
    object-fit: none;
    background-color: $primary-color;
}

@media (max-width: 768px) {
    div.container {
        div.main-single{
            flex-direction: column;
            align-items: center;
            margin-top: 0;

            div.image-container{
                display: flex;
                flex-direction: column;
                align-items: center;

                div.el-carousel{
                    width: 300px;
                    height: 300px;
                    border: 1px solid $grey-border;

                    :deep(.el-carousel__button){
                        display: none;
                    }

                    :deep(.el-carousel__container){
                        height: 300px;
                    }

                    div.el-carousel__item{
                        width: 300px;
                        height: 300px;
                        background: black;
                        //transform: none ; 
                    }
                    :deep(.el-image){
                        width: 300px !important;
                        height: 300px !important;
                    }


                }
                .secondary-image-list{
                    width: 100%;
                    justify-content: center;
                }
            }
            :deep(.el-dialog){
                width: 400px;
                height: 400px;

                .el-image{
                    width: 300px !important;
                    height: 300px !important;
                }
            }
            div.info-box{
                width: 100%;
                align-items: center;
                padding: 1rem;
                margin-top: 1rem;

                h2{
                    font-size: 2rem;
                }
                h3{
                    font-size: 1.5rem;
                }
                .el-text{
                    font-size: 1.2rem;
                }
                p{
                    font-size: 1rem;
                    width: 100%;
                    word-break: break-word;
                }
                div.info-box-action{
                    width: 100%;
                    max-width: 100%;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    button {
                        width: 100%;
                        margin: 0.5rem 0;
                    }

                    h1{
                        width: 100%;
                        text-align: center;
                    }
                }
            }
        }

    }
}
</style>