import { render, screen, fireEvent} from '@testing-library/react';
import SignupComponent from '../../components/SignupComponent'

//コンテキストのモック
let loginFlgMock = false
let setLoginFlgMock = jest.fn(()=>{ loginFlgMock=!loginFlgMock })
jest.mock('../../hooks/LoginFlgContext',
  ()=>({...jest.requireActual('../../hooks/LoginFlgContext'),
        useLoginFlgContext : ()=>loginFlgMock,
        useSetLoginFlgContext : ()=>setLoginFlgMock 
      }));

describe('SignupComponent', ()=>{
  afterEach(() => {
    setLoginFlgMock.mockClear()
    loginFlgMock = false
  });

  test('サブミットボタンをクリックした時にログイン状態が変更される', () => {
    //レンダー
    render(<SignupComponent/>);

    //サブミットボタンが存在する
    const button = screen.getByRole('button', {name: '登録'})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    fireEvent.click(button)
    
    //setloginFlg(value)が呼び出されている
    expect(setLoginFlgMock).toHaveBeenCalled()
  });

})