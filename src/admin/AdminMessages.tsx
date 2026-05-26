import { useState } from 'react'
import { useMessages } from '../hooks/useMessages'
import { toast } from 'react-hot-toast'

export const AdminMessages = () => {
  const { messages, deleteMessage,markAsRead } = useMessages()
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteMessage(id)
        toast.success('Message deleted successfully')
        setSelectedMessage(null)
      } catch (error) {
        toast.error('Failed to delete message')
      }
    }
  }

  const handleMessageClick = (id: string) => {
  setSelectedMessage(id)
  markAsRead(id)
}

  const selectedMsg = messages.find(m => m.id === selectedMessage)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Messages & Inquiries</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <p className="text-gray-600">Total Messages: <span className="font-bold text-lg">{messages.length}</span></p>
            </div>
            <div className="divide-y">
              {messages.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No messages yet</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                 onClick={() => handleMessageClick(message.id!)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedMessage === message.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold">{message.name}</h3>
                        <p className="text-sm text-gray-600">{message.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(message.date!).toLocaleDateString()}</p>
                      </div>
                      <span className="text-sm text-gray-500">{message.email}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Message Details */}
        {selectedMsg && (
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{selectedMsg.name}</h2>
              <p className="text-gray-600 mb-1"><strong>Email:</strong> {selectedMsg.email}</p>
              {selectedMsg.phone && (
                <p className="text-gray-600 mb-1"><strong>Phone:</strong> {selectedMsg.phone}</p>
              )}
              <p className="text-gray-600"><strong>Date:</strong> {new Date(selectedMsg.date!).toLocaleDateString()}</p>
            </div>

            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-bold mb-2">{selectedMsg.subject}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMsg.message}</p>
            </div>

            <button
              onClick={() => handleDelete(selectedMsg.id!)}
              className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
            >
              Delete Message
            </button>
          </div>
        )}

        {!selectedMsg && messages.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 h-fit flex items-center justify-center text-center">
            <p className="text-gray-500">Select a message to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
