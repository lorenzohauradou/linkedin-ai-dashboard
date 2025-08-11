"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter
} from "../ui/sidebar"
import { PenTool, Brain, FileText, Settings } from 'lucide-react'
import Image from "next/image"

const navigationItems = [
  {
    title: "Post Generator",
    icon: PenTool,
    isActive: false
  },
  {
    title: "Generated Posts",
    icon: FileText,
    isActive: true
  }
]

const toolsItems = [
  {
    title: "Content Brain",
    icon: Brain,
    isActive: false
  },
]

export function LinkedInSidebar() {
  return (
    <Sidebar variant="floating" className="">
      <SidebarHeader className="p-6 border-b border-gray-100/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
            <Image src="/icons/logoicon.png" alt="LinkedIn AI Agent" width={28} height={28} />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">Vibe Scaling</h1>
            <p className="text-xs text-gray-500">AI Agent</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 py-3 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    className="text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500 data-[active=true]:to-blue-600 data-[active=true]:text-white data-[active=true]:font-semibold data-[active=true]:shadow-lg rounded-xl transition-all duration-200 py-3 px-4"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 py-3 mb-2">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    className="text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500 data-[active=true]:to-blue-600 data-[active=true]:text-white data-[active=true]:font-semibold data-[active=true]:shadow-lg rounded-xl transition-all duration-200 py-3 px-4"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-100/50 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-gray-600 hover:bg-gray-50 hover:text-gray-700 rounded-xl transition-all duration-200 py-3 px-4">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
