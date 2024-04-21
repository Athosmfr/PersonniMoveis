<template>
  <div>
    <div class="content">
      <div class="hero">
        <img src="../../assets/img/personni.png" alt="Personni Móveis" class="img-item"/>
        <div class="about">
          <h2> {{ storeConfig.name }} </h2>
          <h1> Modelagem e personalização de móveis </h1>
          <p> {{ storeConfig.aboutUs }} </p>
          <br>
          <router-link to="/modelar"><el-button class="cta" color="var(--cta-color)">Começar à modelar</el-button></router-link>

        </div>
      </div>

      <div class="novidades">
        <h2> Novidades </h2>
        <div class="block text-center">
          <el-carousel interval="5000" type="card" indicator-position="outside">
            <el-carousel-item v-for="product in newestProducts" :key="product">
              <div class="carousel-content">
                <div class="carousel-text">
                  <h3> {{ product.name }} </h3>
                  <p> {{ product.desciption }} </p>
                  <router-link :to="`/produtos/${product.productId}`"><el-button class="cta" color="var(--cta-color)">Detalhes</el-button></router-link>
                </div>
                <div class="carousel-image">
                  <img :src=product.mainImg>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <div class="categorias" v-if="categorias.length > 0">
        <h2> Categorias </h2>
        <div class="categorias-grid">
          <div v-for="i in categorias" :key="i">
            <div @click="$router.push({ path: '/produtos', query: { category: i.id } })" class="categoria-item">
              <h3> {{ i.name }} </h3>
            </div>
          </div>
        </div>
        
        <div class="sobre-catalogo">
          <router-link to="/produtos"><el-button class="cta" color="var(--cta-color)">Ver catálogo completo</el-button></router-link>
        </div>
      </div>

      <div class="localizacao">
        <h2> Localização </h2>
        <div ref="map" style="height: 500px; width: 100%;"></div>
      </div>

      
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import AuthService from '@/store/authService';
export default {
  data() {
    return {
      categorias: [],
      newestProducts: [],
      storeConfig: {
        name: '',
        aboutUs: '',
        addressId: '',
      },
      apiKey: "removed-for-public-repository",
      map: null,
    }
  },
  created() {
    // Adquirindo produtos para o carousel.
    this.getMostRecentProducts();
    // Adquirindo categorias.
    this.getProductCategories();
  },
  async mounted() {
    this.initMap();
    this.getStoreConfig();
  },
  watch: {
    storeConfig: {
      handler: function (val, oldVal) {
        
        this.getPlaceDetailsAndAddMarker(this.storeConfig.addressId, this.apiKey);
      },
      deep: true
    }
  },
  methods: {
    initMap() {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=`+ this.apiKey +`&callback=initGoogleMap`;
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);
      window.initGoogleMap = this.createMap;
    },
    createMap() {
      this.map = new window.google.maps.Map(this.$refs.map, {
        center: { lat: 37.7749, lng: -122.4194 }, 
        zoom: 13,
      });

      // You can add additional features or markers here
    },
    async getPlaceDetailsAndAddMarker(placeId, apiKey) {
      const placeDetails = await this.getPlaceDetails(placeId, apiKey);

      if (placeDetails) {
        const location = placeDetails.geometry.location;
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: this.map,
          title: placeDetails.name,
        });
      
        // Optional: You can also open an info window with additional details
        const infowindow = new google.maps.InfoWindow({
          content: `<strong>${this.storeConfig.name}</strong><br>${placeDetails.formatted_address}`,
        });
      
        marker.addListener('click', () => {
          infowindow.open(this.map, marker);
        });
      
        // Center the map on the marker
        this.map.setCenter(marker.getPosition());
      }
    },
    async getPlaceDetails(placeId, apiKey) {
      const apiUrl = 'https://maps.googleapis.com/maps/api/place/details/json';

      const params = {
        place_id: placeId,
        key: apiKey,
      };

      try {
        const response = await axios.get(apiUrl, { params });
        const placeDetails = response.data.result;
        return placeDetails;
      } catch (error) {
        console.error('Error fetching place details:', error);
        return null;
      }
    },
    /** Retorna os produtos mais recentemente adicinados. */
    getMostRecentProducts(amount) {
      // Configuração do parâmetro opcional para qtde de produtos.
      const config = { params: { amountOfProducts: amount ? amount : 5 } };
      // Default da api é retornar os 4 produtos mais recentes se 'amountOfProducts' não for informado.
      axios.get('http://localhost:8081/products/most-recent', config)
        .then(response => {
          this.newestProducts = response.data;
        })
        .catch(error => {
          console.error("Não foi possível arquirir os produtos mais recentes.", error);
        });
    },
    /** Adquire categorias. */
    getProductCategories() {
      axios.get('http://localhost:8081/category')
        .then(response => {
          this.categorias = response.data;
        })
        .catch(error => {
          console.error('Erro ao obter dados da API:', error);
        });
    },
    getStoreConfig() {
      const config = { headers: { Authorization: AuthService.getToken() } };
      axios.get(`http://localhost:8081/store`, config)
        .then((response) => {
        if (response.status === 200) {
            this.storeConfig.name = response.data.storeName;
            this.storeConfig.aboutUs = response.data.aboutUsInfo;
            this.storeConfig.addressId = response.data.addressMeta;


        } else {
            ElMessage.error('Erro ao receber config da empresa:', response.statusText);
        }
    })
    .catch((error) => {
        console.error('Erro ao buscar dados da API:', error);
    });
    }
  
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/scss/basics.scss';


div.content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-bottom: 5%;

  .cta{
        text-transform: uppercase;
        padding: 20px 40px !important;
        letter-spacing: 0.5px;
      }


   
  div.hero{
    display:flex;
    flex-direction: row;

    img.img-item, div.about{
      width: 50vw;
      height: 700px;
    }

    div.about{
      padding: 8rem;
      
      h1 {
      font-size: 6rem;
      font-weight: 400;
      margin-bottom: 0;
      margin-top: 20px;
      color: var(--cta-color);
      font-family: playfair-display;
      text-transform: uppercase;      
      }

      h2{
        font-size: 3rem;
        color: $primary-color;
        font-family: josefin;
        margin-top  : 0;
        font-weight: 300;
      }

      p {
        font-size: 1.5rem;
        letter-spacing: 0.5px;
        font-weight: 400;
        margin: 4rem 0;
        color: $secondary-color;
        line-height: 3rem;
      }

      a {
        font-size: 1.5rem;
        color: $user-grey;
        text-decoration: underline;
        font-weight: lighter;
      }

      
    }
    img.img-item{
      object-fit: cover;
    }
  }



  div.novidades{
      width: 100vw;
      margin-top: 2rem;
      //background-color: #fff;

    .block.text-center{
      display: flex;
      justify-content: center;
    }

    h2 {
      font-size: 4rem;
      font-weight: 300;
      color: inherit;     
      text-align: center; 
      font-family: josefin;
      color: var(--cta-color);
      margin: 6rem 0 3rem 0;
    }


    h3 {
      font-family: josefin;
      font-size: 3rem;
      margin: 0;
    }
    p{
      font-size: 2rem;
    }

    img {
      max-width: 600px;
      width: 100%;
    }

    .el-carousel__item {
      color: #0a1612;
      text-align: center;
      background-color: #FEFEFE;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .carousel-content {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

    }

    .el-carousel {
      width: 90vw;
      min-height: 400px;
    }

    :deep(.el-carousel__mask){
      filter: brightness(0);
    }
    :deep(.el-carousel__container) {
      height: 400px;
    }

  }

  div.categorias{
    margin-top: 2rem;
    padding: 0 20rem;

    h2 {
      font-size: 4rem;
      font-weight: 300;
      color: inherit;     
      text-align: center; 
      font-family: josefin;
      color: var(--cta-color);
      margin: 6rem 0 3rem 0;
    }

    div.sobre-catalogo{
      margin-top: 2rem;
      display: flex;
      justify-content: center;
    }
    div.categorias-grid{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
    }

    div.categoria-item{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin: 2rem;
      padding: 2rem;
      transition: all 0.3s ease-in-out;
      background-color: var(--tertiary-darker);
      height: 200px;
      width: 30vw;

      &:hover{
        transform: scale(1.1);
      }

      img{
        width: 100%;
        max-width: 150px;
        height: auto;
        border-radius: 10px;
      }

      h3{
        font-size: 5rem;
        color: $secondary-color;
        font-family: josefin;
        font-weight: 400;
      }
    }
  }


}

@media (max-width: 768px){
  div.content{
    div.hero{
      flex-direction: column;
      img.img-item, div.about{
        width: 100vw;
        height: 400px;
      }
      div.about{
        padding: 2rem;
        h1 {
          font-size: 3rem;
          margin-bottom: 0;
          margin-top: 20px;
        }
        h2{
          font-size: 2rem;
        }
        p {
          font-size: 1rem;
          margin: 2rem 0;
          line-height: 1.5rem;
        }
        a {
          font-size: 1rem;
        }
      }
    }
    div.novidades{
      padding: 0 2rem;
      h2 {
        font-size: 2rem;
        margin: 2rem 0 1rem 0;
      }
      h3 {
        font-size: 1.5rem;
      }
      p{
        font-size: 1rem;
      }
      img {
        max-width: 300px;
      }
      .el-carousel__item {
        padding: 0;
      }
      .carousel-content {
        flex-direction: column;
      }
      .carousel-image {
        margin-top: 1rem;
      }
    }
    div.categorias{
      padding: 0 2rem;
      h2 {
        font-size: 2rem;
        margin: 2rem 0 1rem 0;
      }
      div.categorias-grid{
        flex-direction: column;
        align-items: center;
      }
      div.categoria-item{
        width: 100%;
        margin: 1rem 0;
      }
    }
    
  }
}
div.localizacao{
  width: 100vw;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    font-size: 4rem;
    font-weight: 300;
    color: inherit;     
    text-align: center; 
    font-family: josefin;
    color: var(--cta-color);
    margin: 6rem 0 3rem 0;
  }

  img{
    width: 100%;
    height: auto;
  }
}

</style>