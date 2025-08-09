"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Send, Plus, Paperclip, Image, Smile } from 'lucide-react'

export function PostCreator() {
  const [message, setMessage] = useState("")

  return (
    <div className="h-full flex flex-col w-full bg-white">
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">LinkedIn AI Agent</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Send className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Start a conversation</h3>
          <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
            Write a brief idea, Youtube/Reddit link, or upload an image/video/PDF document and let the AI generate a perfect LinkedIn post for your audience.
          </p>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <div className="relative">
              <Textarea
                placeholder="Give me feedback or instructions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[48px] max-h-32 resize-none border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 pr-14 py-3 px-4 text-sm shadow-sm"
                rows={1}
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                  <Image className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            className={`rounded-xl h-[48px] px-5 transition-all duration-200 ${message.trim()
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
