import jscookie from 'js-cookie';

class Auth {
  constructor() {
    if (jscookie.get('t')) {
      this.isAuth = true;
    } else {
      this.isAuth = false;
    }
  }

  login(token) {
    jscookie.set('t', token);
    this.isAuth = true;
  }

  logout() {
    jscookie.remove('t');
    this.isAuth = false;
  }

  checkLogin() {
    if (jscookie.get('t')) {
      return true;
    } else {
      return false;
    }
  }

  getToken() {
    return jscookie.get('t');
  }

}
export default new Auth();