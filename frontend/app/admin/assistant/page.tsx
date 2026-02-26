"use client"

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

export default function AssistantPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I am your AI financial assistant. How can I help you analyze your portfolio today?',
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        // Mock API call - Replace with real API/SDK later
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Here is a simulated response to: "${userMessage.content}". \n\nI can help you with:\n- Portfolio Analysis\n- Risk Assessment\n- Market Trends`,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, aiResponse])
        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col p-5 md:p-6 bg-zinc-950 text-zinc-50">
            <Card className="flex flex-1 flex-col border-zinc-800 bg-zinc-900/50 shadow-2xl">
                <CardHeader className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4">
                    <CardTitle className="flex items-center gap-2 text-zinc-100">
                        <Bot className="h-5 w-5 text-indigo-400" />
                        AI Financial Assistant
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full p-4">
                        <div className="flex flex-col gap-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                        }`}
                                >
                                    <Avatar className={`h-8 w-8 border ${message.role === 'user'
                                        ? 'border-indigo-500/30 bg-indigo-500/10'
                                        : 'border-emerald-500/30 bg-emerald-500/10'
                                        }`}>
                                        <AvatarFallback className="bg-transparent text-xs">
                                            {message.role === 'user' ? <User className="h-4 w-4 text-indigo-400" /> : <Bot className="h-4 w-4 text-emerald-400" />}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div
                                        className={`flex flex-col gap-1 max-w-[80%] md:max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'
                                            }`}
                                    >
                                        <div
                                            className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${message.role === 'user'
                                                ? 'bg-indigo-600/90 text-white rounded-tr-none'
                                                : 'bg-zinc-800/80 text-zinc-100 rounded-tl-none border border-zinc-700/50'
                                                }`}
                                        >
                                            <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700 max-w-none text-sm">
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                                                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                                                        code: ({ children }) => <code className="bg-zinc-900/50 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-zinc-500 px-1">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8 border border-emerald-500/30 bg-emerald-500/10">
                                        <AvatarFallback className="bg-transparent">
                                            <Bot className="h-4 w-4 text-emerald-400" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-zinc-800/80 rounded-2xl rounded-tl-none border border-zinc-700/50 px-4 py-3">
                                        <div className="flex items-center gap-1 h-5">
                                            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="p-4 bg-zinc-900/50 border-t border-zinc-800">
                    <div className="flex w-full items-center gap-2">
                        <Input
                            placeholder="Ask about your portfolio..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            className="flex-1 bg-zinc-950/50 border-zinc-700/50 focus-visible:ring-indigo-500/30 text-zinc-100 placeholder:text-zinc-500"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            size="icon"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
