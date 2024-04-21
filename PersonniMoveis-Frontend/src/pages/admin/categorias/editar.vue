<template>
  <div class="admin-container">
    <h1><router-link class="underline-router" to="/admin/categorias">Categorias</router-link> > Editar</h1>
    <el-form :model="categoria" label-width="*" label-position="top">
      <h2>Detalhes da categoria</h2>
      <el-form-item label="Nome" required>
        <el-input v-model="categoria.name"></el-input>
      </el-form-item>
      <h2>Permitir modelagem</h2>
      <el-form-item>
        <el-switch v-model="categoria.allow_creation" active-text="Sim" inactive-text="Não"></el-switch>
      </el-form-item>

      <el-collapse accordion class="criar-content" v-if="categoria.allow_creation" v-model="currentOpenSection">
        <div v-for="section in categoria.sectionCmps" v-bind:key="section">
          <el-collapse-item class="section-item" :name="section.sectionID">
            <template #title>
              <h1> {{ section.name ? section.name : 'Nova seção' }} </h1>
              <p v-if="section?.elementCmps?.length ?? 0">
                - {{ section.elementCmps.length }} {{ section.elementCmps.length !== 1 ? 'elementos' : 'elemento' }}
              </p>

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
                  <el-input-number :precision="0" :min="1" :max="categoria.sectionCmps.length" v-model="section.index">
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
                      <p v-if="element && element.optionCmps && element.optionCmps.length">
                        - {{ element.optionCmps.length }} {{ element.optionCmps.length !== 1 ? 'opções' : 'opção' }}
                      </p>

                      <el-icon v-on:click="deleteCascade(section, element, null)"
                        style="margin-left: 8px; float: right; cursor: pointer;" :size="20" color="#A8A8A8">
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
                            <el-input-number size="small" :precision="0" :min="1" v-model="element.index">
                            </el-input-number>
                          </el-form-item>

                          <el-checkbox v-model="element.mandatory" label="Obrigatório" size="large" />
                        </div>
                      </div>
                      <div class="element-options">
                        <div class="option-item" v-for="option in element.optionCmps" v-bind:key="option">
                          <el-icon v-on:click="deleteCascade(section, element, option)"
                            style="margin-left: 8px; float: right; cursor: pointer;" :size="20" color="#A8A8A8">
                            <Delete />
                          </el-icon>
                          <div class="inputs">
                            <div class="basic-inputs">
                              <el-form-item label="Opção">
                                <el-input v-model="option.name" size="small"></el-input>
                              </el-form-item>
                              <el-form-item label="Descrição">
                                  <el-input v-model="option.descriptions" resize="none" size="small" type="textarea"></el-input>
                                  
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
                                  <el-icon v-else class="avatar-uploader-icon">
                                    <Upload />
                                  </el-icon>
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
        <el-button class="cta" type="primary" @click="salvarCategoria" :disabled="!categoria.name">Salvar</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script>
import axios from 'axios';
import { ElLoading, ElMessage } from 'element-plus';
import imgConverter from '@/store/imgConverter.js';
import AuthService from '@/store/authService.js';
import jwtDecode from 'jwt-decode';

