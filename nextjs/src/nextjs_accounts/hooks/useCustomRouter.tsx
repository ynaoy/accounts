import { useRouter } from 'next/navigation';

export const useCustomRouter = () => {
  const router = useRouter()

  const redirectToIndexPage = ()=>{
    // indexページにリダイレクト
    router.push("/")
  }

  const redirectToSignupPage = ()=>{
    // signupページにリダイレクト
    router.push("/signup")
  }

  const redirectToLoginPage = ()=>{
    // loginページにリダイレクト
    router.push("/login")
  }

  const redirectToUpdatePage = ()=>{
    // updateページにリダイレクト
    router.push("/update")
  }

  const redirectToDestroyPage = ()=>{
    // destroyページにリダイレクト
    router.push("/destroy")
  }

  return {
    router,
    redirectToIndexPage,
    redirectToSignupPage,
    redirectToLoginPage,
    redirectToUpdatePage,
    redirectToDestroyPage
  }
}