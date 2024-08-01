"use server"

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers'

export async function DELETE(req: NextRequest){
  let json
  const cookieStore = cookies()
  // ログイン情報を削除する
  if((cookieStore.has('Authorization'))&&(cookieStore.has('refresh'))){
    cookieStore.delete('Authorization')
    cookieStore.delete('refresh')
    json = { httpStatus: 200, statusText: 'Success'}
  }else{
    json ={ httpStatus:401, statusText: 'UnAuthorized'}
  }
  // クッキーとjsonオブジェクトをレスポンスにセットして返す
  const response = NextResponse.json(json)
  return response
}