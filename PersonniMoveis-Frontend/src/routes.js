import Index from '@/pages/user/index.vue';
import NotFound from '@/pages/user/not-found.vue';

import UserDashboard from '@/pages/user/perfil/dashboard.vue';

import ProdutosListar from '@/pages/user/produtos/listagem.vue';
import ProdutosSingle from '@/pages/user/produtos/single.vue'
import ProdutosPersonalizar from '@/pages/user/produtos/personalizar.vue'

import CMP from '@/pages/user/cmp/cmp.vue'
import CMPselecionarCategoria from '@/pages/user/cmp/selecionar-categoria.vue'

import CarrinhoResumo from '@/pages/user/carrinho/resumo.vue'
import CarrinhoPagamento from '@/pages/user/carrinho/pagamento.vue'

import AdminDashboard from '@/pages/admin/dashboard.vue';
import AdminListarProdutos from '@/pages/admin/produtos/listagem.vue';
import AdminAdicionarProduto from '@/pages/admin/produtos/adicionar.vue'
import AdminEditarProduto from '@/pages/admin/produtos/editar.vue';
import AdminListarCategorias from '@/pages/admin/categorias/listagem.vue';
import AdminEditarCategoria from '@/pages/admin/categorias/editar.vue';
import AdminListarPedidos from '@/pages/admin/pedidos/listagem.vue';
import AdminAdicionarCategoria from '@/pages/admin/categorias/adicionar.vue';
import AdminListarUsuarios from '@/pages/admin/usuarios/listagem.vue';
import AdminAdicionarUsuarios from '@/pages/admin/usuarios/adicionar.vue';
import AdminEditarUsuario from '@/pages/admin/usuarios/editar.vue';
import AdminConfig from '@/pages/admin/configuracoes/configs.vue';


import Login from '@/pages/login/login.vue';
import Cadastro from '@/pages/login/cadastro.vue';
import Valida from '@/pages/login/valida.vue';
import AtualizaSenha from '@/pages/login/novaSenha.vue';
import RecuperarSenha from '@/pages/login/recuperarSenha.vue';

export const routes = [
  { path: '/login', component: Login},
  { path: '/login/cadastro', component: Cadastro },
  { path: '/validated-account', component: Valida, props: route => ({ token: route.query.token }) },
  { path: '/update-password', component: AtualizaSenha, props: route => ({ token: route.query.token }) },
  { path: '/login/recuperar-senha', component: RecuperarSenha },

  { path: '/', component: Index },
  { path: '/perfil', component: UserDashboard},

  { path: '/produtos', component: ProdutosListar },
  { path: '/produtos/:id', component: ProdutosSingle },
  { path: '/produtos/:id/personalizar', component: ProdutosPersonalizar },

  { path: '/modelar', component: CMPselecionarCategoria},
  { path: '/modelar/:id', component: CMP},

  { path: '/carrinho', component: CarrinhoResumo },
  { path: '/checkout', component: CarrinhoPagamento },

  { path: '/admin', component: AdminDashboard },
  { path: '/admin/produtos', component: AdminListarProdutos },
  { path: '/admin/produtos/adicionar', component: AdminAdicionarProduto },
  { path: '/admin/produtos/:id', component: AdminEditarProduto },
  { path: '/admin/categorias', component: AdminListarCategorias },
  { path: '/admin/categorias/:id', component: AdminEditarCategoria },
  { path: '/admin/pedidos', component: AdminListarPedidos },
  { path: '/admin/categorias/adicionar', component: AdminAdicionarCategoria },
  { path: '/admin/usuarios', component: AdminListarUsuarios },
  { path: '/admin/usuarios/adicionar', component: AdminAdicionarUsuarios },
  { path: '/admin/usuarios/:id', component: AdminEditarUsuario },
  { path: '/admin/configuracoes', component: AdminConfig },


  { path: '/:path(.*)', component: NotFound },
];

export default routes;