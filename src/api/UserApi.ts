import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js'
import { tagSubscriptionUrl, userPool } from '@/config/aws-config.ts'
import { StorageUtils } from '@/utils'

export class UserApi {
  static signUp(
    givenName: string,
    password: string,
    email: string,
    familyName: string,
  ): Promise<CognitoUser> {
    const userAttributes: CognitoUserAttribute[] = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'given_name', Value: givenName }),
      new CognitoUserAttribute({ Name: 'family_name', Value: familyName }),
    ]

    return new Promise((resolve, reject) => {
      const username = givenName + familyName
      userPool.signUp(username, password, userAttributes, [], (err, res) => {
        if (err) {
          console.log(err)
          reject(err)
          return
        }
        if (!res) {
          reject('current user is null')
          return
        }
        console.log('success', JSON.stringify(res.user))
        resolve(res.user)
      })
    })
  }

  static confirmRegistration(
    user: CognitoUser,
    code: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      user.confirmRegistration(code, true, (err, res) => {
        if (err) {
          console.log(err)
          reject(err)
          return
        }
        console.log('confirmRegistration', JSON.stringify(res))
        resolve(true)
      })
    })
  }

  static login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      })
      const cognitoUser = new CognitoUser({
        Pool: userPool,
        Username: email,
      })
      console.log('email', email)
      console.log('password', password)

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          StorageUtils.saveEmail(email)
          resolve(true)
        },
        onFailure: (err) => {
          if (err) {
            console.log(err)
            reject(err)
            return
          }
        },
      })
    })
  }

  /**
   *  user 订阅tag
   */
  static async subscriptionTag(tag: string): Promise<boolean> {
    try {
      const requestBody = JSON.stringify({
        tag,
        user_email: StorageUtils.getEmail(),
      })
      console.error(tagSubscriptionUrl, requestBody)
      const response = await fetch(tagSubscriptionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      })
      return response.ok
    } catch (e) {
      console.error(tagSubscriptionUrl, e)
    }
    return false
  }
}
