import { ColorButtonProps } from "./types/Button"
import BaseButton from "./BaseButton"

export default function BlueButton({onClick = undefined, size="lg", children }:
                                    ColorButtonProps,
                                  ){
  let textsize:{[index:string]:string} = {'xs':'text-xs','sm':'text-sm', 'md':'text-md','lg':'text-lg'}
  let className=`relative inline-flex items-center justify-center p-0.5 
                 mb-2 mr-2 overflow-hidden ${textsize[size]} font-medium text-gray-900 
                 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 
                 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white 
                 dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800`
  return(
    <BaseButton onClick={onClick} 
                size={size}
                className={className}>
      {children}
    </BaseButton>
  )
}