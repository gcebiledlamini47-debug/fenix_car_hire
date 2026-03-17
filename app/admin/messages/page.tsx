'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchMessages()
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('contact_messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_messages' },
        (payload) => {
          fetchMessages()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [filter])

  const fetchMessages = async () => {
    try {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query
      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', messageId)
      fetchMessages()
    } catch (err) {
      console.error('Error updating message:', err)
    }
  }

  const handleDelete = async (messageId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await supabase.from('contact_messages').delete().eq('id', messageId)
        fetchMessages()
        alert('Message deleted successfully!')
      } catch (err) {
        console.error('Error deleting message:', err)
        alert('Error deleting message')
      }
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1a4a8d]">Contact Messages</h1>
        <p className="text-gray-600 mt-2">
          Messages sent to: reception@fenix.co.sz or +268 76829797
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-4">
        {['all', 'new', 'read', 'responded'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
              filter === status
                ? 'bg-[#00A8E8] text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No messages found</div>
        ) : (
          <div className="divide-y">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  message.status === 'new' ? 'bg-blue-50 border-l-4 border-[#00A8E8]' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1a4a8d]">{message.name}</h3>
                    <p className="text-sm text-gray-600">{message.email}</p>
                    <p className="text-sm text-gray-600">
                      {message.phone ? `Phone: ${message.phone}` : 'No phone provided'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                        message.status === 'new'
                          ? 'bg-blue-100 text-blue-800'
                          : message.status === 'read'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {message.status}
                    </span>
                    <p className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-semibold text-gray-800 mb-2">
                    Subject: {message.subject}
                  </p>
                  <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  {message.status === 'new' && (
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      className="px-4 py-2 bg-[#00A8E8] text-white rounded-lg font-semibold hover:bg-[#0087b8] transition-colors text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
