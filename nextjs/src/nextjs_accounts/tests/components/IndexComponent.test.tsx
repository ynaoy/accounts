/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IndexComponent from "../../components/IndexComponent"

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
jest.mock("../../hooks/LoginFlgContext",
  ()=>({...jest.requireActual("../../hooks/LoginFlgContext"),
    useLoginFlgContext : ()=>loginFlgMock,
    useSetLoginFlgContext : ()=>setLoginFlgMock
  })
)

describe("IndexComponent", ()=>{
  afterEach(() => {
    // モックのリセット
    jest.clearAllMocks()
    loginFlgMock = false
  });


  test(`ログアウト時にユーザー登録ボタンが存在し、クリックイベントでリダイレクトが起こる`, async() => {
    //レンダー
    render(<IndexComponent/>);

    //ユーザーイベントの初期化
    const user = userEvent.setup();

    //ユーザー登録ボタンが存在する
    const button = screen.getByRole("button", {name: "ユーザー登録"})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  });

  test(`ログアウト時にログインボタンが存在し、クリックイベントでリダイレクトが起こる`, async() => {
    //レンダー
    render(<IndexComponent/>);

    //ユーザーイベントの初期化
    const user = userEvent.setup();

    //ユーザー登録ボタンが存在する
    const button = screen.getByRole("button", {name: "ログイン"})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  });

  test(`ログイン時にユーザー更新ボタンが存在し、クリックイベントでリダイレクトが起こる`, async() => {
    // ログイン状態でレンダー
    loginFlgMock = true
    render(<IndexComponent/>);

    //ユーザーイベントの初期化
    const user = userEvent.setup();

    //ユーザー更新ボタンが存在する
    const button = screen.getByRole("button", {name: "ユーザー更新"})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  });

  test(`ログイン時にユーザー削除ボタンが存在し、クリックイベントでリダイレクトが起こる`, async() => {
    // ログイン状態でレンダー
    loginFlgMock = true
    render(<IndexComponent/>);

    //ユーザーイベントの初期化
    const user = userEvent.setup();

    //ユーザー削除ボタンが存在する
    const button = screen.getByRole("button", {name: "ユーザー削除"})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  });

  //ログアウト機能がまだ未実装なのでスキップ
  test.skip(`ログイン時にログアウトボタンが存在し、クリックイベントでリダイレクトが起こる`, async() => {
    // ログイン状態でレンダー
    loginFlgMock = true
    render(<IndexComponent/>);

    //ユーザーイベントの初期化
    const user = userEvent.setup();

    //ユーザー更新ボタンが存在する
    const button = screen.getByRole("button", {name: "ログアウト"})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    await user.click(button)
    
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  });
})