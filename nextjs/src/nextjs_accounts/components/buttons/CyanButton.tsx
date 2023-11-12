import { ColorButtonProps } from "./types/Button"
import BaseButton from "./BaseButton"

export default function CyanButton({onClick = undefined, size="lg", children }:
                                    ColorButtonProps,
                                  ){
  let textsize:{[index:string]:string} = {'xs':'text-xs','sm':'text-sm', 'md':'text-md','lg':'text-lg'}
  let className=`relative inline-flex items-center justify-center p-0.5
                 mb-2 mr-2 overflow-hidden ${textsize[size]} font-medium text-gray-900 
                 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 
                 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white
                 dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800`
  return(
    <BaseButton onClick={onClick} 
                size={size}
                className={className}>
      {children}
    </BaseButton>
  )
}