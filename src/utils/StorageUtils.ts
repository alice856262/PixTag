export class StorageUtils {
  static saveEmail(email: string) {
    localStorage.setItem('email', email)
  }

  static getEmail(): string {
    return localStorage.getItem('email') ?? ''
    // return localStorage.getItem('email') ?? 'nicolsonzs0112@gmail.com'
  }
}
