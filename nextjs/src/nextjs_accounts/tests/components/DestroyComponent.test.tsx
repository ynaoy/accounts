/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import DestroyComponent from '../../components/DestroyComponent'

// Next.jsのuseRouterモジュールのモック
let routerPushMock = jest.fn()
jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    useRouter: ()=> {return { push: routerPushMock }},
  })
)

//コンテキストのモック
let loginFlgMock = true
const setLoginFlgMock = jest.fn().mockReturnValue(true)
jest.mock('../../hooks/LoginFlgContext',
  ()=>({...jest.requireActual('../../hooks/LoginFlgContext'),
    useLoginFlgContext : ()=>loginFlgMock,
    useSetLoginFlgContext : ()=>setLoginFlgMock
  })
)

//APIと通信するモジュールのモック
const destroyToFrontendServerMock = jest.fn().mockResolvedValue({ httpStatus: 200, statusText: "", data: {}})
const fetchUserIdFromFrontendServerMock = jest.fn().mockResolvedValue({ httpStatus: 200, 
                                                                        statusText: "", 
                                                                        data: {userId:1}})
jest.mock('../../hooks/useFetch',
  ()=>({...jest.requireActual('../../hooks/useFetch'),
    useFetch: ()=>{
      return { destroyToFrontendServer : async()=>destroyToFrontendServerMock(),
               fetchUserIdFromFrontendServer: async()=>fetchUserIdFromFrontendServerMock()
       }
    }
  })
)

describe('DestroyComponent', ()=>{
  afterEach(() => {
    // モックのリセット
    jest.clearAllMocks()
    loginFlgMock = true
  });

  test(`非ログイン時に、router.pushメソッドが呼び出されている`, async() => {
    // ログイン状態にしてレンダー
    loginFlgMock = false
    render(<DestroyComponent/>);
    
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  });

  test(`サーバーからユーザーIDの取得に失敗した時に、destroyToFrontendServerメソッドが呼び出されていない`, async() => {
    // ユーザーIdを不正な状態にしてレンダー
    fetchUserIdFromFrontendServerMock.mockResolvedValueOnce({ httpStatus: 200, 
                                                              statusText: "", 
                                                              data: {userId:-1}})
    render(<DestroyComponent/>);

    //ユーザーイベントの初期化
    const user = userEvent.setup();

    //フォームの要素を取得
    const passwordInput:HTMLInputElement = screen.getByLabelText('パスワード')
    //フォームにバリデーションが通る値を入力
    await userEvent.type(passwordInput, "password");

    //フォームに値が入力されていることを確認
    expect(passwordInput.value).toBe("password")

    //サブミットボタンが存在する
    const button = screen.getByRole('button', {name: '削除'})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    //passwordToFrontendServerメソッドが呼び出されていない
    expect(destroyToFrontendServerMock).not.toHaveBeenCalled()
  });

  test(`フォームにバリデーションが通る入力をして、
        サブミットボタンをクリックした時にApiと通信し、ログイン状態が変更される`, async() => {
    //レンダー
    render(<DestroyComponent/>);

    //ユーザーイベントの初期化
    const user = userEvent.setup();

    //フォームの要素を取得
    const passwordInput:HTMLInputElement = screen.getByLabelText('パスワード')
    //フォームにバリデーションが通る値を入力
    await userEvent.type(passwordInput, "password");

    //フォームに値が入力されていることを確認
    expect(passwordInput.value).toBe("password")

    //サブミットボタンが存在する
    const button = screen.getByRole('button', {name: '削除'})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    
    //APIと通信する関数が呼び出されている
    expect(destroyToFrontendServerMock).toHaveBeenCalled()
    //ログイン状態を変更する関数が呼び出されている
    expect(setLoginFlgMock).toHaveBeenCalled()
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  });

  test(`フォームにバリデーションが通らない入力をして、
        サブミットボタンをクリックした時にApiと通信されず、ログイン状態が変更されない`, async() => {
    //レンダー
    render(<DestroyComponent/>);
  
    //ユーザーイベントの初期化
    const user = userEvent.setup();
  
    //フォームの要素を取得
    const passwordInput:HTMLInputElement = screen.getByLabelText('パスワード')//通常getByLabelTextではHTMLElement型を受け取るがここではinputノードを扱うため型を指定

    //フォームの入力が空白であることを確認
    expect(passwordInput.value).toBe("")

    //サブミットボタンが存在する
    const button = screen.getByRole('button', {name: '削除'})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    
    //バリデーションが表示されている
    expect(screen.getByText("パスワードを入力してください")).toBeTruthy()

    //バリデーションが通らずにAPIと通信する関数が呼び出されていない
    expect(destroyToFrontendServerMock).not.toHaveBeenCalled()
    //ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  });

  test(`API側でバリデーションエラーがあった場合、
        バリデーション部分のUIが更新され、ログイン状態が変更されない`, async() => {
    
    destroyToFrontendServerMock.mockResolvedValue({ 
      httpStatus:401, 
      statusText:'unauthorized',
      data: {password:['パスワードが間違っています']}
    })
    //レンダー
    render(<DestroyComponent/>);
  
    //ユーザーイベントの初期化
    const user = userEvent.setup();
  
    //フォームの要素を取得
    const passwordInput:HTMLInputElement = screen.getByLabelText('パスワード')//通常getByLabelTextではHTMLElement型を受け取るがここではinputノードを扱うため型を指定
    
    //フォームにバリデーションが通る値を入力
    await userEvent.type(passwordInput, "password");

    //フォームに値が入力されていることを確認
    expect(passwordInput.value).toBe("password")

    //サブミットボタンが存在する
    const button = screen.getByRole('button', {name: '削除'})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    
    //APIから受け取ったバリデーションが表示されている
    expect(screen.getByText("パスワードが間違っています")).toBeTruthy()

    //APIと通信する関数が呼び出されている
    expect(destroyToFrontendServerMock).toHaveBeenCalled()
    //ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  });
})