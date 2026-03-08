import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Send, Upload, Bot } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { mattersApi, researchApi } from '@/lib/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function MatterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your LexCore AI Research Assistant. I\'m fully aware of all prior sessions and documents for this matter. How can I assist you today? I can research statutes, analyze documents, or provide strategic guidance.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')

  const { data: matter, isLoading } = useQuery({
    queryKey: ['matter', id],
    queryFn: () => mattersApi.get(id!),
    enabled: !!id,
  })

  const research = useMutation({
    mutationFn: (query: string) => researchApi.submit({ matter_id: id, query, domain: matter?.data?.domain ?? 'legal' }),
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Research initiated. Session ID: ${data.data.session_id}\n\nFindings will appear as the research agents complete their analysis. All citations will include source, section, and effective date.\n\nOpen questions: ${data.data.open_questions.join('; ')}`,
        timestamp: new Date(),
      }])
    },
  })

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    research.mutate(input)
  }

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>
  const m = matter?.data

  return (
    <div className="flex flex-col h-screen">
      <PageHeader
        title={m?.title ?? 'Matter'}
        subtitle={`${m?.domain?.replace('_',' ')} · ${m?.status?.replace('_',' ')}`}
      />
      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <Card padding={false} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'assistant' ? 'bg-brand-600' : 'bg-gray-200'
                  }`}>
                    {msg.role === 'assistant' ? <Bot className="h-4 w-4 text-white" /> :
                      <span className="text-xs font-bold text-gray-600">U</span>}
                  </div>
                  <div className={`max-w-2xl rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    msg.role === 'assistant' ? 'bg-gray-50 text-gray-800' : 'bg-brand-600 text-white'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {research.isPending && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    <span className="text-sm text-gray-500">Researching…</span>
                  </div>
                </div>
              )}
            </div>
            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <input
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Ask a research question or describe your matter…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || research.isPending}
                  className="btn-primary px-4"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">All outputs include citations. No action executes without your approval.</p>
            </div>
          </Card>
        </div>

        {/* Matter info panel */}
        <div className="w-72 space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Matter Details</h3>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-xs text-gray-400">Domain</dt><dd className="text-gray-700 capitalize">{m?.domain?.replace('_',' ')}</dd></div>
              <div><dt className="text-xs text-gray-400">Status</dt><dd className="text-gray-700 capitalize">{m?.status?.replace('_',' ')}</dd></div>
              {m?.jurisdiction && <div><dt className="text-xs text-gray-400">Jurisdiction</dt><dd className="text-gray-700">{m.jurisdiction}</dd></div>}
              {m?.next_action && <div><dt className="text-xs text-gray-400">Next Action</dt><dd className="text-amber-600 font-medium">{m.next_action}</dd></div>}
            </dl>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Documents</h3>
            <button className="w-full flex items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors">
              <Upload className="h-5 w-5" />
              Upload document
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}
