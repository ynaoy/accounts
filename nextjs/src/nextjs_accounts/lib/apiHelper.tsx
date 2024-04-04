import {fetchLoginFlgReturn,fetchParams} from './types/apiHelper.d'
import { getCookie } from 'cookies-next';

export const fetchResponseFromApi = async(
  url:string, 
  params:fetchParams, 
  data: Record<string, unknown> = {}
) =>{

  // クッキーを取得
  const auth = getCookie('Authorization'); // 存在しなければundefined
  if(auth!=undefined){
    params.headers['Authorization'] = auth
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

export const fetchLoginFlg:fetchLoginFlgReturn =async()=>{
  /**
   * @return {boolean} - ログイン状態を返す
   */

  // APIにリクエストを送る
  try{
    const response = await fetchResponseFromApi(`${process.env.NEXT_PUBLIC_API_ORIGIN}/api/is_login`,
    { method:'GET',
      headers: {},
      credentials: 'include',
    })
    return response.json()
  
  } catch(error) {
    console.error(error);
    return {loginFlg: false}
  }
}