/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import UpdateComponent from '../../components/UpdateComponent'

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
const updateToFrontendServerMock = jest.fn().mockResolvedValue({ httpStatus: 200, statusText: "", data: {}})
const fetchUserIdFromFrontendServerMock = jest.fn().mockResolvedValue({ httpStatus: 200, 
                                                                        statusText: "", 
                                                                        data: {userId:1}})
jest.mock('../../hooks/useFetch',
  ()=>({...jest.requireActual('../../hooks/useFetch'),
    useFetch: ()=>{
      return { updateToFrontendServer : async()=>updateToFrontendServerMock(),
               fetchUserIdFromFrontendServer: async()=>fetchUserIdFromFrontendServerMock()
       }
    }
  })
)

describe('UpdateComponent', ()=>{
  afterEach(() => {
    // モックのリセット
    jest.clearAllMocks()
    loginFlgMock = true
  });

  test(`非ログイン時に、router.pushメソッドが呼び出されている`, async() => {
    // ログイン状態にしてレンダー
    loginFlgMock = false
    render(<UpdateComponent/>);
    
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  });

  test(`サーバーからユーザーIDの取得に失敗した時に、updateToFrontendServerメソッドが呼び出されていいない`, async() => {
    // ユーザーIdを不正な状態にしてレンダー
    fetchUserIdFromFrontendServerMock.mockResolvedValueOnce({ httpStatus: 200, 
                                                              statusText: "", 
                                                              data: {userId:-1}})
    render(<UpdateComponent/>);

    //ユーザーイベントの初期化
    const user = userEvent.setup();

    //フォームの要素を取得
    const userNameInput:HTMLInputElement = screen.getByLabelText('ユーザーネーム')
    const emailInput:HTMLInputElement = screen.getByLabelText('メールアドレス')
    //フォームにバリデーションが通る値を入力
    await userEvent.type(userNameInput, "Test User");
    await userEvent.type(emailInput, "example@example.com");

    //フォームに値が入力されていることを確認
    expect(userNameInput.value).toBe("Test User")
    expect(emailInput.value).toBe("example@example.com")

    //サブミットボタンが存在する
    const button = screen.getByRole('button', {name: '更新'})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    //updateToFrontendServerメソッドが呼び出されていない
    expect(updateToFrontendServerMock).not.toHaveBeenCalled()
  });

  test(`フォームにバリデーションが通る入力をして、
        サブミットボタンをクリックした時にApiと通信し、ログイン状態が変更される`, async() => {
    //レンダー
    render(<UpdateComponent/>);

    //ユーザーイベントの初期化
    const user = userEvent.setup();

    //フォームの要素を取得
    const userNameInput:HTMLInputElement = screen.getByLabelText('ユーザーネーム')
    const emailInput:HTMLInputElement = screen.getByLabelText('メールアドレス')
    //フォームにバリデーションが通る値を入力
    await userEvent.type(userNameInput, "Test User");
    await userEvent.type(emailInput, "example@example.com");

    //フォームに値が入力されていることを確認
    expect(userNameInput.value).toBe("Test User")
    expect(emailInput.value).toBe("example@example.com")

    //サブミットボタンが存在する
    const button = screen.getByRole('button', {name: '更新'})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    
    //APIと通信する関数が呼び出されている
    expect(updateToFrontendServerMock).toHaveBeenCalled()
    //ログイン状態を変更する関数が呼び出されている
    expect(setLoginFlgMock).toHaveBeenCalled()
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  });

  test(`フォームにバリデーションが通らない入力をして、
        サブミットボタンをクリックした時にApiと通信されず、ログイン状態が変更されない`, async() => {
    //レンダー
    render(<UpdateComponent/>);
  
    //ユーザーイベントの初期化
    const user = userEvent.setup();
  
    //フォームの要素を取得
    const userNameInput:HTMLInputElement = screen.getByLabelText('ユーザーネーム')//通常getByLabelTextではHTMLElement型を受け取るがここではinputノードを扱うため型を指定
    const emailInput:HTMLInputElement = screen.getByLabelText('メールアドレス')

    //フォームの入力が空白であることを確認
    expect(userNameInput.value).toBe("")
    expect(emailInput.value).toBe("")

    //サブミットボタンが存在する
    const button = screen.getByRole('button', {name: '更新'})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    
    //バリデーションが表示されている
    expect(screen.getByText("ユーザーネームを入力してください")).toBeTruthy()
    expect(screen.getByText("メールアドレスを入力してください")).toBeTruthy()

    //バリデーションが通らずにAPIと通信する関数が呼び出されていない
    expect(updateToFrontendServerMock).not.toHaveBeenCalled()
    //ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  });

  test(`API側でバリデーションエラーがあった場合、
        バリデーション部分のUIが更新され、ログイン状態が変更されない`, async() => {
    
    updateToFrontendServerMock.mockResolvedValue({ 
      httpStatus:409, 
      statusText:'conflict',
      data: {username:['無効なユーザーネームです'], email:['無効なメールアドレスです']}
    })
    //レンダー
    render(<UpdateComponent/>);
  
    //ユーザーイベントの初期化
    const user = userEvent.setup();
  
    //フォームの要素を取得
    const userNameInput:HTMLInputElement = screen.getByLabelText('ユーザーネーム')//通常getByLabelTextではHTMLElement型を受け取るがここではinputノードを扱うため型を指定
    const emailInput:HTMLInputElement = screen.getByLabelText('メールアドレス')
    
    //フォームにバリデーションが通る値を入力
    await userEvent.type(userNameInput, "Test User");
    await userEvent.type(emailInput, "example@example.com");

    //フォームに値が入力されていることを確認
    expect(userNameInput.value).toBe("Test User")
    expect(emailInput.value).toBe("example@example.com")

    //サブミットボタンが存在する
    const button = screen.getByRole('button', {name: '更新'})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    
    //APIから受け取ったバリデーションが表示されている
    expect(screen.getByText("無効なユーザーネームです")).toBeTruthy()
    expect(screen.getByText("無効なメールアドレスです")).toBeTruthy()

    //APIと通信する関数が呼び出されている
    expect(updateToFrontendServerMock).toHaveBeenCalled()
    //ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  });
})