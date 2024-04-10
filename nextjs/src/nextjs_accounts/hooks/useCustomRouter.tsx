import { useRouter } from 'next/navigation';

export const useCustomRouter = () => {
  const router = useRouter()

  const redirectToIndexPage = ()=>{
    // indexページにリダイレクト
    router.push("/")
  }
  return {
    router,
    redirectToIndexPage,
  }
}