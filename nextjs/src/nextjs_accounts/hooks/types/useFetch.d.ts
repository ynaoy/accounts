export type fetchParamsType = {
  method: 'GET'|'POST'|'PATCH'|'DELETE',
  headers: {[key:string]:string},
  credentials?:RequestCredentials,
  body?:string,
}

type fetchReturnType = { 
  httpStatus: number,
  statusText: string,
  data: {[key: string]: string[]}
}

export type fetchLoginFlgReturnType = ()=> 
  Promise<{ httpStatus: number,
            statusText: string,
            data: { [key: string]: string, loginFlg:boolean } }>

export type signupParamsType = {
  username: string;
  email: string;
  password: string;
}

export type signupToFrontendServerReturnType = (params:signupParamsType)=>
  Promise<fetchReturnType>

export type signupToBackendServerReturnType = (params:signupParamsType)=>
  Promise<{ json:fetchReturnType,
            cookie?: string|null,
  }>

export type loginParamsType = {
  email: string;
  password: string;
}

export type loginToFrontendServerReturnType = (params:LoginParamsType)=>
  Promise<fetchReturnType>

export type loginToBackendServerReturnType = (params:LoginParamsType)=>
  Promise<{ json:fetchReturnType,
            cookie?: string|null,
  }>

export type updateParamsType = { 
  username: string;
  email: string;
}

export type updateToFrontendServerReturnType = (params: updateParamsType,userId: number)=>
  Promise<fetchReturnType>
  
export type updateToBackendServerReturnType = (params: updateParamsType,userId: number)=>
  Promise<{ json:fetchReturnType,
            cookie?: string|null,
  }>

export type fetchUserIdReturnType = ()=>
  Promise<{ httpStatus: number,
            statusText: string,
            data: { [key: string]: string, userId: number } }>