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
let postToSignupApiMock = jest.fn(()=>{ return{ loginFlg:!loginFlgMock }})
jest.mock('../../lib/apiHelper',
  ()=>({...jest.requireActual('../../lib/apiHelper'),
        postToSignupApi : (params:postToSignupApiParamsType)=>loginFlgMock, 
      }));

describe('SignupComponent', ()=>{
  afterEach(() => {
    setLoginFlgMock.mockClear()
    loginFlgMock = false
  });

  test('サブミットボタンをクリックした時にApiと通信し、ログイン状態が変更される', () => {
    //レンダー
    render(<SignupComponent/>);

    //サブミットボタンが存在する
    const button = screen.getByRole('button', {name: '登録'})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    fireEvent.click(button)
    
    //postToSignupApi(params)が呼び出されている
    expect(postToSignupApiMock).toHaveBeenCalled()
    //setloginFlg(value)が呼び出されている
    expect(setLoginFlgMock).toHaveBeenCalled()
  });

})