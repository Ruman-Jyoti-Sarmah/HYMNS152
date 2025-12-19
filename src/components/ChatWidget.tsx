import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { messagesApi, getUserId, getUserName, setUserName } from '@/db/api';
import type { Message } from '@/types/types';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserNameState] = useState(getUserName());
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadMessages();
      const subscription = messagesApi.subscribeToMessages(getUserId(), (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await messagesApi.getMessages(getUserId());
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const message = await messagesApi.sendMessage(getUserId(), userName, newMessage.trim());
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateName = () => {
    if (userName.trim()) {
      setUserName(userName.trim());
      setIsEditingName(false);
      toast({
        title: "Name updated",
        description: "Your name has been updated"
      });
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[90vw] xl:w-96 h-[500px] flex flex-col shadow-xl z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Chat with HYMNS</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingName(!isEditingName)}
              >
                {isEditingName ? 'Save' : 'Edit Name'}
              </Button>
            </div>
            {isEditingName && (
              <div className="mt-2 flex gap-2">
                <Input
                  value={userName}
                  onChange={(e) => setUserNameState(e.target.value)}
                  placeholder="Your name"
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                No messages yet. Start a conversation!
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.is_admin_reply ? 'items-start' : 'items-end'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.is_admin_reply
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p className="text-xs font-medium mb-1">
                    {message.is_admin_reply ? 'HYMNS Team' : message.user_name}
                  </p>
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={isSending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
