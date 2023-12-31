import { NavLink } from 'react-router-dom'
import { AccountSvg } from '/assets/img/SettingSvg'
import { buttonVariants } from "@/components/ui/button"

export default function({ items }) {
   return(
      <nav className="flex-shrink-0 w-full flex lg:flex-col lg:w-[13%] items-stretch gap-1">
         {
            items.map((item) => (
               <NavLink 
                  to={item.to}
                  key={item.title}
                  end
                  className={
                     ({isActive}) => 
                        [
                           isActive ? "bg-muted hover:bg-muted":"hover:bg-transparent hover:underline",
                           buttonVariants({variant: "ghost"}).replace("justify-center",""),
                           "justify-start"
                        ].join(" ")
                  }
               >
                  {item.title}
               </NavLink>
            ))
         }
      </nav>
   )
}
