import { ButtonProps } from "./types/Button"

export default function BaseButton({ onClick = undefined, className, size="lg", children }:
                                    ButtonProps
                                  ){
  const contentsize:{[index:string]:string} = 
    {'xs':'px-5 py-3', 'sm':'px-10 py-4', 'md':'px-15 py-3', 'lg':'px-20 py-3' }
  return(
    <button onClick={onClick}
      className={className}>
      <span className={`relative ${contentsize[size]} transition-all ease-in duration-75 bg-white dark:bg-gray-900 
                      rounded-md group-hover:bg-opacity-0`}>
        { children }
      </span>
    </button>
)}