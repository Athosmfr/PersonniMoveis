<template>
    <div class="admin-container">
        <div class="card-list">
            <el-card class="card-item" shadow="never">
                <div class="card-content">
                    <div class="card-content-item">
                        <h2> Produtos </h2>
                        <h1 class="card-content-item-value">{{ produtos.length }}</h1>
                    </div>
                </div>
            </el-card>

            <el-card class="card-item" shadow="never">
                <div class="card-content">
                    <div class="card-content-item">
                        <h2> Categorias </h2>
                        <h1 class="card-content-item-value">{{ categorias.length }}</h1>
                    </div>
                </div>
            </el-card>

            <el-card class="card-item" shadow="never">
                <div class="card-content">
                    <div class="card-content-item">
                        <h2> Usuários </h2>
                        <h1 class="card-content-item-value">{{ usuarios.length }}</h1>
                    </div>
                </div>
            </el-card>

            <el-card class="card-item" shadow="never">
                <div class="card-content">
                    <div class="card-content-item">
                        <h2> Pedidos </h2>
                        <h1 class="card-content-item-value">{{ pedidos.length }}</h1>
                    </div>
                </div>
            </el-card>
        </div>
        <LineChart :chartData="testData" />
    </div>
  
</template>

<script>
import axios from 'axios';
import AuthService from '@/store/authService';
import jwtDecode from 'jwt-decode';
import { ElLoading } from 'element-plus';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
    data() {
        return {
            categorias: [],
            produtos: [],
            usuarios: [],
            pedidos: [],
            testData: [
                {
                    label: "Produtos",
                    datasets: [
                        {
                            data: "",
                            backgroundColor: '#FF9900',
                        },
                    ],
                }
            ],
        }
    },
    components: { LineChart },
    methods: {
        
    },
    created() {
        if (!AuthService.isUserColaborator()) {
            this.$router.replace('/');
        }

        const loading = ElLoading.service({
            lock: true,
            text: 'Carregando dados do usuário...',
            background: 'rgba(0, 0, 0, 0.7)'
        });

        axios.get('http://localhost:8081/category')
                .then(response => {
                    this.categorias = response.data;
                }).catch(error => {
                    console.error('Erro ao obter categorias: ', error);
                });
        axios.get('http://localhost:8081/products')
                .then(response => {
                    this.produtos = response.data;
                }).catch(error => {
                    console.error('Erro ao obter produtos: ', error);
                });
        axios.get('http://localhost:8081/users')
                .then(response => {
                    this.usuarios = response.data;
                }).catch(error => {
                    console.error('Erro ao obter usuarios: ', error);
                });
        axios.get('http://localhost:8081/orders')
                .then(response => {
                    this.pedidos = response.data;
                }).catch(error => {
                    console.error('Erro ao obter pedidos: ', error);
                });
                setTimeout(() => {
            loading.close()
          }, 250)
        
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/styles/scss/basics.scss";
.card-list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.el-card.is-never-shadow.card-item {
  width: 20%;
  margin: 1%;
  min-width: 150px;
  min-height: 100px;
}
.card-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;

  h1{
    margin-bottom: 0;
    color: $text-color;
  }
  h2{
    margin-top: 0;
    color: $admin-grey;
  }
}
.card-content-item > a {
  font-size: 10px;
  color: var(--cta-color);
  display: flex;
  align-items: center;
  text-decoration: underline;

  i {
    margin-left: 5px;
  }
}


</style>