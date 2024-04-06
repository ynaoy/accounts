/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
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

  test(`フォームにバリデーションが通る入力をして、
        サブミットボタンをクリックした時にApiと通信し、ログイン状態が変更される`, async() => {
    //レンダー
    render(<SignupComponent/>);

    //ユーザーイベントの初期化
    const user = userEvent.setup();

    //フォームの要素を取得
    const userNameInput:HTMLInputElement = screen.getByLabelText('ユーザーネーム')
    const emailInput:HTMLInputElement = screen.getByLabelText('メールアドレス')
    const passwordInput:HTMLInputElement = screen.getByLabelText('パスワード')
    //フォームにバリデーションが通る値を入力
    await userEvent.type(userNameInput, "Test User");
    await userEvent.type(emailInput, "example@example.com");
    await userEvent.type(passwordInput, "password");

    //フォームに値が入力されていることを確認
    expect(userNameInput.value).toBe("Test User")
    expect(emailInput.value).toBe("example@example.com")
    expect(passwordInput.value).toBe("password")

    //サブミットボタンが存在する
    const button = screen.getByRole('button', {name: '登録'})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    
    //APIと通信する関数が呼び出されている
    expect(postToSignupApiMock).toHaveBeenCalled()
    //ログイン状態を変更する関数が呼び出されている
    expect(setLoginFlgMock).toHaveBeenCalled()
  });

  test(`フォームにバリデーションが通らない入力をして、
        サブミットボタンをクリックした時にApiと通信されず、ログイン状態が変更されない`, async() => {
    //レンダー
    render(<SignupComponent/>);
  
    //ユーザーイベントの初期化
    const user = userEvent.setup();
  
    //フォームの要素を取得
    const userNameInput:HTMLInputElement = screen.getByLabelText('ユーザーネーム')//通常getByRoleではHTMLElement型を受け取るがここではinputノードを扱うため型を指定
    const emailInput:HTMLInputElement = screen.getByLabelText('メールアドレス')
    const passwordInput:HTMLInputElement = screen.getByLabelText('パスワード')

    //フォームの入力が空白であることを確認
    expect(userNameInput.value).toBe("")
    expect(emailInput.value).toBe("")
    expect(passwordInput.value).toBe("")

    //サブミットボタンが存在する
    const button = screen.getByRole('button', {name: '登録'})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    
    //バリデーションが通らずにAPIと通信する関数が呼び出されていない
    expect(postToSignupApiMock).not.toHaveBeenCalled()
    //ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
  });
})