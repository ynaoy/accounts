/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { useFetch } from '../../hooks/useFetch';

describe('useFetch', () => {
  beforeEach(() => {
    // モックのリセット
    global.fetch = jest.fn()
  });

  afterEach(() => {
    // テスト後のクリーンアップ
    jest.restoreAllMocks();
  })

  test('fetchLoginFlgメソッドでリクエストに成功した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ loginFlg: true }),
      })
    )
    // useFetchの初期化
    const { result } = renderHook(() => useFetch());

    // fetchLoginFlgを実行して結果をテスト
    let response = await result.current.fetchLoginFlg()
    expect(response).toEqual({ loginFlg: true })
  })

  test('fetchLoginFlgメソッドでリクエストに失敗した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ loginFlg: false }),
      })
    )
    // useFetchの初期化
    const { result } = renderHook(() => useFetch());

    // fetchLoginFlgを実行して結果をテスト
    let response = await result.current.fetchLoginFlg()
    expect(response).toEqual({ loginFlg: false })
  })

  test('postToSignupApiでリクエストに成功した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 201,
        statusText: 'OK',
        json: () => Promise.resolve({ message: 'Success' }),
      })
    );
    // useFetchの初期化
    const { result } = renderHook(() => useFetch());

    // postToSignupApiを実行して結果をテスト
    let response = await result.current.postToSignupApi({ username: 'test', 
                                                          email:'testemail@examplecom', 
                                                          password: 'password' })
    expect(response).toEqual({ httpStatus: 201, statusText: 'OK', data: { message: 'Success' } })
  })

  test('postToSignupApiでリクエストに失敗した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })
    )
    // useFetchの初期化
    const { result } = renderHook(() => useFetch())

    // postToSignupApiを実行して結果をテスト
    let response = await result.current.postToSignupApi({ username: '', email:'', password: '' })
    expect(response).toEqual({ httpStatus: 500, 
                               statusText: 'Internal Server Error', 
                               data: { message: '予期せぬエラーが発生しました' }})
  })
})
