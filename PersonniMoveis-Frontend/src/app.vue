<template>
  <div v-if="currentUrl.includes('/login') || currentUrl.includes('/checkout') || currentUrl.includes('/modelar')">
    <router-view />
  </div>
  <div v-else-if="!currentUrl.includes('/admin')">
    <Navbar />
      <router-view />
    <Footer />
  </div>
  <div v-else class="admin-page">
    <Sidenav/>
    <router-view />
  </div>
  
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import Sidenav from '@/components/Sidenav.vue';
import axios from 'axios';
import AuthService from '@/store/authService';

export default {
  data() {
    return {
      primaryColor: "#B68D40",
      secondaryColor: "#112620",
      storeSettings: {
          primaryCollor: "",
          secondaryCollor: "",
      },
    }
  },
  components: {
    Navbar,
    Footer,
    Sidenav,
  },
  created() {
    this.getStoreConfig;
  },
  computed: {
    currentUrl() {
      return this.$route.path;
    },
    getStoreConfig() {
      const config = { headers: { Authorization: AuthService.getToken() } };
      axios.get(`http://localhost:8081/store`, config)
        .then((response) => {
        if (response.status === 200) {
            this.storeSettings = response.data;

          if (this.storeSettings.primaryCollor === null || this.storeSettings.primaryCollor === '') {
            this.storeSettings.primaryCollor = this.primaryColor;
          }
          if (this.storeSettings.secondaryCollor === null || this.storeSettings.secondaryCollor === '') {
            this.storeSettings.secondaryCollor = this.secondaryColor;
          }

          console.log(this.storeSettings.primaryCollor);
          console.log(this.storeSettings.secondaryCollor);


            document.documentElement.style.setProperty(
                '--cta-color',
                this.storeSettings.primaryCollor
            );
            document.documentElement.style.setProperty(
                '--tertiary-color',
                this.storeSettings.secondaryCollor
            );
            document.documentElement.style.setProperty(
                '--tertiary-darker',
                this.darkenColor(this.storeSettings.secondaryCollor, 10)
            );
          
        } else {
            ElMessage.error('Erro ao receber config da empresa:', response.statusText);
        }
    })
    .catch((error) => {
        console.error('Erro ao buscar dados da API:', error);
    });
    }
  },
  watch: {
    $route(to, from) {
      const isAdminPage = to.path.includes('/admin');

      if (isAdminPage) {
        document.body.classList.add('admin-body');
      } else {
        document.body.classList.remove('admin-body');
      }


      const isCheckoutPage = to.path.includes('/checkout');

      if (isCheckoutPage) {
        document.body.classList.add('checkout-body');
      } else {
        document.body.classList.remove('checkout-body');
      }


      const isCMP = to.path.includes('/modelar');

      if (isCMP) {
        document.body.classList.add('cmp-body');
      } else {
        document.body.classList.remove('cmp-body');
      }
    }
  },
  methods: {
    darkenColor(hex, percent) {
    // Ensure the percent is within the valid range
    percent = Math.max(0, Math.min(100, percent));

    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    // Calculate the darkened RGB values
    r = Math.round(r * (1 - percent / 100));
    g = Math.round(g * (1 - percent / 100));
    b = Math.round(b * (1 - percent / 100));

    // Ensure the RGB values are within the valid range
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    // Convert back to hex
    const darkenedHex =
        "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
      console.log(darkenedHex);

    return darkenedHex;
}
  }
  
}

</script>

<style lang="scss" scoped>
// Import your SCSS file
@import '@/assets/styles/scss/basics.scss';
</style>
