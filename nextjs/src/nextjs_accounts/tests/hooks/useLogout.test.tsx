/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { useLogout } from '../../hooks/useLogout'

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

const logoutToFrontendServerMock = jest.fn().mockResolvedValue({ httpStatus: 200, statusText: "" })
//APIと通信するモジュールのモック
jest.mock('../../hooks/useFetch',
  ()=>({...jest.requireActual('../../hooks/useFetch'),
    useFetch: ()=>{
      return { logoutToFrontendServer : async()=>logoutToFrontendServerMock() }
    }
  })
)

describe('useLogout', () => {

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('ログアウトに成功した時、APIと通信され、ログイン状態が更新されて、rooter.pushメソッドが実行される',async()=>{
    const { result } = renderHook(() => useLogout())
    // ログアウト処理
    await act(() => {
      result.current.logoutUser();
    })
    // APIと通信する関数が呼び出されている
    expect(logoutToFrontendServerMock).toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されている
    expect(setLoginFlgMock).toHaveBeenCalled()
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  })

  test('APIから401エラーが帰ってきた時に、カスタムフックの持つバリデーションの値が更新される',async()=>{
    // APIから受け取る値を変更
    logoutToFrontendServerMock.mockResolvedValue({ 
      httpStatus:401, 
      statusText:''
    })
    const { result } = renderHook(() => useLogout())
    // フォームに妥当な値を入力してログアウト処理
    await act(() => {
      result.current.logoutUser();
    })
    // APIと通信する関数が呼び出されている
    expect(logoutToFrontendServerMock).toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  })
});