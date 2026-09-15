"use client"
import React, { useEffect, useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Compass, GalleryHorizontalEnd, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SignUpButton, UserButton, useUser, SignOutButton } from '@clerk/nextjs'

const Menuoptions = [
  { Title: 'Home', Icon: Search, path: '/' },
  { Title: 'Discover', Icon: Compass, path: '/discover' },
  { Title: 'Library', Icon: GalleryHorizontalEnd, path: '/library' },
]

function AppSidebar() {
  const path = usePathname()
  const { user } = useUser()
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Trigger animation after first render
    setTimeout(() => setAnimate(true), 50)
  }, [])

  return (
    <div className={animate ? "animate-fade-in" : ""}> {/* 👈 animation wrapper */}
      <Sidebar>
        <SidebarHeader className='bg-accent flex items-center py-5 animate-scale-in'>
          <p className='text-black-200 text-2xl'>Askify</p>
          <Image src={'/logo3.png'} alt='logo' width={100} height={100} />
        </SidebarHeader>

        <SidebarContent className='bg-accent animate-fade-in'>
          <SidebarGroup>
            <SidebarContent>
              <SidebarMenu>
                {Menuoptions.map((menu, index) => (
                  <SidebarMenuItem
                    key={index}
                    className={`animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }} // 👈 staggered
                  >
                    <SidebarMenuButton
                      asChild
                      className={`px-5 py-6 hover:bg-transparent hover:font-bold 
                        ${path.includes(menu.path) ? 'font-bold' : ''}`}
                    >
                      <a
                        href={menu.path}
                        className="flex items-center gap-3 whitespace-normal break-words"
                      >
                        <menu.Icon className="h-7 w-8" />
                        <span className="text-lg">{menu.Title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>

              {!user ? (
                <SignUpButton mode='modal'>
                  <Button className='bg-gradient-to-br from-purple-900 to-indigo-800 rounded-full animate-scale-in'>Sign Up</Button>
                </SignUpButton>
              ) : (
                <SignOutButton>
                  <Button className='bg-gradient-to-br from-purple-900 to-indigo-800 rounded-full animate-scale-in'>Logout</Button>
                </SignOutButton>
              )}
            </SidebarContent>
          </SidebarGroup>

          <SidebarGroup />
        </SidebarContent>

        <div className='bg-accent p-3 flex flex-col animate-fade-in'>
          <h2 className='text-green-400'>Try Now</h2>
          <p className='text-black-300'>Upgrade for your image upload Smart Ai & more copilot</p>
          <Button variant={'secondary'} className={'bg-gradient-to-br from-purple-900 to-indigo-800 text-black-500 mb-3 animate-scale-in'}>Learn More</Button>

          <div className="flex justify-center items-center mt-4 animate-scale-in">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-12 h-12",
                },
              }}
            />
          </div>
        </div>

        <SidebarFooter />

        {/* ✨ Animation Styles */}
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scale-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
          .animate-scale-in {
            animation: scale-in 0.3s ease-out forwards;
          }
        `}</style>
      </Sidebar>
    </div>
  )
}

export default AppSidebar
