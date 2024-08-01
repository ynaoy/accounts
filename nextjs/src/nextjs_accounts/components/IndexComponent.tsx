import { useLoginFlgContext } from '../hooks/LoginFlgContext';
import { useCustomRouter } from '../hooks/useCustomRouter'
import { useLogout } from '../hooks/useLogout';
import OrangeButton from './buttons/OrangeButton';
import BlueButton from './buttons/BlueButton';
import CyanButton from './buttons/CyanButton';
import GreenButton from './buttons/GreenButton'
import RedButton from './buttons/RedButton'

export default function IndexComponent(){
  const loginFlg = useLoginFlgContext();
  const { redirectToSignupPage, redirectToLoginPage, redirectToUpdatePage, redirectToDestroyPage } = useCustomRouter()
  const { logoutUser } = useLogout()
  return (
    <div className="flex flex-col justify-center items-center">
      {loginFlg?(
      <>
        <OrangeButton size="lg" onClick={()=>redirectToUpdatePage()}>
          ユーザー更新
        </OrangeButton>
        <GreenButton size="lg" onClick={()=>redirectToDestroyPage()}>
          ユーザー削除
        </GreenButton>
        <RedButton size="lg" onClick={()=>logoutUser()}>
          ログアウト
        </RedButton>
      </>
      ):(
      <>
        <BlueButton size="lg"  onClick={()=>redirectToSignupPage()}>
          ユーザー登録
        </BlueButton>
        
        <CyanButton size="lg" onClick={()=>redirectToLoginPage()}>
          ログイン
        </CyanButton>
      </>)
      }
    </div>
    )
}
