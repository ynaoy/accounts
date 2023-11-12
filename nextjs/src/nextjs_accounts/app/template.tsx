/**
 * コンポーネントをラップするテンプレート
 * 画面の遷移時に再レンダーされる
 */
import 'tailwindcss/tailwind.css'

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-slate-800 flex flex-col justify-center items-center h-screen w-screen">
      {children}
    </div>
  )
}
