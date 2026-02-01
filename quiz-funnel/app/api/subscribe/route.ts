import { NextRequest, NextResponse } from "next/server";

interface SubscribeRequestBody {
  email: string;
  firstName: string;
  path: string;
  result: string;
  bottleneckTitle?: string;
  answers?: Record<string, string>;
}

// Map answer values to human-readable labels for Beehiiv
function getAnswerLabel(questionId: string, value: string): string {
  const answerLabels: Record<string, Record<string, string>> = {
    // Path A questions
    Q1A: {
      learning: "Still learning",
      practiced: "Practiced but inconsistent",
      unpredictable: "Done work but unpredictable",
    },
    Q2A: {
      skills: "Doubt my skills",
      scared: "Scared to put myself out there",
      focus: "Don't know where to focus",
    },
    Q4A: {
      imposter: "Imposter syndrome",
      execution: "Worry about execution quality",
      clients_want: "Don't know what clients want",
    },
    // Path B questions
    Q2B: {
      leads: "Finding consistent leads",
      revenue: "Predictable revenue",
      time: "Time management",
    },
    Q4B: {
      slows_down: "Everything slows down",
      leads_dry: "Leads dry up",
      quality_drops: "Quality drops",
    },
    Q6B: {
      getting_clients: "Getting clients",
      fulfillment: "Fulfillment",
      many_hats: "Wearing too many hats",
    },
    // Path C questions
    Q2C: {
      attention_not_clients: "Getting attention but not clients",
      slow_growth: "Slow growth",
      unclear_monetization: "Unclear monetization",
    },
    Q5C: {
      views_no_sales: "Views but no sales",
      inconsistent: "Inconsistent inbound",
      unclear_messaging: "Unclear messaging",
    },
    Q6C: {
      funnel: "Funnel issues",
      positioning: "Positioning",
      conversion_assets: "Conversion assets",
    },
  };

  return answerLabels[questionId]?.[value] || value;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequestBody = await request.json();
    const { email, firstName, path, result, bottleneckTitle, answers } = body;

    // Validate required fields
    if (!email || !firstName) {
      return NextResponse.json(
        { error: "Email and first name are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      console.error("Missing Beehiiv credentials");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Subscribe to Beehiiv
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          custom_fields: [
            { name: "first_name", value: firstName },
            { name: "quiz_path", value: path }, // A, B, or C
            { name: "quiz_result", value: result }, // Result subtitle
            { name: "bottleneck_type", value: bottleneckTitle || "" }, // Full bottleneck title
            { name: "quiz_date", value: new Date().toISOString().split("T")[0] }, // YYYY-MM-DD
            // Individual answers for segmentation
            ...(answers
              ? Object.entries(answers).map(([questionId, value]) => ({
                  name: `answer_${questionId.toLowerCase()}`,
                  value: getAnswerLabel(questionId, value),
                }))
              : []),
            // Also store raw answers as JSON for reference
            ...(answers ? [{ name: "quiz_answers_raw", value: JSON.stringify(answers) }] : []),
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Beehiiv API error:", errorData);

      // Handle specific Beehiiv errors
      if (response.status === 409) {
        // Already subscribed - this is okay
        return NextResponse.json({ success: true, message: "Already subscribed" });
      }

      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
