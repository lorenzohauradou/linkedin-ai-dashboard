"use client"

import { LinkedInSidebar } from "./linkedin-sidebar"
import { PostPreview } from "./post-preview"
import { PostCreator } from "./post-creator"
import { SidebarProvider } from "../ui/sidebar"

export function LinkedInDashboard() {

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarProvider defaultOpen={true}>
        <div className="flex-1 flex">
          <LinkedInSidebar />
          <div className="flex-1 flex justify-center p-4 md:p-6 overflow-y-auto">
            <div className="w-full max-w-2xl">
              <PostPreview />
            </div>
          </div>
        </div>
      </SidebarProvider>
      <div className="w-[400px] bg-white border-l border-gray-200 flex-shrink-0 hidden md:block">
        <PostCreator />
      </div>
    </div>
  )
}
