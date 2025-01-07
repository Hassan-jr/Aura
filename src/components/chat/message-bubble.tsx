// import { cn } from "@/lib/utils"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Message } from "./types"

// export function MessageBubble({ message }: { message: Message }) {
//   const isUser = message.role === 'user'
//   return (
//     <div className={cn(
//       "flex items-end mb-4",
//       isUser ? "justify-end" : "justify-start"
//     )}>
//       <div className={cn(
//         "flex items-end max-w-[80%]",
//         isUser ? "flex-row-reverse" : "flex-row"
//       )}>
//         <Avatar className="w-8 h-8">
//           <AvatarFallback>{isUser ? 'U' : 'AI'}</AvatarFallback>
//         </Avatar>
//         <div className={cn(
//           "mx-2 p-3 rounded-lg",
//           isUser ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700",
//           "transition-all duration-300 ease-in-out",
//           "animate-fade-in"
//         )}>
//           {message.content}
//         </div>
//       </div>
//     </div>
//   )
// }

// export function LoadingBubble() {
//   return (
//     <div className="flex items-end mb-4 justify-start">
//       <div className="flex items-end max-w-[80%] flex-row">
//         <Avatar className="w-8 h-8">
//           <AvatarFallback>AI</AvatarFallback>
//         </Avatar>
//         <div className="mx-2 p-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse">
//           <span className="inline-flex gap-1">
//             <span className="animate-bounce">.</span>
//             <span className="animate-bounce animation-delay-200">.</span>
//             <span className="animate-bounce animation-delay-400">.</span>
//           </span>
//         </div>
//       </div>
//     </div>
//   )
// }


import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Message } from "./types"

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={cn(
      "flex items-end mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex items-end max-w-[80%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <Avatar className="w-8 h-8">
          <AvatarFallback>{isUser ? 'U' : 'AI'}</AvatarFallback>
        </Avatar>
        <div className={cn(
          "mx-2 p-3 rounded-lg",
          isUser ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700",
          "transition-all duration-300 ease-in-out",
          "animate-fade-in"
        )}>
          {message.content}
        </div>
      </div>
    </div>
  )
}

export function LoadingBubble() {
  return (
    <div className="flex items-end mb-4 justify-start">
      <div className="flex items-end max-w-[80%] flex-row">
        <Avatar className="w-8 h-8">
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div className="mx-2 p-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse">
          <span className="inline-flex gap-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce animation-delay-200">.</span>
            <span className="animate-bounce animation-delay-400">.</span>
          </span>
        </div>
      </div>
    </div>
  )
}

