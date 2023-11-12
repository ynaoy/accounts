import { ColorButtonProps } from "./types/Button"
import BaseButton from "./BaseButton"

export default function OrangeButton({onClick = undefined, size="lg", children }:
                                    ColorButtonProps,
                                  ){
  let textsize:{[index:string]:string} = {'xs':'text-xs','sm':'text-sm', 'md':'text-md','lg':'text-lg'}
  let className=`relative inline-flex items-center justify-center p-0.5 
                 mb-2 mr-2 overflow-hidden ${textsize[size]} font-medium text-gray-900
                 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 
                 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white 
                 dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800`
  return(
    <BaseButton onClick={onClick} 
                size={size}
                className={className}>
      {children}
    </BaseButton>
  )
}