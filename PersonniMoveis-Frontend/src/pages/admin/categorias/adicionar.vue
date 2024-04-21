<template>
    <div class="admin-container">
        <h1><router-link class="underline-router" to="/admin/categorias">Categorias</router-link> > Adicionar</h1>
        <el-form :model="categoria" label-width="*" label-position="top">
            <h2>Detalhes da categoria</h2>
            <el-form-item label="Nome" required>
                <el-input v-model="categoria.name"></el-input>
            </el-form-item>
            <h2>Permitir modelagem</h2>
            <el-form-item>
                <el-switch v-model="categoria.allow_creation" active-text="Sim" inactive-text="Não" ></el-switch>
            </el-form-item>

            <el-collapse accordion class="criar-content" v-if="categoria.allow_creation" v-model="currentOpenSection">
                <div v-for="section in categoria.sectionCmps" v-bind:key="section">
                <el-collapse-item class="section-item" :name="section.sectionID">
                    <template #title>
                        <h1> {{ section.name ? section.name : 'Nova seção' }} </h1>
                        <p v-if="section.elementCmps.length"> - {{ section.elementCmps.length }} {{ section.elementCmps.length != 1 ? 'elementos' : 'elemento' }} </p>
                        <el-icon v-on:click="deleteCascade(section, null, null)" style="margin-left: 8px; cursor: pointer;"
                            :size="20" color="#A8A8A8">
                            <Delete />
                        </el-icon>
                    </template>
                    <div class="section-inner">
                    <h2>Detalhes da seção</h2>
                    <div class="section-upper">
                        <el-form-item label="Nome">
                            <el-input v-model="section.name" size="large" class="section-input"></el-input>
                        </el-form-item>
                        <el-form-item label="Ordem">
                        <el-input-number 
                            :precision="0" 
                            :min="1"
                            :max="categoria.sectionCmps.length"
                            v-model="section.index">
                        </el-input-number>
                        </el-form-item>

                     
                    </div>
                </div>


                    <div class="elements">
                        <h2>Elementos</h2>
                        <el-collapse accordion v-model="currentOpenElement">
                        <div v-for="element in section.elementCmps" v-bind:key="element">
                        <el-collapse-item class="element-item" :name="element.elementID">
                            <template #title>
                                <h1> {{ element.name ? element.name : 'Novo elemento' }} </h1>
                                <p v-if="element.optionCmps.length"> - {{ element.optionCmps.length }} {{ element.optionCmps.length != 1 ? 'opções' : 'opção' }} </p>
                                <el-icon v-on:click="deleteCascade(section, element, null)"
                                    style="margin-left: 8px; float: right; cursor: pointer;" :size="20"
                                    color="#A8A8A8">
                                    <Delete />
                                </el-icon>
                            </template>

                            <div class="element-card">
                                <div class="element-main">
                    
                                <el-form-item label="Nome">
                                    <el-input v-model="element.name"></el-input>
                                </el-form-item>

                                <div class="element-index-mandatory">

                                    <el-form-item label="Ordem">
                                        <el-input-number 
                                            size="small"
                                            :precision="0" 
                                            :min="1"
                                            v-model="element.index">
                                        </el-input-number>
                                    </el-form-item>

                                    <el-checkbox v-model="element.mandatory" label="Obrigatório" checked="true" size="large" />
                                </div>
                            </div>
                            <div class="element-options">
                                <div class="option-item" v-for="option in element.optionCmps" v-bind:key="option">
                                    <el-icon v-on:click="deleteCascade(section, element, option)"
                                        style="margin-left: 8px; float: right; cursor: pointer;"
                                        :size="20" color="#A8A8A8">
                                        <Delete />
                                    </el-icon>
                                    <div class="inputs">
                                    <div class="basic-inputs">
                                                <el-form-item label="Opção">
                                                    <el-input v-model="option.name" size="small"></el-input>
                                                    
                                                </el-form-item>
                                                <el-form-item label="Descrição">
                                                    <el-input v-model="option.descriptions" resize="none" type="textarea" size="small"></el-input>
                                                    
                                                </el-form-item>
                                                <el-form-item label="Preço">
                                                    <el-input v-model="option.price" size="small" required>
                                                        <template #prepend>R$</template></el-input>
                                                </el-form-item>

                                    </div>
                                        <el-form-item label="Imagem">
                                            <div>
                                                <el-upload class="avatar-uploader" :auto-upload="false" limit="1"
                                                    @change="handleImageChange($event, option)">
                                                    <img v-if="option.img" :src="option.img" class="avatar" />
                                                    <el-icon v-else class="avatar-uploader-icon"><Upload /></el-icon>
                                                </el-upload>
                                            </div>
                                        </el-form-item>
                                    </div>


                                </div>


                                <el-button class="option-button" v-on:click="newOption(element)">
                                    <el-icon>
                                        <Plus />
                                    </el-icon> Opção
                                </el-button>
                            </div>

                            </div>
                        </el-collapse-item>
                    </div>
                        </el-collapse>
                        <el-button class="element-button" type="primary" v-on:click="newElement(section)"><el-icon>
                                <Plus />
                            </el-icon> Elemento </el-button>
                    </div>


                </el-collapse-item>
            </div>
                <el-button class="section-button" v-on:click="newSection">
                                    <el-icon>
                                        <Plus />
                                    </el-icon> Seção
                                </el-button>

            </el-collapse>


            <el-form-item>
                <el-button class="cta" type="primary" @click="criarCategoria" :disabled="!categoria.name">Salvar</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script>
