// الملف: route.ts
// الوظيفة: مسار API لمعالجة محادثات وكيل Gemini الذكي وإرجاع الردود.
// المحتوى: POST يبني تعليمات النظام من AgentConfig ويستخدم GoogleGenAI مع ردّ احتياطي.
// الاعتماديات: @google/genai و process.env.GEMINI_API_KEY.
import { GoogleGenAI } from '@google/genai';

// Initialize Google GenAI SDK
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface AgentConfig {
  engineerName?: string;
  engineerTitle?: string;
  bio?: string;
  yearsExperience?: string;
  specialties?: string;
  availability?: string;
  customKnowledge?: string;
  ratesNote?: string;
  strictMode?: boolean;
  faqs?: { question: string; answer: string }[];
}

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(request: Request) {
  try {
    const {
      messages,
      agentConfig,
      locale = 'ar',
    }: { messages: ChatMessage[]; agentConfig?: AgentConfig; locale?: 'ar' | 'en' } =
      await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Messages array is required' }, { status: 400 });
    }

    if (!ai) {
      // Return a simulated high-quality response if API key is temporarily missing
      const isArabic = locale === 'ar';
      return Response.json({
        reply: isArabic
          ? 'مرحباً بك! أنا وكيل المهندس سلمان الانسي الذكي. سلمان مهندس ذكاء اصطناعي ومطور تطبيقات ويب وموبايل. يمكنك التواصل معه مباشرة عبر واتساب (+769771924870) أو البريد الإلكتروني (salman.developer.ai@gmail.com) لمناقشة مشروعك.'
          : "Welcome! I am Salman Al-Ansi's official AI representative. Salman is an AI Engineer, Web Developer, and Mobile App Developer. Feel free to contact him directly via WhatsApp (+769771924870) or email (salman.developer.ai@gmail.com) to discuss your project.",
        grounded: true,
      });
    }

    // Construct custom grounded system prompt based on engineer's configuration
    const engineerName = agentConfig?.engineerName || 'Salman Al-Ansi (سلمان الانسي)';
    const engineerTitle = agentConfig?.engineerTitle || 'AI Engineer, Web Developer & Mobile App Developer';
    const bio =
      agentConfig?.bio ||
      'AI Engineer specializing in intelligent solutions, modern web applications (Next.js), and cross-platform mobile development.';
    const yearsExperience =
      agentConfig?.yearsExperience || 'Professional experience in AI research and software engineering.';
    const specialties =
      agentConfig?.specialties ||
      'Artificial Intelligence, Machine Learning, Next.js, React, React Native, Flutter, TypeScript, Node.js';
    const availability =
      agentConfig?.availability ||
      'Open to freelance contracts, remote full-time opportunities, and technical consulting';
    const customKnowledge = agentConfig?.customKnowledge || '';
    const ratesNote =
      agentConfig?.ratesNote ||
      'Rates are determined by project scope and technical requirements. Contact Salman directly to receive an accurate timeline and estimate.';
    const faqs = Array.isArray(agentConfig?.faqs)
      ? agentConfig.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
      : '';

    const systemInstruction = `
You are the official, intelligent AI Representative ("الوكيل الذكي") for ${engineerName}, who is a ${engineerTitle}.
Your sole duty is to represent the engineer to potential clients, employers, and collaborators, answer inquiries accurately, introduce his work and capabilities, and facilitate hiring/contact.

### Engineer Verified Knowledge Base (Provided directly by the Engineer):
- Name: ${engineerName}
- Title / Role: ${engineerTitle}
- Professional Bio: ${bio}
- Experience: ${yearsExperience}
- Core Specialties & Technologies: ${specialties}
- Availability & Work Model: ${availability}
- Pricing & Quotation Policy: ${ratesNote}
- Contact Channels:
  - WhatsApp: wa.me/769771924870
  - Email: salman.developer.ai@gmail.com
  - LinkedIn: linkedin.com/in/salman-al-ansi-93ab92397
  - GitHub: github.com/salman-dev-ai

### Verified Portfolio Projects:
1. E-Commerce Platform: High-performance e-commerce store with Next.js, Stripe payments, real-time inventory, and admin dashboard.
2. Task Management App: Real-time Kanban productivity board with React, Firebase real-time synchronization, and team collaboration.
3. Weather Dashboard: Meteorological forecast web app with Next.js, APIs, radar maps, and responsive dark UI.
4. DevOps CI/CD Deployment Suite: Containerized deployment pipelines with Docker, Linux automation, GitHub Actions, and zero-downtime releases.
5. Cloud Storage REST API: Scalable backend with Node.js, Express, MySQL indexing, and chunked streaming uploads.

${faqs ? `### Engineer's Frequently Asked Questions (Pre-approved Answers):\n${faqs}\n` : ''}

${customKnowledge ? `### Engineer's Custom Directives & Additional Information:\n${customKnowledge}\n` : ''}

### MANDATORY GROUNDING & BEHAVIORAL INSTRUCTIONS:
1. STRICT CONSTRAINT: You must ONLY answer questions based on the knowledge provided above.
   - If a client asks about something NOT mentioned in this profile (for example, unrelated technical topics, personal life, unrelated services, or unverified claims), you must politely decline to answer, state that you are the dedicated representative for Salman's engineering work, and invite them to contact Salman directly via WhatsApp or email.
   - Do NOT guess, do NOT hallucinate, do NOT fabricate facts.
2. Tone: Warm, professional, confident, respectful, concise, and helpful.
3. Language: Match the client's language (reply in fluent Arabic if asked in Arabic, fluent English if asked in English).
4. Direct Call-to-Action: Always invite the client to reach out to Salman via WhatsApp or email for project discussions or custom proposals.
5. Formatting: Use clean bullet points and short paragraphs. Avoid long conversational fluff.
`;

    // Gemini contents array uses { role: 'user' | 'model', parts: [{ text: string }] }
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.4,
        topP: 0.9,
      },
    });

    const reply =
      response.text ||
      (locale === 'ar'
        ? 'عذراً، لم أتمكن من معالجة الرد حالياً.'
        : 'Sorry, could not process response at this moment.');

    return Response.json({ reply, grounded: true });
  } catch (error) {
    console.error('Gemini Agent Error:', error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error processing agent response',
      },
      { status: 500 }
    );
  }
}
