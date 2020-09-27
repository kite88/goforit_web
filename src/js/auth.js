const AuthController = function () {
  this.username = localStorage.getItem('username')
  this.token = localStorage.getItem('token')
}
AuthController.prototype = {
  save (data) {
    if (data) {
      this.username = data.username
      this.token = data.token
    }
    localStorage.setItem('username', this.username)
    localStorage.setItem('token', this.token)
  },
  destroy () {
    localStorage.removeItem('username')
    localStorage.removeItem('token')
  }
}
export default AuthController
