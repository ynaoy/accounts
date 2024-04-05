import { render, screen, fireEvent} from '@testing-library/react';
import SignupComponent from '../../components/SignupComponent'
import { postToSignupApiParamsType } from '../../lib/types/apiHelper.d'

//コンテキストのモック
let loginFlgMock = false
let setLoginFlgMock = jest.fn(()=>{ loginFlgMock=!loginFlgMock })
jest.mock('../../hooks/LoginFlgContext',
  ()=>({...jest.requireActual('../../hooks/LoginFlgContext'),
        useLoginFlgContext : ()=>loginFlgMock,
        useSetLoginFlgContext : ()=>setLoginFlgMock
      }));

//APIと通信するモジュールのモック
let httpStatus = 201
let statusText = "success"
let data = {username:"user", email:"example@example.com", password:"password"}
let postToSignupApiMock = jest.fn(()=>{ return{ 
  httpStatus: httpStatus,
  statusText: statusText,
  data: data
 }})

jest.mock('../../lib/apiHelper',
  ()=>({...jest.requireActual('../../lib/apiHelper'),
        postToSignupApi : async(data:postToSignupApiParamsType)=>postToSignupApiMock(), 
      }));

describe('SignupComponent', ()=>{
  afterEach(() => {
    setLoginFlgMock.mockClear()
    postToSignupApiMock.mockClear()
    loginFlgMock = false
    httpStatus = 201
    statusText = "success"
    data = {username:"user", email:"example@example.com", password:"password"}
  });

  test('サブミットボタンをクリックした時にApiと通信し、ログイン状態が変更される', async() => {
    //レンダー
    render(<SignupComponent/>);

    //サブミットボタンが存在する
    const button = screen.getByRole('button', {name: '登録'})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await fireEvent.click(button)
    
    //postToSignupApi(params)が呼び出されている
    expect(postToSignupApiMock).toHaveBeenCalled()
    //setloginFlg(value)が呼び出されている
    expect(setLoginFlgMock).toHaveBeenCalled()
  });

})