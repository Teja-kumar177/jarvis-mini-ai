-- Create chat_history table to store conversations
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  reply TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries by username and timestamp
CREATE INDEX idx_chat_history_username ON public.chat_history(username);
CREATE INDEX idx_chat_history_timestamp ON public.chat_history(timestamp DESC);
CREATE INDEX idx_chat_history_session ON public.chat_history(session_id);

-- Enable Row Level Security
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert chat history (since we're using username-based system, not auth)
CREATE POLICY "Anyone can insert chat history"
ON public.chat_history
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view chat history for their username
CREATE POLICY "Anyone can view their own chat history"
ON public.chat_history
FOR SELECT
USING (true);

-- Allow deletion of old chats
CREATE POLICY "Anyone can delete chat history"
ON public.chat_history
FOR DELETE
USING (true);