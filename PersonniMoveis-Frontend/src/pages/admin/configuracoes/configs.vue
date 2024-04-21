<template>
    <div class="admin-container">
      <h1>Configurações</h1>
      <el-form :model="user" label-width="*" label-position="top">
        <h2>Configurações da empresa</h2>
        <el-form-item label="Nome da Empresa">
          <el-input v-model="user.storeName"></el-input>
        </el-form-item>
        <div class="images">
          <el-form-item label="Logomarca da Empresa">
                              <div>
                                <el-upload class="avatar-uploader" :auto-upload="false" limit="1"
                                  @change="handleImageChange">
                                  <img v-if="user.storeLogoPath" :src="user.storeLogoPath" class="avatar" />
                                  <el-icon v-else class="avatar-uploader-icon">
                                    <Upload />
                                  </el-icon>
                                </el-upload>
                              </div>
                            </el-form-item>
          <el-form-item label="Logomarca alternativa da Empresa">
            <el-upload class="avatar-uploader" :auto-upload="false" limit="1" @change="handleImageChangeSecondary($event)">
                <img v-if="user.storeSecondaryImgPath" :src="user.storeSecondaryImgPath" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                    <Upload />
                </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="Placeholder para produtos sem imagem">
            <el-upload class="avatar-uploader" :auto-upload="false" limit="1" @change="handleImageChangePlaceholder($event)">
                <img v-if="user.storePlaceholdeImgPath" :src="user.storePlaceholdeImgPath" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                    <Upload />
                </el-icon>
            </el-upload>
          </el-form-item>
        </div>
        <el-form-item label="Email da Empresa">
          <el-input v-model="user.storeEmail"></el-input>
        </el-form-item>
        <el-form-item label="Sobre Nós">
          <el-input v-model="user.aboutUsInfo" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="Contato da Empresa">
          <el-input v-model="user.storePhone"></el-input>
        </el-form-item>
        <el-form-item label="Endereço da Empresa">
          <el-autocomplete v-model="user.storeAddress" :fetch-suggestions="fetchPredictions" @select="handleSelect" :debounce="500">
          </el-autocomplete>
        </el-form-item>
        <h2>Configurações do site</h2>
        <el-form-item label="Cor principal do Site">
            <el-color-picker class="cor-pick" v-model="user.primaryCollor" color-format="hex" />
            <h2>{{ user.primaryCollor  }}</h2>
        </el-form-item>
        <el-form-item label="Cor secundária do Site">
            <el-color-picker v-model="user.secondaryCollor" class="cor-pick" color-format="hex" />

            <h2>{{ user.secondaryCollor   }}</h2>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="cta" @click="editarUsuario">Salvar</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>


  <script>
  import axios from 'axios';
  import { ElMessage, ElLoading } from 'element-plus';
  import AuthService from '@/store/authService.js';
  import jwtDecode from 'jwt-decode';
  import imgConverter from '@/store/imgConverter.js';

  
  export default {
    data() {
      return {
        user: {
          storeId: "1",
          storeName: "",
          addressMeta: "",
          storeLogoPath: null,
          storeSecondaryImgPath: null,
          storePlaceholdeImgPath: null,
          storeEmail: "",
          aboutUsInfo: "",
          storeAddress: "",
          storePhone: "",
          primaryCollor: "",
          secondaryCollor: "",
        },
        predictions: [],
        options: {
          types: ["geocode"]
        },
      }
    },
    created() {

      if (!AuthService.isUserColaborator()) {
        this.$router.replace('/');
      }
    },
    mounted() {

        // this.user.storeId = 1;
      const config = { headers: { Authorization: AuthService.getToken() } };
      // Fazer uma solicitação GET para buscar dados do usuário por ID
      axios.get(`http://localhost:8081/store`, config)
        .then((response) => {
        if (response.status === 200) {
            this.user = response.data;
            if (this.user.primaryCollor === null || this.user.primaryCollor === '') {
                this.user.primaryCollor = '#B68D40';
            }
            if (this.user.secondaryCollor === null || this.user.secondaryCollor === '') {
                this.user.secondaryCollor = '#112620';
            }
            console.log('Dados recebidos do backend:', this.user);
            
        } else {
            ElMessage.error('Erro ao buscar dados da API:', response.statusText);
        }

        
    })
    .catch((error) => {
        console.error('Erro ao buscar dados da API:', error);
    });
    },
    methods: {
      onInput() {
      if (this.user.storeAddress.length > 0) {
        this.fetchPredictions(this.user.storeAddress);
      } else {
        this.predictions = [];
      }
      },
      fetchPredictions(queryString, cb) {
        if (queryString) {
          const apiKey = 'removed-for-public-repository';
          const apiUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

          console.log(apiUrl + "?input=" + queryString + "&language=pt_BR&key=" + apiKey)
          axios.get(apiUrl + "?input=" + queryString + "&language=pt_BR&key=" + apiKey)
            .then(response => {
              this.predictions = response.data.predictions;
              // loop through predictions and made a new array of objects with label and value only
              this.predictions = this.predictions.map(prediction => {
                return { id: prediction.place_id, value: prediction.description };
              });
              console.log('Previsões:', this.predictions);
              cb(this.predictions);
            })
            .catch(error => {
              console.error('Error fetching predictions:', error);
            });
        }
        else {
          cb([])
        }
      },
      handleSelect(item) {
        this.user.storeAddress = item.value;
        this.user.addressMeta = item.id;
      },

      
      async handleImageChange(file, option) {
            try {
                // Adquire imagem como string base64.
                this.user.storeLogoPath = await imgConverter.fileToBase64String(file.raw);
            } catch (error) {
                ElMessage.error('Erro - não foi possível fazer o upload da imagem.')
            }
        },
        async handleImageChangeSecondary(file, option) {
            try {
                // Adquire imagem como string base64.
                this.user.storeSecondaryImgPath = await imgConverter.fileToBase64String(file.raw);
            } catch (error) {
                ElMessage.error('Erro - não foi possível fazer o upload da imagem.')
            }
        },
        async handleImageChangePlaceholder(file, option) {
            try {
                // Adquire imagem como string base64.
                this.user.storePlaceholdeImgPath = await imgConverter.fileToBase64String(file.raw);
            } catch (error) {
                ElMessage.error('Erro - não foi possível fazer o upload da imagem.')
            }
        },
      editarUsuario() {
        const loading = this.$loading({
          lock: true,
          text: 'Salvando...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        this.user.storeId = 1;
        console.log('Dados a serem enviados:', this.user);

        const config = { headers: { Authorization: AuthService.getToken() } };

        axios.put(`http://localhost:8081/store/update-store  `, this.user, config)
          .then((response) => {
            if (response.status === 200) {
              console.log('Usuário editado com sucesso', response.data);
              setTimeout(() => {
                loading.close();
                ElMessage.success('Dados de configuração editados com sucesso!');
                location.reload();
              }, 250);
            } else {
              console.error('Erro ao editar dados de configuração:', response.statusText);
            }
          })
          .catch((error) => {
            console.error('Erro ao editar usuário:', error);
          });
      }
    },
  }
  </script>

<style scoped lang="scss">
@import "@/assets/styles/scss/basics.scss";
h1{
  margin: 0 0 2.5% 0 !important;
}
.el-input.section-input {
    width: 50%;
}
.elements{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.element-card{
    border: 2px solid $admin-grey;
    padding: 0 20px 20px 20px;
    width: 300px;
    margin: 20px 20px 0 0;
    h2{
        text-align: center;
        color: $admin-grey;
    }
}

.cor-pick {
    background-color: #000 !important;
}
.el-form-item__content{
  h2{
    color: $text-color;
    margin: 0 5px;
    font-weight: 400;
  }
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
    width: 100%;
    height: 100px;
    display: block;
    min-width: 100px;
    min-height: 100px;
}
:deep(.el-color-picker__trigger) {
  height: 100px !important;
  width: 100px !important;
}
.images{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.el-input_wrapper{
  border: 1px solid $grey-border;
}
:deep(.el-autocomplete){
  width: 100%;
}
</style>

<style lang="scss">
@import "@/assets/styles/scss/basics.scss";
.el-popper {
  background-color: $primary-color !important;; 
  border: none;
}
</style>