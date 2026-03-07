"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Mail, MailOpen, Trash2, X, Search, Phone } from "lucide-react"

interface Message {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  created_at: string
}

export function MessagesPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  const markAsRead = async (id: string) => {
    const supabase = createClient()
    await supabase.from("contact_messages").update({ status: "read" }).eq("id", id)
    fetchMessages()
  }

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return
    const supabase = createClient()
    await supabase.from("contact_messages").delete().eq("id", id)
    fetchMessages()
    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }
  }

  const viewMessage = (message: Message) => {
    setSelectedMessage(message)
    if (message.status === "unread") {
      markAsRead(message.id)
    }
  }

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a4a8d]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Contact Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent outline-none w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No messages found
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  message.status === "unread" ? "bg-blue-50/50" : ""
                }`}
                onClick={() => viewMessage(message)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      message.status === "unread"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {message.status === "unread" ? (
                      <Mail className="w-5 h-5" />
                    ) : (
                      <MailOpen className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`font-medium truncate ${
                          message.status === "unread" ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {message.name}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        message.status === "unread" ? "font-medium text-gray-800" : "text-gray-600"
                      }`}
                    >
                      {message.subject}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{message.message}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteMessage(message.id)
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Message Details</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">{selectedMessage.name}</h4>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </span>
              </div>

              {selectedMessage.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${selectedMessage.phone}`} className="hover:underline">
                    {selectedMessage.phone}
                  </a>
                </div>
              )}

              <div className="border-t pt-4">
                <label className="text-xs text-gray-500 uppercase">Subject</label>
                <p className="font-medium">{selectedMessage.subject}</p>
              </div>

              <div className="border-t pt-4">
                <label className="text-xs text-gray-500 uppercase">Message</label>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="flex-1 px-4 py-2 bg-[#1a4a8d] text-white rounded-lg hover:bg-[#153a70] transition-colors text-center"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => {
                    deleteMessage(selectedMessage.id)
                  }}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
