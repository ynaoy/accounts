/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { useSignup } from '../../hooks/useSignup'

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

const signupToBackendServerMock = jest.fn().mockResolvedValue({ httpStatus: 201, statusText: "", data: {}})
//APIと通信するモジュールのモック
jest.mock('../../hooks/useFetch',
  ()=>({...jest.requireActual('../../hooks/useFetch'),
    useFetch: ()=>{
      return { signupToBackendServer : async()=>signupToBackendServerMock() }
    }
  })
)

describe('useSignup', () => {

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('バリデーションが通らない時に、処理が中断されている',async()=>{
    const { result } = renderHook(() => useSignup())
    // フォームに無効な値を入力して、ユーザー登録
    await act(() => {
      result.current.formDispatch({ type: 'edited_userName', userName: '' });
      result.current.formDispatch({ type: 'edited_email', email: '' });
      result.current.formDispatch({ type: 'edited_password', password: '' });
    })
    await act(() => {
      result.current.registerUser();
    })
    // バリデーションが更新されている
    expect(result.current.validationStates.userNameValidations).toContain('ユーザーネームを入力してください')
    expect(result.current.validationStates.emailValidations).toContain('メールアドレスを入力してください')
    expect(result.current.validationStates.passwordValidations).toContain('パスワードを入力してください')
    // バリデーションが通らずにAPIと通信する関数が呼び出されていない
    expect(signupToBackendServerMock).not.toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  })

  test('ユーザー登録に成功した時、APIと通信され、ログイン状態が更新されて、rooter.pushメソッドが実行される',async()=>{
    const { result } = renderHook(() => useSignup())
    // フォームに妥当な値を入力して、ユーザー登録
    await act(() => {
      result.current.formDispatch({ type: 'edited_userName', userName: 'TestUser' });
      result.current.formDispatch({ type: 'edited_email', email: 'testemail@example.com' });
      result.current.formDispatch({ type: 'edited_password', password: 'password' });
    })
    await act(() => {
      result.current.registerUser();
    })
    // APIと通信する関数が呼び出されている
    expect(signupToBackendServerMock).toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されている
    expect(setLoginFlgMock).toHaveBeenCalled()
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  })

  test('APIでバリデーションに関するエラーが起こった時に、カスタムフックの持つバリデーションの値が更新される',async()=>{
    // APIから受け取る値を変更
    signupToBackendServerMock.mockResolvedValue({ 
      httpStatus:409, 
      statusText:'conflict',
      data: {username:['無効なユーザーネームです'], email:['無効なメールアドレスです'],password: ['無効なパスワードです']}
    })
    const { result } = renderHook(() => useSignup())
    // フォームに妥当な値を入力して、ユーザー登録
    await act(() => {
      result.current.formDispatch({ type: 'edited_userName', userName: 'TestUser' });
      result.current.formDispatch({ type: 'edited_email', email: 'testemail@example.com' });
      result.current.formDispatch({ type: 'edited_password', password: 'password' });
    })
    await act(() => {
      result.current.registerUser();
    })
    // バリデーションが更新されている
    expect(result.current.validationStates.userNameValidations).toContain('無効なユーザーネームです')
    expect(result.current.validationStates.emailValidations).toContain('無効なメールアドレスです')
    expect(result.current.validationStates.passwordValidations).toContain('無効なパスワードです')

    // APIと通信する関数が呼び出されている
    expect(signupToBackendServerMock).toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  })
});