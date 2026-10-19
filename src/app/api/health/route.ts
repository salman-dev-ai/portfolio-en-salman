// الملف: route.ts
// الوظيفة: مسار فحص الحالة الذي يعيد حالة الخدمة وتوفر مفتاح Gemini.
// المحتوى: دالة GET تُرجع JSON يحوي status و hasGeminiKey.
// الاعتماديات: process.env.GEMINI_API_KEY بدون استيرادات خارجية.
export async function GET() {
  return Response.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
}
