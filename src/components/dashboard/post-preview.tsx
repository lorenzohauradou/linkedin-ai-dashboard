"use client"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Heart, Send, MoreHorizontal, ThumbsUp } from 'lucide-react'

export function PostPreview() {
  const handlePublish = () => {
    console.log("Publish post")
  }

  return (
    <Card className="relative bg-transparent border border-gray-200 rounded-lg shadow-sm max-w-none overflow-hidden">
      <CardContent className="relative z-10 bg-white/80 backdrop-blur-sm p-0">
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-14 h-14">
              <AvatarImage src="/icons/emoji1.png" alt="Linkedin User Image" />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-lg">LH</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 text-base">LORENZO</h3>
                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0L10.2 5.8H16L11.6 9.4L13.8 15.2L8 11.6L2.2 15.2L4.4 9.4L0 5.8H5.8L8 0Z" />
                </svg>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="text-blue-600 text-sm font-medium">1st</span>
              </div>
              <p className="text-sm text-gray-600 mt-0.5">Bali, Indonesia</p>
              <p className="text-sm text-gray-500 mt-0.5">now</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100 p-2">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-6 pb-4">
          <textarea
            className="w-full min-h-[100px] text-base text-gray-900 leading-relaxed resize-none bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-500"
            placeholder="Write your brief idea here..."
            defaultValue="I am crafting your post..."
            rows={4}
            style={{ height: 'auto' }}
            onChange={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = e.target.scrollHeight + 'px'
            }}
          />
          <div className="px-6 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                    <ThumbsUp className="w-3 h-3 text-white" />
                  </div>
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white text-xs font-bold">👏</span>
                  </div>
                </div>
                <span className="hover:text-blue-600 hover:underline cursor-pointer">393</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="hover:text-blue-600 hover:underline cursor-pointer">59 comments</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-around py-2 border-t border-gray-100">
          <Button variant="ghost" size="lg" className="flex-1 text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:text-white hover:shadow-lg hover:scale-90 py-4 rounded-xl max-w-md transition-all duration-300" onClick={handlePublish}>
            <Send className="w-5 h-5 mr-2" />
            <span className="text-base font-medium">Publish Post</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
