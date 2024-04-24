export type fetchParamsType = {
  method: 'GET'|'POST'|'PATCH'|'DELETE',
  headers: {[key:string]:string},
  credentials?:RequestCredentials,
  body?:string,
}

type fetchReturnType = Promise<{ 
  httpStatus: number,
  statusText: string,
  data: {[key: string]: string[]}
}>

export type fetchLoginFlgReturnType = ()=> fetchReturnType

export type SignupParamsType = {
  username: string;
  email: string;
  password: string;
}

export type SignupReturnType = (params:postToSignupApiParamsType)=>
  fetchReturnType

export type LoginParamsType = {
  email: string;
  password: string;
}

export type LoginReturnType = (params:postToLoginApiParamsType)=>
  fetchReturnType