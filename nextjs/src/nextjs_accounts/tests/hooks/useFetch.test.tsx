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

  test('fetchLoginFlgFromFrontendServerメソッドでリクエストに成功した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ httpStatus:200, statusText:"ok", data: {loginFlg: true} }),
      })
    )
    // useFetchの初期化
    const { result } = renderHook(() => useFetch());

    // fetchLoginFlgFromFrontendServerを実行して結果をテスト
    let response = await result.current.fetchLoginFlgFromFrontendServer()
    expect(response).toEqual({ httpStatus:200, statusText:"ok", data: {loginFlg: true} })
  })

  test('fetchLoginFlgFromFrontendServerメソッドでリクエストに失敗した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    )
    // useFetchの初期化
    const { result } = renderHook(() => useFetch());

    // ffetchLoginFlgFromFrontendServerを実行して結果をテスト
    let response = await result.current.fetchLoginFlgFromFrontendServer()
    expect(response).toEqual({ data: {loginFlg: false, message: '予期せぬエラーが発生しました'}})
  })

  test('signupToFrontendServerでリクエストに成功した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 201,
        statusText: 'OK',
        json: () => Promise.resolve({httpStatus: 201, statusText: 'OK', data: { message: 'Success' }}),
      })
    );
    // useFetchの初期化
    const { result } = renderHook(() => useFetch());

    // signupToFrontendServerを実行して結果をテスト
    let response = await result.current.signupToFrontendServer({username: 'test', 
                                                                email:'testemail@examplecom', 
                                                                password: 'password' })
    expect(response).toEqual({ httpStatus: 201, statusText: 'OK', data: { message: 'Success' } })
  })

  test('signupToFrontendServerでリクエストに失敗した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        httpStatus: 500,
        statusText: 'Internal Server Error',
      })
    )
    // useFetchの初期化
    const { result } = renderHook(() => useFetch())

    // signupToFrontendServerを実行して結果をテスト
    let response = await result.current.signupToFrontendServer({ username: '', email:'', password: '' })
    expect(response).toEqual({ httpStatus: 500, 
                               statusText: 'Internal Server Error', 
                               data: { message: '予期せぬエラーが発生しました' }})
  })

  test('loginToFrontendServerでリクエストに成功した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve({
          httpStatus: 200, 
          statusText: 'OK', 
          data: { message: 'Success' }}),
      })
    );
    // useFetchの初期化
    const { result } = renderHook(() => useFetch());

    // loginToFrontendServerを実行して結果をテスト
    let response = await result.current.loginToFrontendServer({ email:'testemail@examplecom', 
                                                               password: 'password' })
    expect(response).toEqual({ httpStatus: 200, statusText: 'OK', data: { message: 'Success' } })
  })

  test('loginToFrontendServerでリクエストに失敗した際に、適切なオブジェクトが返されている', async () => {
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

    // loginToFrontendServerを実行して結果をテスト
    let response = await result.current.loginToFrontendServer({ email:'', password: '' })
    expect(response).toEqual({ httpStatus: 500, 
                               statusText: 'Internal Server Error', 
                               data: { message: '予期せぬエラーが発生しました' }})
  })

  test('updateToFrontendServerでリクエストに成功した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve({
          httpStatus: 200, 
          statusText: 'OK', 
          data: { message: 'Success' }}),
      })
    );
    // useFetchの初期化
    const { result } = renderHook(() => useFetch());

    // updateToFrontendServerを実行して結果をテスト
    let response = await result.current.updateToFrontendServer({username:'testm', 
                                                                email:'testemail@examplecom' },
                                                                1)
    expect(response).toEqual({ httpStatus: 200, statusText: 'OK', data: { message: 'Success' } })
  })

  test('updateToFrontendServerでリクエストに失敗した際に、適切なオブジェクトが返されている', async () => {
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

    // updateToFrontendServerを実行して結果をテスト
    let response = await result.current.updateToFrontendServer({ username:'', email: '' },1)
    expect(response).toEqual({ httpStatus: 500, 
                               statusText: 'Internal Server Error', 
                               data: { message: '予期せぬエラーが発生しました' }})
  })

  test('fetchUserIdFromFrontendServerでリクエストに成功した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve({
          httpStatus: 200, 
          statusText: 'OK', 
          data: { message: 'Success',userId: 0, }}),
      })
    );
    // useFetchの初期化
    const { result } = renderHook(() => useFetch());

    // fetchUserIdFromFrontendServerを実行して結果をテスト
    let response = await result.current.fetchUserIdFromFrontendServer()
    expect(response).toEqual({ httpStatus: 200, statusText: 'OK', data: { userId:0, message: 'Success', } })
  })

  test('fetchUserIdFromFrontendServerでリクエストに失敗した際に、適切なオブジェクトが返されている', async () => {
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

    // fetchUserIdFromFrontendServerを実行して結果をテスト
    let response = await result.current.fetchUserIdFromFrontendServer()
    expect(response).toEqual({ httpStatus: 500, 
                               statusText: 'Internal Server Error', 
                               data: {userId:-1, message: '予期せぬエラーが発生しました' }})
  })
})
