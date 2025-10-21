import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// TODO: MongoDB Integration Placeholder
// ==================================================
// Future implementation will store chat history in MongoDB
// 
// Connection setup (to be implemented):
// import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
// const client = new MongoClient();
// await client.connect(Deno.env.get('MONGODB_URI'));
// const db = client.database('tej_ai');
// const chatsCollection = db.collection('chats');
//
// Schema Example:
// interface ChatSchema {
//   username: string;
//   message: string;
//   reply: string;
//   timestamp: Date;
//   sessionId: string;
// }
//
// Functions to be implemented:
// async function saveChatToDB(username: string, message: string, reply: string) {
//   await chatsCollection.insertOne({
//     username,
//     message,
//     reply,
//     timestamp: new Date(),
//     sessionId: crypto.randomUUID()
//   });
// }
//
// async function fetchChatHistory(username: string, limit = 50) {
//   return await chatsCollection
//     .find({ username })
//     .sort({ timestamp: -1 })
//     .limit(limit)
//     .toArray();
// }
// ==================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, task } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = `You are Tej, a smart and helpful AI assistant. 
You are friendly, efficient, and provide concise yet informative responses.
Keep responses professional with a modern, approachable tone.
Help users with their questions and tasks effectively.`;

    // Handle specific tasks
    if (task === "time") {
      const now = new Date();
      systemPrompt += `\n\nThe current time is ${now.toLocaleTimeString()}.`;
    } else if (task === "date") {
      const now = new Date();
      systemPrompt += `\n\nToday's date is ${now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}.`;
    }

    // TODO: Future MongoDB integration - save conversation context
    // const username = req.headers.get('x-username') || 'anonymous';
    // await saveChatToDB(username, lastUserMessage, aiReply);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment, Sir." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service requires additional credits. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
