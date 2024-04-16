export type fetchParamsType = {
  method: 'GET'|'POST'|'PATCH'|'DELETE',
  headers: {[key:string]:string},
  credentials?:RequestCredentials,
  body?:string,
}

type ApiReturnType = Promise<{ 
  httpStatus: number,
  statusText: string,
  data: {[key: string]: string[]}
}>

export type fetchLoginFlgReturnType = ()=> Promise<{loginFlg:boolean}>

export type postToSignupApiParamsType = {
  username: string;
  email: string;
  password: string;
}

export type postToSignupApiReturnType = (params:postToSignupApiParamsType)=>
  ApiReturnType

export type postToLoginApiParamsType = {
  email: string;
  password: string;
}

export type postToLoginApiReturnType = (params:postToLoginApiParamsType)=>
  ApiReturnType