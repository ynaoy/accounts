/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import SignupComponent from '../../components/SignupComponent'

// Next.jsのuseRouterモジュールのモック
let routerPushMock = jest.fn()
jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    useRouter: ()=> {return { push: routerPushMock }},
  })
)

//コンテキストのモック
let loginFlgMock = false
const setLoginFlgMock = jest.fn().mockReturnValue(true)
jest.mock('../../hooks/LoginFlgContext',
  ()=>({...jest.requireActual('../../hooks/LoginFlgContext'),
    useLoginFlgContext : ()=>loginFlgMock,
    useSetLoginFlgContext : ()=>setLoginFlgMock
  })
)

const signupToBackendServerMock = jest.fn().mockResolvedValue({ httpStatus: 201, statusText: "", data: {}})
//APIと通信するモジュールのモック
jest.mock('../../hooks/useFetch',
  ()=>({...jest.requireActual('../../hooks/useFetch'),
    useFetch: ()=>{
      return { signupToBackendServer : async()=>signupToBackendServerMock() }
    }
  })
)

describe('SignupComponent', ()=>{
  afterEach(() => {
    // モックのリセット
    jest.clearAllMocks()
    loginFlgMock = false
  });

  test(`ログイン時に、router.pushメソッドが呼び出されている`, async() => {
    // ログイン状態にしてレンダー
    loginFlgMock = true
    render(<SignupComponent/>);
    
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
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
    expect(signupToBackendServerMock).toHaveBeenCalled()
    //ログイン状態を変更する関数が呼び出されている
    expect(setLoginFlgMock).toHaveBeenCalled()
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  });

  test(`フォームにバリデーションが通らない入力をして、
        サブミットボタンをクリックした時にApiと通信されず、ログイン状態が変更されない`, async() => {
    //レンダー
    render(<SignupComponent/>);
  
    //ユーザーイベントの初期化
    const user = userEvent.setup();
  
    //フォームの要素を取得
    const userNameInput:HTMLInputElement = screen.getByLabelText('ユーザーネーム')//通常getByLabelTextではHTMLElement型を受け取るがここではinputノードを扱うため型を指定
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
    
    //バリデーションが表示されている
    expect(screen.getByText("ユーザーネームを入力してください")).toBeTruthy()
    expect(screen.getByText("メールアドレスを入力してください")).toBeTruthy()
    expect(screen.getByText("パスワードを入力してください")).toBeTruthy()

    //バリデーションが通らずにAPIと通信する関数が呼び出されていない
    expect(signupToBackendServerMock).not.toHaveBeenCalled()
    //ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  });

  test(`API側でバリデーションエラーがあった場合、
        バリデーション部分のUIが更新され、ログイン状態が変更されない`, async() => {
    
    signupToBackendServerMock.mockResolvedValue({ 
      httpStatus:409, 
      statusText:'conflict',
      data: {username:['無効なユーザーネームです'], email:['無効なメールアドレスです'],password: ['無効なパスワードです']}
    })
    //レンダー
    render(<SignupComponent/>);
  
    //ユーザーイベントの初期化
    const user = userEvent.setup();
  
    //フォームの要素を取得
    const userNameInput:HTMLInputElement = screen.getByLabelText('ユーザーネーム')//通常getByLabelTextではHTMLElement型を受け取るがここではinputノードを扱うため型を指定
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
    
    //APIから受け取ったバリデーションが表示されている
    expect(screen.getByText("無効なユーザーネームです")).toBeTruthy()
    expect(screen.getByText("無効なメールアドレスです")).toBeTruthy()
    expect(screen.getByText("無効なパスワードです")).toBeTruthy()

    //APIと通信する関数が呼び出されている
    expect(signupToBackendServerMock).toHaveBeenCalled()
    //ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  });
})