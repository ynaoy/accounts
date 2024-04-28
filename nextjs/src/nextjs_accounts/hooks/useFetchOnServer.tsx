'use server'
import {  fetchLoginFlgReturnType, fetchParamsType, 
  signupParamsType, signupToBackendServerReturnType,
  loginParamsType, loginToBackendServerReturnType } from './types/useFetch.d'
import { cookies } from 'next/headers'
import { fetchResponse } from './useFetch'

export const fetchResponseWithAuth = async(url:string, 
                                    params:fetchParamsType, 
                                    data: Record<string, unknown> = {}) =>{
  /**
   * 認証情報付きでAPIと通信する基本的な関数
   * @return { Response }
  */

  // クッキーから認証情報を取得
  const auth = getCookie('Authorization'); // 存在しなければundefined
  if(auth!=undefined){
    params.headers['Authorization'] = `${process.env.NEXT_PUBLIC_JWT_AUTH_HEADER_TYPES} ${auth}`
  }
  // APIにリクエストを送ってレスポンスをもらう
  let response = await fetchResponse(url, params, data)
  return response
}

const getCookie =(key:string)=>{
  /**
   * サーバー上でクッキーを取得する
   * @return { string|undefined }
  */
  const cookie = cookies().get(key)  // 存在しなければundefined
  return cookie? cookie.value: undefined
}

export const useFetchOnServer = ()=> {

  const fetchLoginFlgFromBackendServer:fetchLoginFlgReturnType =async()=>{
    /**
     * バックエンドサーバーにリクエストを送って、ログイン状態を受け取る 
     * @return {httpStatus: number, statusText: string, data: {[key:string]: string[]}}
    */
    // バックエンドサーバーにリクエストを送る
    try{
      const response = await fetchResponseWithAuth(
        `${process.env.NEXT_PUBLIC_API_ORIGIN}/api/is_login/`,
        { method:'GET', headers: {}, credentials: 'include',} 
      )
      let ret = await response.json()// { loginFlg: {boolean}}
      return {
        httpStatus: response.status,
        statusText: response.statusText,
        data:ret
      }
  
    } catch(error) {
      console.error(error);
      return { 
        // 汎用的なエラーレスポンスを返す
        httpStatus: 500,
        statusText: 'Internal Server Error',
        data: { loginFlg: false, message: '予期せぬエラーが発生しました' },
      };
    }
  }

  const signupToBackendServer:signupToBackendServerReturnType =async(data: signupParamsType)=>{
    /**
     * バックエンドサーバーにPOSTメソッドでリクエストを送る
     * @return {httpStatus: number, statusText: string, data: {[key:string]: string[]}}
    */
    
    // バックエンドサーバーにリクエストを送る
    try{
      const response = await fetchResponseWithAuth(
      `${process.env.NEXT_PUBLIC_API_ORIGIN}/api/signup/`,
      { method:'POST', headers: {}, credentials: 'include', },
      data)

      // クッキーの取得
      const cookie = response.headers.get('set-cookie');
      // jsonを解凍 
      let ret = await response.json()
      // jsonオブジェクトとクッキーをリターン
      return {
        json:{httpStatus: response.status,
              statusText: response.statusText,
              data: ret},
        cookie: cookie
      }
    } catch(error) {
      console.error('Undefind Error:', error);
      return { 
        // 汎用的なエラーレスポンスを返す
        json: { httpStatus: 500,
                statusText: 'Internal Server Error',
                data: { message: '予期せぬエラーが発生しました' }},
        cookie: null
      };
    }
  }
  const loginToBackendServer:loginToBackendServerReturnType =async(data: loginParamsType)=>{
    /**
     * バックエンドサーバーにPOSTメソッドでリクエストを送る
     * @return {httpStatus: number, statusText: string, data: {[key:string]: string[]}}
    */
    
    // APIにリクエストを送る
    try{
      const response = await fetchResponseWithAuth(
      `${process.env.NEXT_PUBLIC_API_ORIGIN}/api/login/`,
      { method:'POST', headers: {}, credentials: 'include', },
      data)
      // クッキーの取得
      const cookie = response.headers.get('set-cookie');
      // jsonを解凍 
      let ret = await response.json()
      // jsonオブジェクトとクッキーをリターン
      return {
        json:{httpStatus: response.status,
              statusText: response.statusText,
              data: ret},
        cookie: cookie
      }
    } catch(error) {
      console.error('Undefind Error:', error);
      return { 
        // 汎用的なエラーレスポンスを返す
        json: { httpStatus: 500,
                statusText: 'Internal Server Error',
                data: { message: '予期せぬエラーが発生しました' }},
        cookie: null
      };
    }
  }

  return{
    fetchLoginFlgFromBackendServer,
    signupToBackendServer,
    loginToBackendServer
  }
}