export default {
  data() {
    return {
      novaSecao: false,
      novoElemento: false,
      novaOpcao: false,
      selected: [],
      currentOpenSection: 0,
      currentOpenElement: 0,

      categoria: {
        id: 0,
        name: "",
        allow_creation: false,
        sectionCmps: [
        ]
      },
    }
  },
  created() {
    if (!AuthService.isUserColaborator()) {
      this.$router.replace('/');
    }
  },
  mounted() {
    const id = this.$route.params.id;
    // Fazer uma solicitação GET para buscar dados da categoria por ID
    axios.get(`http://localhost:8081/category/${id}`)
      .then((response) => {
        if (response.status === 200) {
          this.categoria = response.data
        } else {
          ElMessage.error('Categoria salva com Sucesso!')
          console.error('Erro ao buscar dados da API:', response.statusText);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar dados da API:', error);
      });
  },
  methods: {

    handleRemove(option) {
      option.img = "";
    },

    deleteCascade(Seccao, Elemento, Option) {
      // Encontre a categoria
      const categoria = this.categoria;

      // Se o ID da seção for fornecido, exclua tudo dentro dessa seção
      if (Seccao != null && Elemento == null && Option == null) {
        const sectionCmpIndex = categoria.sectionCmps.findIndex(section => section === Seccao);

        if (sectionCmpIndex !== -1 && Seccao.id != 0) {
          axios.delete(`http://localhost:8081/SectionCmp/${Seccao.id}`)
            .then(response => {
              this.categorias = response.data;
              window.location.reload();
            })
            .catch(error => {
              ElMessage.error('Erro ao deletar Seção! Veja se não tem Elementos relacionados!');
            });

        } else {
          categoria.sectionCmps.splice(sectionCmpIndex, 1);
        }
      } else if (Elemento != null && Option == null) { // Se o ID do elemento for fornecido, exclua todas as opções desse elemento
        categoria.sectionCmps.forEach(sectionCmp => {
          const elementCmpIndex = sectionCmp.elementCmps.findIndex(element => element === Elemento);
          if (elementCmpIndex != -1) {
            if (elementCmpIndex !== -1 && Elemento.id != 0) {
              axios.delete(`http://localhost:8081/ElementCmp/${Elemento.id}`)
                .then(response => {
                  this.categorias = response.data;
                  window.location.reload();
                })
                .catch(error => {
                  ElMessage.error('Erro ao deletar Elemento! Veja se não tem Opções relacionadas!');
                });
            } else {
              sectionCmp.elementCmps.splice(elementCmpIndex, 1);
            }
          }
        });
      } else if (Seccao != null && Elemento != null && Option != null) { // Se o ID do elemento e da opção forem fornecidos, exclua a opção específica
        const elementCmp = Seccao.elementCmps.find(element => element === Elemento);
        if (elementCmp) {
          const optionIndex = elementCmp.optionCmps.findIndex(option => option === Option);
          if (optionIndex !== -1 && Option.id != 0) {
            axios.delete(`http://localhost:8081/OptionCmp/${Option.id}`)
              .then(response => {
                this.categorias = response.data;
                window.location.reload();
              })
              .catch(error => {
                ElMessage.error('Erro ao deletar Opção!');
              });
          } else {
            elementCmp.optionCmps.splice(optionIndex, 1);
          }
        }
        ;
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

    salvarCategoria() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Salvando...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axios.put(`http://localhost:8081/category/${this.$route.params.id}`, this.categoria)
        .then((response) => {
          if (response.status === 204) {
            ElMessage({
              message: 'Categoria editada com sucesso.',
              type: 'success',
            })
            loading.close()
            this.$router.push(`/admin/categorias/${this.$route.params.id}`)
          } else {
            console.error('Erro ao criar recurso:', response.statusText);
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
      if (!this.categoria.sectionCmps) {
        this.categoria.sectionCmps = [];
      }
      this.categoria.sectionCmps.push({
        id: 0,
        name: "Nova seção",
        imgUrl: "",
        categoryId: this.categoria.id,
        elementCmpDtos: [],
        index: this.categoria.sectionCmps.length + 1,
        sectionID: this.categoria.sectionCmps.length + 1
      })

      this.novaSecao = true
      this.novoElemento = false

      setTimeout(() => {
        this.currentOpenSection = this.categoria.sectionCmps.length
      }, 100)
    },

    newElement(section) {
      if (!section.elementCmps) {
        section.elementCmps = [];
      }
      section.elementCmps.push({
        id: 0,
        name: "Novo elemento",
        type: null,
        sectionCmpId: section.id,
        optionCmpDtos: [],
        elementID: section.sectionID + "." + (section.elementCmps.length + 1)
      })
      this.novoElemento = true
      this.novaOpcao = false

      setTimeout(() => {
        this.currentOpenElement = section.sectionID + "." + (section.elementCmps.length)
      }, 100)
    },

    newOption(element) {
      if (!element.optionCmps) {
        element.optionCmps = [];
      }
      element.optionCmps.push({
        id: 0,
        name: "Nova opção",
        img: "",
        price: 0,
        elementCmpId: element.id,
      })
    }
  },


}
</script>

<style scoped lang="scss">
@import "@/assets/styles/scss/basics.scss";

hr {
  border: 1px solid $admin-grey;
  margin: 30px 0;
}

.criar-content {
  border: 0;
}

div.section-item {
  background: $primary-color;
  border: 1px solid $grey-border;
  margin-bottom: 20px;

  :deep(.el-collapse-item__header) {
    border-bottom: 0;
    padding: 36px 20px;

    h1 {
      font-size: 24px;
      margin: 0;
    }

    p {
      font-size: 16px;
      color: $admin-grey;
      margin: 0;
      margin-left: 5px;
    }
  }

  h2 {
    font-size: 16px;
    margin-bottom: 20px;
  }

  :deep(.el-collapse-item__wrap) {
    border-bottom: 0;
    background-color: #f6f6f6;
  }

  .section-inner {
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

.el-icon:hover {
  color: red;

}

.el-input {
  width: 300px;
}

.section-upper {
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

  :deep(.el-collapse) {
    border-top: 0;
  }

  .element-item {
    margin: 20px;
    border: 1px solid $user-grey;

    :deep(.el-collapse-item__header) {
      font-size: 20px;
      border-bottom: 0;
      padding: 20px;
    }

    :deep(.el-collapse-item__content) {
      background: #eee;
      padding: 20px;
    }
  }

  h2 {
    margin-left: 20px;
  }
}


.element-card {
  display: flex;
  flex-direction: row;

  .el-input {
    width: 100%;

  }

  .element-options {

    padding: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: 20px;
    height: 100%;


    .option-item {
      border: 1px solid $admin-grey;
      height: 100%;
      width: 35%;
      padding: 10px 20px;
      margin: 5px;


      .el-form-item {
        margin-bottom: 25px;
      }
    }

    .el-button {
      height: auto;
      border: 1px solid $admin-grey;
      color: $admin-grey;
      background: transparent;
      margin: 5px;

      >span {
        display: flex;
        flex-direction: column !important;
      }

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
  }
}

.avatar-uploader {
  height: 0;
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

:deep(ul.el-upload-list) {
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

div.admin-container button.el-button {
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

.divider-button {
  border-top: 1px solid var(--cta-color);
  cursor: pointer;
  height: 10px;
}
</style>