import axios from 'axios';
import AuthService from '@/store/authService.js';
import { ElMessage, ElLoading } from 'element-plus'
import imgConverter from '@/store/imgConverter.js';
import jwtDecode from 'jwt-decode';

export default {
    data() {
        return {
            selected: [],
            currentOpenSection: 0,
            currentOpenElement: 0,
            categoria: {
                id: 0,
                name: "",
                allow_creation: false,
                sectionCmps: [

                ]
            }

            , // Inicialize como nulo até carregar os dados da API
        };
    },
    created() {

      if (!AuthService.isUserColaborator()) {
        this.$router.replace('/');
      }
    
    },
    methods: {
        deleteCascade(Seccao, Elemento, Option) {
            // Encontre a categoria
            const categoria = this.categoria;
            // Se o ID da seção for fornecido, exclua tudo dentro dessa seção
            if (Seccao != null && Elemento == null && Option == null) {
                const sectionCmpsIndex = categoria.sectionCmps.indexOf(Seccao)
                if (sectionCmpsIndex != null) {
                    categoria.sectionCmps.splice(sectionCmpsIndex, 1);
                }
            } else if (Elemento != null && Option == null) { // Se o ID do elemento for fornecido, exclua todas as opções desse elemento
                const ElementCmpindex = Seccao.elementCmps.indexOf(Elemento)
                if (ElementCmpindex != null) {
                    Seccao.elementCmps.splice(ElementCmpindex, 1);
                }
            } else if (Elemento != null && Option != null) { // Se o ID do elemento e da opção forem fornecidos, exclua a opção específica
                const OptionCmpindex = Elemento.optionCmps.indexOf(Option)
                if (OptionCmpindex != null) {
                    Elemento.optionCmps.splice(OptionCmpindex, 1);
                }

            }
        },

        async handleImageChange(file, option) {
            try {
                // Adquire imagem como string base64.
                option.img = await imgConverter.fileToBase64String(file.raw);
            } catch (error) {
                ElMessage.error('Erro - não foi possível fazer o upload da imagem.')
            }
        },

        criarCategoria() {
            // const token = AuthService.getToken();
            const loading = ElLoading.service({
                lock: true,
                text: 'Criando categoria',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            axios.post('http://localhost:8081/category', this.categoria, {
                //   headers: {
                //     Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                //   },
            })
                .then((response) => {
                    if (response.status === 201) {
                        // A resposta da API indica que o recurso foi criado com sucesso.
                        // Você pode realizar ações adicionais aqui, se necessário.
                        ElMessage({
                            message: 'Categoria criada com sucesso.',
                            type: 'success',
                        })
                        loading.close()
                        this.$router.push('/admin/categorias')

                    } else {
                        ElMessage({
                            message: 'Erro ao criar a categoria.',
                            type: 'error',
                        })
                        loading.close()
                    }
                })
                .catch((error) => {
                    ElMessage({
                        message: 'Erro ao criar a categoria.',
                        type: 'error',
                    })
                    loading.close()
                })
        },
        newSection() {
            this.categoria.sectionCmps.push({
                name: "",
                imgUrl: "",
                elementCmps: [],
                index: this.categoria.sectionCmps.length + 1,
                sectionID: this.categoria.sectionCmps.length + 1
            })

            setTimeout(() => {
                this.currentOpenSection = this.categoria.sectionCmps.length
            }, 100)
            
        },

        newElement(section) {
            section.elementCmps.push({
                name: "",
                type: null,
                index: section.elementCmps.length + 1,
                optionCmps: [],
                // make id incrementally unique to all this.categoria.sectionCmps
                elementID: section.sectionID + "." + (section.elementCmps.length + 1)
                
            })
            setTimeout(() => {
                this.currentOpenElement = section.sectionID + "." + (section.elementCmps.length)
            }, 100)
        },

        newOption(element) {
            element.optionCmps.push({
                name: "",
                img: "",
                descriptions: "",
                price: "",
            })

        }
    }
};


</script>

<style scoped lang="scss">
@import "@/assets/styles/scss/basics.scss";

hr {
    border: 1px solid $admin-grey;
    margin: 30px 0;
}

.criar-content{
    border: 0;
}

div.section-item{
    background: $primary-color;
    border: 1px solid $grey-border;
    margin-bottom: 20px;

    :deep(.el-collapse-item__header){
        border-bottom: 0;
        padding: 36px 20px;

        h1{
            font-size: 24px;
            margin: 0;
        }
        p{
            font-size: 16px;
            color: $admin-grey;
            margin: 0;
            margin-left: 5px;
        }
    }

    h2{
        font-size: 16px;
        margin-bottom: 20px;
    }

    :deep(.el-collapse-item__wrap){
        border-bottom: 0;
        background-color: #f6f6f6;
    }

    .section-inner{
        padding: 20px;
    }


}
.section-button {
  width: 100%;
  height: 72px;
  background: transparent;
  border: 1px solid $admin-grey;
  color: $admin-grey;
  font-size: 20px;

    &:hover {
        color: var(--cta-color);
        background: transparent;
        border-color: var(--cta-color);
    }
    &:active, &:focus{
        background: transparent;
        border-color: $admin-grey;
        color: $admin-grey;
    }

    i{
        margin-right: 5px;
    }
    
}
.element-button {
  width: auto;
  height: 48px;
  background: transparent;
  border: 1px solid $admin-grey;
  color: $admin-grey;
  font-size: 20px;
  margin: 0 20px;

    &:hover {
        color: var(--cta-color);
        background: transparent;
        border-color: var(--cta-color);
    }
    &:active, &:focus{
        background: transparent;
        border-color: $admin-grey;
        color: $admin-grey;
    }

    i{
        margin-right: 5px;
    }
    
}
.el-icon:hover{
    color: red;

}
.el-input{
    width: 300px;
}
.section-upper{
    display: flex;
    align-items: center;
    justify-content: space-between;

}
.el-input.section-input {
    width: 100%;
}
.element-index-mandatory {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
.elements {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    :deep(.el-collapse){
        border-top: 0;
    }

    .element-item{
        margin: 20px;
        border: 1px solid $user-grey;

        :deep(.el-collapse-item__header){
            font-size: 20px;
            border-bottom: 0;
            padding: 20px;
        }

        :deep(.el-collapse-item__content){
            background: #eee;
            padding: 20px;
        }
    }

    h2{
        margin-left: 20px;
    }
}


.element-card {
    display: flex;
    flex-direction: row;

    .el-input{
        width: 100%;
    
    }

    .element-options{

        padding: 10px;
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-left: 20px;
        height: 100%;


        .option-item{
            border: 1px solid $admin-grey;
            height: 100%;
            width: 35%;
            padding: 10px 20px;
            margin: 5px;


            .el-form-item{
                margin-bottom: 25px;
            }
        }

        .el-button{
            height: auto;
            border: 1px solid $admin-grey;
            color: $admin-grey;
            background: transparent;
            margin: 5px;
            
            > span{
                display: flex;
                flex-direction: column !important;
            }

            &:hover {
                color: var(--cta-color);
                background: transparent;
                border-color: var(--cta-color);
            }
            &:active, &:focus{
                background: transparent;
                border-color: $admin-grey;
                color: $admin-grey;
            }
        
            i{
                margin-right: 5px;
            }
        }
    }
}

:deep(.avatar-uploader .el-upload) {
  border: 1px dashed $user-grey;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: var(--cta-color) !important;

    .el-icon {
        color: var(--cta-color);
    }
}

.avatar-uploader{
    height: 0;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
 
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
  min-width: 100px;
  min-height: 100px;

}

:deep(ul.el-upload-list){
    display: none;
}
.inputs {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.basic-inputs {
  padding-right: 20px;
}
div.admin-container button.el-button{
    margin-top: 0;
}
:deep(.el-divider__text.is-center) {
  display: flex;
  align-items: center;
  color: var(--cta-color);

    .el-icon {
        margin-right: 10px;
        color: var(--cta-color);
    }
}
.divider-button{
    border-top: 1px solid var(--cta-color);
    cursor: pointer;
    height: 10px;
}
</style>