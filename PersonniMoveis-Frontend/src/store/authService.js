/** Gerencia autenticação, acessos e redirecionamentos no front. */

import jwtDecode from "jwt-decode";

const AuthService = {
  setToken(token) {
    localStorage.setItem('token', token); // Armazena o token no localStorage
  },
  getToken() {
    return localStorage.getItem('token'); // Obtém o token do localStorage
  },
  clearToken() {
    localStorage.removeItem('token'); // Remove o token do localStorage
  },
  /** Retorna true se usuário esta logado (tem token), senão falso. */
  hasUserLoggedIn() {
    return this.getToken();
  },
  /** Adquire valor do token (claim) via chave informada. Se valor não existe retorna null. */
  getTokenClaim(key) {
    if(key) {
      //return this.getToken().
    }
  },
  /** Checa se usuário está logado (deve ter feito login para poder acessar a página.) */
  shouldRedirectToLogin(router) {
    // Se ainda não tem token (user não logado) redireciona para fazer login.
    if (!this.hasUserLoggedIn()) {
      router.replace('/login');
      return true;
    }
  },

  // Nas seguintes funções, em todas checagens em que é necessário identificar o role (papel do usuário), retornará
  // true para usuários admin, porque admin pode fazer tudo.

  /** Se usuário tem permissão de colab ou ADMIN, retorna true */
  isUserColaborator() {
    if(this.getToken()) {
      const usuario = jwtDecode(this.getToken());
      if (usuario && usuario.userRole === 'COLABORATOR' || usuario.userRole === 'ADMIN') {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
};

export default AuthService;