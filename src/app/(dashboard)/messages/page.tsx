"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/FormElements"
import { useAuthStore } from "@/lib/store"

interface Contact {
  user: { id: string; email: string; role: string }
  lastMessage: string
  lastTime: string
  unread: number
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: string
}

export default function MessagesPage() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setContacts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    }
  }, [token])

  const fetchMessages = useCallback(async (contactId: string) => {
    try {
      const res = await fetch(`/api/messages?contactId=${contactId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    }
  }, [token])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchContacts()
    setLoading(false)
  }, [user, router, fetchContacts])

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.user.id)
    }
  }, [selectedContact, fetchMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedContact.user.id,
          content: newMessage,
        }),
      })
      setNewMessage("")
      fetchMessages(selectedContact.user.id)
      fetchContacts()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Messages</h1>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex h-[600px]">
        {/* Contacts Sidebar */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="p-6 text-center text-muted text-sm">
                No conversations yet. Start by messaging a worker from their profile.
              </div>
            ) : (
              contacts.map((contact) => (
                <button
                  key={contact.user.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-border ${
                    selectedContact?.user.id === contact.user.id ? "bg-primary-light" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary-dark font-semibold text-sm flex-shrink-0">
                      {contact.user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground text-sm truncate">
                          {contact.user.email}
                        </span>
                        {contact.unread > 0 && (
                          <span className="bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted truncate mt-0.5">{contact.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary-dark font-semibold text-sm">
                  {selectedContact.user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-medium text-foreground text-sm">{selectedContact.user.email}</span>
                  <span className="text-xs text-muted block capitalize">{selectedContact.user.role}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.senderId === user?.id
                          ? "bg-primary text-white rounded-br-md"
                          : "bg-gray-100 text-foreground rounded-bl-md"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderId === user?.id ? "text-emerald-100" : "text-muted"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted">
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <p className="font-medium">Select a conversation</p>
                <p className="text-sm mt-1">Choose from your existing conversations or start a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
