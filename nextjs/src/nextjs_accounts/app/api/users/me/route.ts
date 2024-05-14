"use server"

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { useFetchOnServer } from '../../../../hooks/useFetchOnServer';

export async function GET(req: NextRequest){
  // 外部APIと通信する関数を受け取る
  const { fetchUserIdFromBackendServer } = useFetchOnServer()
  // 外部APIからログイン状態を受け取る
  const jsonData = await fetchUserIdFromBackendServer()
  return NextResponse.json(jsonData)
}