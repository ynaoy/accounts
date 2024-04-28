/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { useLogin } from '../../hooks/useLogin'

// Next.jsのuseRouterモジュールのモック
let routerPushMock = jest.fn()
jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    useRouter: ()=> {return { push: routerPushMock }},
  })
)

//コンテキストのモック
const setLoginFlgMock = jest.fn().mockReturnValue(true)
jest.mock('../../hooks/LoginFlgContext',
  ()=>({...jest.requireActual('../../hooks/LoginFlgContext'),
    useLoginFlgContext : ()=>false,
    useSetLoginFlgContext : ()=>setLoginFlgMock
  })
)

const loginToFrontendServerMock = jest.fn().mockResolvedValue({ httpStatus: 200, statusText: "", data: {}})
//APIと通信するモジュールのモック
jest.mock('../../hooks/useFetch',
  ()=>({...jest.requireActual('../../hooks/useFetch'),
    useFetch: ()=>{
      return { loginToFrontendServer : async()=>loginToFrontendServerMock() }
    }
  })
)

describe('useLogin', () => {

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('バリデーションが通らない時に、処理が中断されている',async()=>{
    const { result } = renderHook(() => useLogin())
    // フォームに無効な値を入力してログイン処理
    await act(() => {
      result.current.formDispatch({ type: 'edited_email', email: '' });
      result.current.formDispatch({ type: 'edited_password', password: '' });
    })
    await act(() => {
      result.current.loginUser();
    })
    // バリデーションが更新されている
    expect(result.current.validationStates.emailValidations).toContain('メールアドレスを入力してください')
    expect(result.current.validationStates.passwordValidations).toContain('パスワードを入力してください')
    // バリデーションが通らずにAPIと通信する関数が呼び出されていない
    expect(loginToFrontendServerMock).not.toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  })

  test('ログインに成功した時、APIと通信され、ログイン状態が更新されて、rooter.pushメソッドが実行される',async()=>{
    const { result } = renderHook(() => useLogin())
    // フォームに妥当な値を入力してログイン処理
    await act(() => {
      result.current.formDispatch({ type: 'edited_email', email: 'testemail@example.com' });
      result.current.formDispatch({ type: 'edited_password', password: 'password' });
    })
    await act(() => {
      result.current.loginUser();
    })
    // APIと通信する関数が呼び出されている
    expect(loginToFrontendServerMock).toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されている
    expect(setLoginFlgMock).toHaveBeenCalled()
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  })

  test('APIから401エラーが帰ってきた時に、カスタムフックの持つバリデーションの値が更新される',async()=>{
    // APIから受け取る値を変更
    loginToFrontendServerMock.mockResolvedValue({ 
      httpStatus:401, 
      statusText:'',
      data: { password: ['パスワードが間違っています']}
    })
    const { result } = renderHook(() => useLogin())
    // フォームに妥当な値を入力してログイン処理
    await act(() => {
      result.current.formDispatch({ type: 'edited_email', email: 'testemail@example.com' });
      result.current.formDispatch({ type: 'edited_password', password: 'password' });
    })
    await act(() => {
      result.current.loginUser();
    })
    // バリデーションが更新されている
    expect(result.current.validationStates.passwordValidations).toContain('パスワードが間違っています')

    // APIと通信する関数が呼び出されている
    expect(loginToFrontendServerMock).toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  })

  test('APIから404エラーが返ってきた時に、カスタムフックの持つバリデーションの値が更新される',async()=>{
    // APIから受け取る値を変更
    loginToFrontendServerMock.mockResolvedValue({ 
      httpStatus:404, 
      statusText:'',
      data: { email: ['メールアドレスが間違っています']}
    })
    const { result } = renderHook(() => useLogin())
    // フォームに妥当な値を入力してログイン処理
    await act(() => {
      result.current.formDispatch({ type: 'edited_email', email: 'testemail@example.com' });
      result.current.formDispatch({ type: 'edited_password', password: 'password' });
    })
    await act(() => {
      result.current.loginUser();
    })
    // バリデーションが更新されている
    expect(result.current.validationStates.emailValidations).toContain('メールアドレスが間違っています')

    // APIと通信する関数が呼び出されている
    expect(loginToFrontendServerMock).toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  })
});