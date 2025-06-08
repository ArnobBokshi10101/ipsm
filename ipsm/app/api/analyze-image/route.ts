import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Check if required environment variables are present
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Image analysis service is not configured" },
        { status: 503 }
      );
    }

    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const base64Data = image.split(",")[1];

    const prompt = `Analyze this emergency situation image and respond in this exact format without any asterisks or bullet points:
TITLE: Write a clear, brief title
TYPE: Choose one (Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, or Other)
DESCRIPTION: Write a clear, concise description`;

    // Use fetch directly instead of OpenAI SDK to avoid initialization issues
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "CivicSafe",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-sonnet",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Parse the response
    const titleMatch = text.match(/TITLE:\s*(.+)/);
    const typeMatch = text.match(/TYPE:\s*(.+)/);
    const descMatch = text.match(/DESCRIPTION:\s*(.+)/);

    return NextResponse.json({
      title: titleMatch?.[1]?.trim() || "Emergency Report",
      reportType: typeMatch?.[1]?.trim() || "Other",
      description: descMatch?.[1]?.trim() || "Emergency situation detected",
    });
  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { 
        error: "Failed to analyze image",
        title: "Emergency Report",
        reportType: "Other", 
        description: "Please provide details manually"
      },
      { status: 500 }
    );
  }
}