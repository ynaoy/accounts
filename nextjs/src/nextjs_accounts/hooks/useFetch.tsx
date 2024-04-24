import {  fetchLoginFlgReturnType, fetchParamsType, 
  SignupParamsType, SignupReturnType,
  LoginParamsType, LoginReturnType } from './types/useFetch.d'
import { getCookie as getCookieOnClient } from 'cookies-next';
import { cookies as getCookieOnServer} from 'next/headers'

const fetchResponse = async(url:string, 
                            params:fetchParamsType, 
                            data: Record<string, unknown> = {}) =>{
  /**
   * APIと通信する基本的な関数
   * @return { Response }
  */

  // クッキーを取得
  const auth = getCookie('Authorization'); // 存在しなければundefined
  if(auth!=undefined){
    params.headers['Authorization'] = `${process.env.NEXT_PUBLIC_JWT_AUTH_HEADER_TYPES} ${auth}`
  }

  // Json形式でリクエストをする
  params.headers['Content-Type'] = 'application/json';

  // GETメソッド時以外の時はパラメータをbodyに貼り付ける
  if(params.method!='GET'){
    params.body = JSON.stringify(data);
  }
  // APIにリクエストを送ってレスポンスをもらう
  let response = await fetch(url, params)
  return response
}

const getCookie =(key:string)=>{
  /**
   * クライアントかサーバーそれぞれでの実行環境に合わせてクッキーを取得する
   * @return { string|undefined }
  */

  // windowが使えればクライアント、そうでなければサーバー上でのクッキー取得
  const isClient = (typeof window !== 'undefined') 
  // クッキーを取得
  if(isClient) { 
    return getCookieOnClient(key)// 存在しなければundefined
  }else{
    const auth = getCookieOnServer().get(key)  // 存在しなければundefined
    return auth? auth.value: undefined
  }
}

export const useFetch = ()=> {

  const fetchLoginFlgFromFrontendServer:fetchLoginFlgReturnType =async()=>{
    /**
     * フロントエンドサーバーにリクエストを送って、ログイン状態を受け取る 
     * @return {httpStatus: number, statusText: string, data: {[key:string]: string[]}}
    */
  
    // フロントエンドサーバーにリクエストを送る
    try{
      const response = await fetchResponse(
        'api/login/check',
        { method:'GET', headers: {}, credentials: 'include',} 
      )
      return await response.json()
  
    } catch(error) {
      console.error(error);
      return { data: {loginFlg: false, message: '予期せぬエラーが発生しました'}}
    }
  }

  const fetchLoginFlgFromBackendServer:fetchLoginFlgReturnType =async()=>{
    /**
     * バックエンドサーバーにリクエストを送って、ログイン状態を受け取る 
     * @return {httpStatus: number, statusText: string, data: {[key:string]: string[]}}
    */
  
    // バックエンドサーバーにリクエストを送る
    try{
      const response = await fetchResponse(
        `${process.env.NEXT_PUBLIC_API_ORIGIN}/api/is_login`,
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

  const postToSignupApi:SignupReturnType =async(data: SignupParamsType)=>{
    /**
     * 外部APIのSignupパスにPOSTメソッドでリクエストを送る
     * @return {httpStatus: number, statusText: string, data: {[key:string]: string[]}}
    */
    
    // APIにリクエストを送る
    try{
      const response = await fetchResponse(
      `${process.env.NEXT_PUBLIC_API_ORIGIN}/api/signup/`,
      { method:'POST', headers: {}, credentials: 'include', },
      data)

      //jsonを解凍してリターン 
      let ret = await response.json()
      console.log(ret)
      return {
        httpStatus: response.status,
        statusText: response.statusText,
        data: ret
      }    
    } catch(error) {
      console.error('Undefind Error:', error);
      return { 
        // 汎用的なエラーレスポンスを返す
        httpStatus: 500,
        statusText: 'Internal Server Error',
        data: { message: '予期せぬエラーが発生しました' },
      };
    }
  }

  const postToLoginApi:LoginReturnType =async(data: LoginParamsType)=>{
    /**
     * 外部APIのloginパスにPOSTメソッドでリクエストを送る
     * @return {httpStatus: number, statusText: string, data: {[key:string]: string[]}}
    */
    
    // APIにリクエストを送る
    try{
      const response = await fetchResponse(
      `${process.env.NEXT_PUBLIC_API_ORIGIN}/api/login/`,
      { method:'POST', headers: {}, credentials: 'include', },
      data)

      //jsonを解凍してリターン 
      let ret = await response.json()
      console.log(ret)
      return {
        httpStatus: response.status,
        statusText: response.statusText,
        data: ret
      }    
    } catch(error) {
      console.error('Undefind Error:', error);
      return { 
        // 汎用的なエラーレスポンスを返す
        httpStatus: 500,
        statusText: 'Internal Server Error',
        data: { message: '予期せぬエラーが発生しました' },
      };
    }
  }

  return{
    fetchLoginFlgFromFrontendServer,
    fetchLoginFlgFromBackendServer,
    postToSignupApi,
    postToLoginApi
  }
}
