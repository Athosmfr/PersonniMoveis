<template>
  <el-menu mode="horizontal" :ellipsis="false" background-color="#FEFEFE" text-color="var(--tertiary-color)"
    active-text-color="var(--tertiary-color)" @select="handleSelect">
    <el-menu-item><router-link to="/"><img style="width: 200px; height: 120px;"
          :src="storeConfig.logo" /></router-link></el-menu-item>

    <h1> Modelagem de móveis </h1>
  </el-menu>
  <div class="steps-container">
    <h2 v-if="!isLastSection">{{ "Passo " + (currentSection + 1) + " de " + categoria.sectionCmps.length }}</h2>
    <h2 v-else>{{ "Passo " + (currentSection + 1) + " de " + categoria.sectionCmps.length + ": Revisar modelagem" }}</h2>
    <el-steps align-center :active="currentSection" finish-status="success">
      <el-step v-for="section in categoria.sectionCmps" :key="section.id" :title="section.name" />
    </el-steps>
  </div>
  <div class="container">

    <div class="cmp-container" v-if="!isLastSection">
      <div class="cmp-sections">
        <el-form :model="selected">
          <div class="section" v-for="section in categoria.sectionCmps" :key="section.id">
            <div class="inner-section"
              v-if="currentSection == categoria.sectionCmps.indexOf(section) && section.name !== 'Revisar'">
              <h1>{{ section.name }}</h1>
              <div class="section-elements">
                <div v-for="element in section.elementCmps" :key="element.id" class="ml-4 element-item">
                  <h2>Escolher {{ element.name.toLowerCase() }} <span v-if="!element.mandatory"
                      style="font-size: 12px;">(Opcional)</span></h2>
                  <el-radio-group v-model="selected[element.id]">
                    <el-radio-button v-for="option in element.optionCmps" :key="option.id" size="large"
                      @change="resumoCmp" :label="option.id">
                      <div class="option-image" v-if="option.img != ''">
                        <el-image :src="option.img" />
                      </div>
                      <div class="option-image-placeholder" v-else>
                        <img :src="storeConfig.placeholder" />
                      </div>
                      <el-icon class="option-dialog-button" @click="optionDialog(option)">
                        <InfoFilled />
                      </el-icon>
                      <div class="option-info">
                        <div class="option-name">{{ option.name }}</div>
                        <div class="option-price">{{ option.price != 0 ? "R$ " + option.price : "--" }}</div>
                      </div>
                    </el-radio-button>
                  </el-radio-group>
                </div>
              </div>

              <el-dialog v-model="dialogVisible" :title="currentOption.name" width="40%" :before-close="handleClose">
                <div class="dialog-content">
                  <div class="dialog-image" v-if="currentOption.img != ''">
                    <el-image :src="currentOption.img" />
                  </div>
                  <div class="dialog-image-placeholder" v-else>
                    <img :src="storeConfig.placeholder" />
                  </div>
                  <h3> {{ currentOption.description }} </h3>
                </div>
                <template #footer>
                  <span class="dialog-footer">
                    <h2>R$ {{ currentOption.price }}</h2>
                  </span>
                </template>
              </el-dialog>
              <div class="actions">
                <el-button class="cta" color="var(--cta-color)" type="primary" @click="previousSection"
                  v-if="currentSection !== 0"><el-icon>
                    <CaretLeft />
                  </el-icon> Voltar</el-button>
                <el-button class="cta" color="var(--cta-color)" style="visibility: hidden;" type="primary"
                  @click="previousSection" v-else></el-button>
                <el-button class="cta" color="var(--cta-color)" type="primary" @click="nextSection"
                  :disabled="isCurrentElementMandatory">
                  Próximo passo <el-icon>
                    <CaretRight />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </el-form>
      </div>

    </div>


    <div class="last-section" v-if="isLastSection">

      <h1>Revisar modelagem</h1>

      <el-dialog v-model="dialogVisibleResumo" :title="currentOption.element + ': ' + currentOption.name" width="40%"
        :before-close="handleClose">
        <div class="dialog-content">
          <div class="dialog-image" v-if="currentOption.img != ''">
            <el-image :src="currentOption.img" />
          </div>
          <div class="dialog-image-placeholder" v-else>
            <img :src="storeConfig.placeholder" />
          </div>
          <h3> {{ currentOption.description }} </h3>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <h2>R$ {{ currentOption.price }}</h2>
          </span>
        </template>
      </el-dialog>

      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="Visão em grid" name="first">
          <div class="revisar-section">
            <div v-for="optionInfo in selectedOptionsInfo" :key="optionInfo">
              <el-divider v-if="optionInfo != selectedOptionsInfo[0]"></el-divider>
              <div class="revisar-section-section">

                <h2>{{ optionInfo.section }}</h2>
                <div class="revisar-main-section">
                  <div v-for="element in optionInfo.elements" :key="element" class="v-for">
                    <div v-if="element.index == 1" class="revisar-section-item main">
                      <div class="element-image-main" v-if="element.img">
                        <el-image :src="element.img" />
                      </div>
                      <div class="element-image-main" v-else>
                        <img :src="storeConfig.placeholder" />
                      </div>
                      <div class="revisar-section-item-option">
                        <div>
                          <h4>{{ element.element }}</h4>
                          <h3 class="element-option">{{ element.option }}</h3>
                        </div>
                        <h3 class="element-price">{{ element.price != 0 ? "R$ " + element.price : "--" }}</h3>
                        <el-icon class="option-dialog-button" @click="optionDialogResumo(element)">
                          <InfoFilled />
                        </el-icon>
                      </div>
                    </div>
                  </div>
                  <div class="revisar-secondary-section">
                    <div v-for="element in optionInfo.elements" :key="element" class="v-for">
                      <div v-if="element.index > 1" class="revisar-section-item main">
                        <div class="element-image-main" v-if="element.img">
                          <el-image :src="element.img" />
                        </div>
                        <div class="element-image" v-else>
                          <img :src="storeConfig.placeholder" />
                        </div>
                        <div class="revisar-section-item-option">
                          <div>
                            <h4>{{ element.element }}</h4>
                            <h3 class="element-option">{{ element.option }}</h3>
                          </div>
                          <h3 class="element-price">{{ element.price != 0 ? "R$ " + element.price : "--" }}</h3>
                          <el-icon class="option-dialog-button" @click="optionDialogResumo(element)">
                            <InfoFilled />
                          </el-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </el-tab-pane>
        <el-tab-pane label="Visão em tabela" name="second">
          <!-- element plus table, loops through selectedOptionsInfo, has a rowspan of elements.length, while showing all secoes.elements-->
          <el-table stripe="true" :data="tableData" style="width: 100%;" class="admin-table">
            <el-table-column prop="section" label="Seção" sortable :width="columnWidth">
              <template v-slot="scope">
                <div class="nome">
                  <p>{{ scope.row.section }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="element" label="Elemento" sortable :width="columnWidth">
              <template v-slot="scope">
                <div class="nome">
                  <p>{{ scope.row.element }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="img" label="Imagem" sortable :width="columnWidth">
              <template v-slot="scope">
                <div class="nome">
                  <div v-if="scope.row.image" class="table-image">
                    <el-image :src="scope.row.image" />
                  </div>
                  <div v-else class="table-image">
                    <img :src="storeConfig.placeholder" />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="option" label="Opção" sortable :width="columnWidth">
              <template v-slot="scope">
                <div class="nome">
                  <p>{{ scope.row.option }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="Preço" sortable :width="columnWidth">
              <template v-slot="scope">
                <div class="nome">
                  <p>{{ scope.row.price != 0 ? "R$ " + scope.row.price : "--" }}</p>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-button @click="imprimirTabela">Imprimir</el-button>
        </el-tab-pane>
      </el-tabs>
      <div class="preco-final">
        <h3>Preço final:</h3>
        <h2>R$ {{ products_cmp.value }}</h2>
      </div>
      <div class="revisar-actions">
        <el-button class="cta" color="var(--cta-color)" type="primary" @click="previousSection"
          v-if="isLastSection"><el-icon>
            <CaretLeft />
          </el-icon> Voltar</el-button>
        <el-button class="cta" color="var(--cta-color)" size="large" type="primary" @click="criarCMP"
          v-if="isLastSection">Adicionar ao carrinho</el-button>
      </div>
    </div>


  </div>
</template>

<script>
import axios from 'axios';
import { ElLoading } from 'element-plus'
import { ElMessage } from 'element-plus'
import cartService from '@/store/cartService';
import AuthService from '@/store/authService.js';

export default {
  data() {
    return {
      testImage: "@assets/img/cadeira1.png",
      currentSection: 0,
      selected: [],
      tableData: [],
      selectedOptionsInfo: [],
      sectionAllSelected: false,
      activeName: 'first',
      columnWidth: "*",
      products_cmp: {
        id: 0,
        value: 0,
        quantity: 1,
        imgUrl: "string",
        description: "string",
        sectionProductCmpDtos: [],
      },
      categoria: {
        name: "",
        allow_creation: false,
        sectionCmps: [],
      },
      dialogVisible: false,
      currentOption: {
        name: "",
        price: "",
        description: "",
        img: ""
      },
      dialogVisibleResumo: false,
      storeConfig: {
        logo: '',
        placeholder: '',
      },
    };
  },
  async created() {
    const loading = ElLoading.service({
      lock: true,
      text: 'Carregando modelagem...',
      background: '#ffffff'
    });
    this.getStoreConfig();
    const id = this.$route.params.id;
    axios.get(`http://localhost:8081/category/` + id)
      .then((response) => {
        if (response.status === 200) {
          this.categoria = response.data;

          this.categoria.sectionCmps.sort((a, b) => a.index - b.index);

          this.categoria.sectionCmps.forEach((section) => {
            section.elementCmps.sort((a, b) => a.index - b.index);
          });

          // add index increment to every element
          this.categoria.sectionCmps.forEach((section) => {
            section.elementCmps.forEach((element) => {
              element.optionCmps.forEach((option) => {
                option.index = this.categoria.sectionCmps.indexOf(section) + this.categoria.sectionCmps.length + this.categoria.sectionCmps.indexOf(section.elementCmps) + this.categoria.sectionCmps.indexOf(section.elementCmps.indexOf(element)) + this.categoria.sectionCmps.indexOf(section.elementCmps.indexOf(element.optionCmps)) + this.categoria.sectionCmps.indexOf(section.elementCmps.indexOf(element.optionCmps.indexOf(option)));
              });
            });
          });

          this.categoria.sectionCmps.push({
            name: "Revisar",
            elementCmps: [],
          });
          loading.close()
        } else {
          console.error('Erro ao buscar dados da API:', response.statusText);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar dados da API:', error);
      });



  },
  computed: {
    isCurrentElementMandatory() {
      const currentSection = this.categoria.sectionCmps[this.currentSection];
      return !currentSection.elementCmps.filter((element) => element.mandatory).every((element) => this.selected[element.id]);
    },




    isLastSection() {
      // make tableData
      this.tableData = [];
      this.selectedOptionsInfo.forEach((section) => {
        section.elements.forEach((element) => {
          this.tableData.push({
            image: element.img,
            section: section.section,
            element: element.element,
            option: element.option,
            price: element.price,
          });
        });
      });
      return this.currentSection === this.categoria.sectionCmps.length - 1;
    },
  },
  methods: {
    criarCMP() {
      // Adiciona CMP criado ao local storage.
      cartService.addCmpToCart(this.products_cmp);
      ElMessage({
        showClose: true,
        message: 'Produto adicionado ao carrinho!',
        type: 'success',
        duration: 3000
      })
      setTimeout(() => {
        this.$router.push('/carrinho');
      }, 250);
    },
    nextSection() {
      this.currentSection += 1;
      const loading = ElLoading.service({
        lock: true,
        text: 'Carregando próxima seção...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        this.scrollToTop();
        loading.close()
      }, 250);
    },
    previousSection() {
      this.currentSection -= 1;
      const loading = ElLoading.service({
        lock: true,
        text: 'Carregando seção anterior...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        this.scrollToTop();
        loading.close()
      }, 250);
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
      });
    },
    optionDialog(option) {
      this.dialogVisible = true
      this.currentOption.name = option.name
      this.currentOption.price = option.price
      this.currentOption.description = option.descriptions
      this.currentOption.img = option.img
    },
    optionDialogResumo(element) {
      this.dialogVisibleResumo = true
      this.currentOption.name = element.option
      this.currentOption.element = element.element
      this.currentOption.price = element.price
      this.currentOption.description = element.option.descriptions
      this.currentOption.img = element.img
    },
    encontrarElementoESeçãoPorOpção(optionIds) {
      const correspondencias = [];
      for (const section of this.categoria.sectionCmps) {
        for (const element of section.elementCmps) {
          for (const optionId of optionIds) {
            const option = element.optionCmps.find((opt) => opt.id === optionId);
            if (option) {
              correspondencias.push({ section: section, element: element, option: option });
            }
          }
        }
      }
      return correspondencias;
    },

    resumoCmp() {
      // Encontre os IDs da seção e do elemento com base na opção selecionada
      const correspondencias = this.encontrarElementoESeçãoPorOpção(this.selected);

      if (correspondencias.length > 0) {
        const selectedOptionsInfo = []; // Array para armazenar as informações de cada opção escolhida

        correspondencias.forEach(({ section, element, option }) => {
          // Verifique se a seção já existe na lista de seções
          const existingSection = this.products_cmp.sectionProductCmpDtos.find(sec => sec.sectionId === section.id);

          if (existingSection) {
            const existingElement = existingSection.elementProductCmpDtos.find(ele => ele.id === element.id);

            if (existingElement) {
              // Se o elemento já existe, substitua a opção existente
              existingElement.optionProductCmpDto = {
                "id": option.id,
                "name": option.name,
                "price": option.price,
                "img": option.img,
                "descriptions": option.descriptions,
                "elementCmpId": 0
              };
            } else {
              // Caso contrário, crie um novo objeto para o elemento e a opção
              const elementObj = {
                "id": element.id,
                "name": element.name,
                "imgUrl": "string",
                "type": "string",
                "sectionCmpId": 0,
                "index": element.index,
                "optionProductCmpDto": {
                  "id": option.id,
                  "name": option.name,
                  "price": option.price,
                  "img": option.img,
                  "descriptions": option.descriptions,
                  "elementCmpId": 0
                }
              };

              existingSection.elementProductCmpDtos.push(elementObj);
            }
          } else {
            // Se a seção não existir, crie uma nova seção com o elemento e a opção
            const sectionObj = {
              "sectionId": section.id,
              "name": section.name,
              "imgUrl": "string",
              "categoryId": 0,
              "elementProductCmpDtos": [{
                "id": element.id,
                "name": element.name,
                "imgUrl": "string",
                "type": "string",
                "sectionCmpId": 0,
                "index": element.index,
                "optionProductCmpDto": {
                  "id": option.id,
                  "name": option.name,
                  "price": option.price,
                  "img": option.img,
                  "descriptions": option.descriptions,
                  "elementCmpId": 0
                }
              }]
            };

            this.products_cmp.sectionProductCmpDtos.push(sectionObj);
          }

          if (!selectedOptionsInfo.find((sec) => sec.section === section.name)) {
            selectedOptionsInfo.push({
              section: section.name,
              elements: [],
            });
          }

          // push element to elements array
          const elementInfo = {
            element: element.name,
            index: element.index,
            option: option.name,
            price: option.price,
            img: option.img,
          };

          selectedOptionsInfo[selectedOptionsInfo.length - 1].elements.push(elementInfo);






          //selectedOptionsInfo.push(optionInfo);

          //selectedOptionsInfo.push(optionInfo);
        });

        // Atualize o valor total
        this.products_cmp.value = this.products_cmp.sectionProductCmpDtos.reduce((total, section) => {
          return total + section.elementProductCmpDtos.reduce((eleTotal, element) => {
            return eleTotal + element.optionProductCmpDto.price;
          }, 0);
        }, 0);

        this.selectedOptionsInfo = selectedOptionsInfo;
      }
    },
    imprimirTabela() {
      this.columnWidth = "150"
      window.print();
      this.columnWidth = "*"
    },
    getStoreConfig() {
      const config = { headers: { Authorization: AuthService.getToken() } };
      axios.get(`http://localhost:8081/store`, config)
        .then((response) => {
          if (response.status === 200) {
            this.storeConfig.logo = response.data.storeLogoPath
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
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/scss/basics.scss';

/*:deep(.el-step__head.is-finish) {
  color: var(--cta-color);
  border-color: var(--cta-color);
}

:deep(.el-step__title.is-finish) {
  color: var(--cta-color);
}*/

.container,
.cmp-container {
  background-color: #FFFFFF !important;
  padding-top: 0;

  h1 {
    font-size: 32px;
    font-weight: 300;
    color: $text-color;
    margin-top: 5%;
  }
}

:deep(.el-step__icon-inner.is-status) {
  transform: translate(-5px, -6px);
}

:deep(.el-icon svg) {
  height: 25px;
  width: 25px;
}

.el-steps {
  background-color: transparent !important;
  width: 40%;
}

.steps-container {
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  padding-bottom: 10px;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;

  h2 {
    padding-left: 20px;
  }
}

h2 {
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 10px;
}

.el-menu {
  justify-content: space-between;
  height: 100px;
  border-bottom: 0 !important;

  h1 {
    font-size: 32px;
    font-weight: 300;
    color: $text-color;
    margin-right: 5%;
    margin-bottom: 0;
  }
}

.cmp-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: $secondary-color;

  .cmp-sections {
    width: 70%;
    height: 100%;
    border-radius: 10px;
    padding: 20px;

    .inner-section {
      display: flex;
      flex-direction: column;

      h1 {
        font-size: 8rem;
        text-align: center;
        font-weight: 300;
      }

      .section-elements {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;

        .element-item {
          margin: 20px;

          .el-image {
            width: 100px;
            height: 100px;
            margin-bottom: 10px;
          }

          .option-image-placeholder {
            width: 100px;
            height: 100px;
            margin: 5px;
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: $primary-color;
          }

          .option-info {
            display: flex;
            flex-direction: column;
            text-transform: none;

            .option-name {
              font-size: 14px;
              font-weight: 600;
              white-space: normal;
              margin-bottom: 5px;
            }

            .option-price {
              font-size: 12px;
              font-weight: 400;
              white-space: normal;
            }
          }
        }
      }


      div.actions {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }
    }

  }

  .resumo {
    width: 30%;
    height: 100%;
    border-radius: 10px;
    margin-left: 20px;
    padding: 20px;
    background-color: #f5f5f5;

    h2 {
      font-size: 20px;
      color: var(--cta-color);
    }


    .resumo-section-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .resumo-section-item {
        margin: 0 10px 10px 0;
        padding: 10px;
        min-width: 150px;
        background-color: $primary-color;

        h4 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 14px;
        }

        p {
          font-size: 12px;
        }


        .resumo-section-item-option {
          display: flex;
          justify-content: space-between;

        }
      }
    }
  }
}

.revisar-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.revisar-section {

  display: flex;
  justify-content: center;
  flex-direction: column;

  h2 {
    font-size: 36px;
    width: 150px;
    text-align: start;
    margin: 0;
    font-weight: 300;
    font-family: josefin;
  }

  .revisar-section-section {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .revisar-main-section {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    //border: 1px solid $admin-grey;
    padding: 10px 0 10px 10px;

    .revisar-section-item {
      margin: 0 10px 0 0;
      padding: 0;
      min-width: 80px;
      width: 100%;
      height: 100% !important;
      display: flex;
      justify-content: space-around;
      flex-direction: row !important;
      outline: 1.5px solid $admin-grey-lighter;


      .element-option {
        font-size: 14px;
        font-weight: 400;
        color: var(--el-color-success);

      }

      .element-price {
        font-size: 12px;
        font-weight: 400;
        min-width: 50px;
        text-align: end;
        color: $text-color;
      }

      .el-image {
        width: 180px;
        height: 180px;

        .el-image__error {
          min-height: 180px;
          min-width: 180px;

        }
      }

      img {
        width: 180px;
      }

      .element-image {
        width: 180px;
        height: 180px;
        display: flex;
        margin: 10px 0;
        justify-content: center;
        align-items: center;
        align-self: center;
      }

      h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 12px;
        text-align: left;
        color: $text-color;
        font-weight: 400;
      }

      .el-text {
        max-width: 50%;
        word-break: normal;
      }

      p {
        font-size: 12px;
      }



      .revisar-section-item-option {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-left: 20px;
        width: 90%;

        :deep(.el-text) {
          align-self: end !important;
        }

        i.option-dialog-button {
          position: relative !important;
          align-self: baseline !important;
          color: $admin-grey;
          margin: 5px 5px 0px 0px;
        }
      }
    }

    .main {
      width: 380px;
      height: 180px;
      flex-direction: row;
      padding: 0px 0px 0px 5px;
    }
  }

  .revisar-secondary-section {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    height: 100%;

    .revisar-section-item {
      padding: 0;
      min-width: 250px;
      margin: 5px;
      height: 80px;
      display: flex;
      justify-content: flex-start;
      flex-direction: row;
      outline: 1.5px solid $admin-grey-lighter;
      align-content: center;
    }

    div.element-image,
    .el-image {
      width: 80px !important;
      height: 80px !important;
      min-width: 80px !important;
      margin: 0 !important;

      .el-image__error {
        min-height: 80px !important;
        min-width: 80px !important;

      }
    }

    .revisar-section-item-option {
      display: flex;
      justify-content: space-between;
      margin-left: 20px;
      margin-right: 0;
      align-items: flex-end !important;

      :deep(.el-text) {
        align-self: end !important;
      }
    }
  }
}


div.el-radio-group {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  border: 1px solid $secondary-color;

  :deep(.el-radio-button) {
    margin: 10px;
    transition: all 0.2s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }

  ;

  :deep(span.el-radio-button__inner) {
    padding: 10px 0;
    width: 120px;
    background-color: transparent;
    color: var(--el-text-color-regular) !important;

    display: flex;
    flex-direction: column;
    align-items: center;


  }

  :deep(.el-radio-button.is-active > .el-radio-button__inner) {
    transition: 0.1s;
    background-color: transparent !important;
    outline: 2px solid var(--cta-color) !important;
    color: $text-color !important;

  }
}

.preco-final {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;

  h2 {
    margin-left: 10px;
    font-size: 20px;
  }

  h3 {
    font-weight: 400;
  }
}

.el-text--success {
  font-size: 18px;
}

:deep(.el-step__head.is-success) {
  height: 24px;
}

.el-table {

  .el-image,
  img {
    width: 100px;
  }
}

.option-dialog-button {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 5;
}

.dialog-content {
  display: flex;
  flex-direction: row;

  .el-image {
    width: 160px;
    height: 160px;
    margin-right: 20px;
  }

  img {
    width: 100%;
    height: 160px;
    margin-right: 20px;
  }

  h3 {
    font-weight: 400;
    font-size: 14px;
  }
}





@media screen and (max-width: 768px){

  :deep(.el-dialog){
    width: 100% !important;
  }
  .el-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

    h1 {
      margin-bottom: 10px;
    }
  }
  .cmp-container {
    flex-direction: column;

    .cmp-sections {
      width: 100%;
      margin-bottom: 20px;
    }

    .resumo {
      width: 100%;
    }
  }
  .revisar-section-section{
    flex-direction: column !important; 

    h2{
      text-align: center;
    }
  }
  .revisar-section {

    .v-for{
      width: 95%;
      margin: 5px;
    }
    
    .revisar-main-section {
      flex-direction: column;
      align-items: center;
      width: 100%;

      .revisar-section-item {
        width: 100%;
        padding: 0;
        min-width: 80px;
        height: 80px;
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        outline: 1.5px solid $admin-grey-lighter;

        .element-option {
          font-size: 14px;
          font-weight: 400;
          color: var(--el-color-success);

        }

        .element-price {
          font-size: 12px;
          font-weight: 400;
          min-width: 50px;
          text-align: end;
          color: $text-color;
        }

        .el-image {
          width: 180px;
          height: 180px;

          .el-image__error {
            min-height: 180px;
            min-width: 180px;

          }
        }

        .main{
          width: 100%;
          height: 180px;
          flex-direction: column;
          padding: 0px 0px 0px 5px;
        }

        img {
          width: 180px;
        }

        .element-image {
          width: 180px;
          height: 180px;
          display: flex;
          margin: 10px 0;
          justify-content: center;
          align-items: center;
          align-self: center;
        }

        h4 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 12px;
          text-align: left;
          color: $text-color;
          font-weight: 400;
        }

        .el-text {
          max-width: 50%;
          word-break: normal;
        }

        p {
          font-size: 12px;
        }
      }
    }
    .revisar-secondary-section {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      height: 100%;
      width: 100%;


      .revisar-section-item {
        padding: 0;
        min-width: 250px;
        margin: 0;
        height: 80px;
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        outline: 1.5px solid $admin-grey-lighter;
        align-content: center;
      }

      div.element-image,
      .el-image {
        width: 80px !important;
        height: 80px !important;
        min-width: 80px !important;

        .el-image__error {
          min-height: 80px !important;
          min-width: 80px !important;

        }
      }

      .revisar-section-item-option {
        display: flex;
        justify-content: space-between;
        margin-left: 20px;
        margin-right: 0;
        align-items: flex-end !important;

        :deep(.el-text) {
          align-self: end !important;
        }
      }
    }
  }
}
</style>
