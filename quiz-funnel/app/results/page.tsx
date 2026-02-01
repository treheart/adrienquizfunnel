"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { decodeQuizData } from "@/lib/answer-encoding";
import { pathResults } from "@/lib/quiz-data";
import resultsContent from "@/content/results.json";
import learningPathContent from "@/content/learning-path.json";
import Link from "next/link";

function ResultsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  
  const { name, path, answers } = decodeQuizData(id);
  const result = pathResults[path];
  const pathData = learningPathContent.paths[path as keyof typeof learningPathContent.paths];
  
  // Get personalized insights based on answers
  const getPersonalizedInsights = () => {
    const insights: string[] = [];
    const pathInsights = resultsContent.personalizedInsights[path as keyof typeof resultsContent.personalizedInsights];
    
    if (pathInsights) {
      Object.entries(answers).forEach(([questionId, answerValue]) => {
        const questionInsights = pathInsights[questionId as keyof typeof pathInsights];
        if (questionInsights && questionInsights[answerValue as keyof typeof questionInsights]) {
          insights.push(questionInsights[answerValue as keyof typeof questionInsights]);
        }
      });
    }
    
    return insights.length > 0 ? insights : result.insights;
  };

  const personalizedInsights = getPersonalizedInsights();

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in-up">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            {resultsContent.labels.bottleneckType}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">{result.title}</h1>
          <p className="text-sm font-medium text-muted-foreground">
            {result.subtitle}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 animate-fade-in">
          {result.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Main Result Card */}
        <Card className="border-[3px] border-black rounded-[25px] shadow-none animate-fade-in-up">
          <CardContent className="p-6 md:p-8 space-y-6">
            {/* Wizard Image */}
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pathData.image}
                alt="Result"
                width={120}
                height={120}
                className="rounded-lg"
              />
            </div>

            {/* Description */}
            <div className="text-center space-y-4">
              <p className="text-sm font-medium text-muted-foreground">
                {resultsContent.labels.basedOnAnswers.replace("{name}", name)}
              </p>
              <p className="text-base leading-relaxed">
                {result.description}
              </p>
            </div>

            {/* Insights */}
            <div className="space-y-3">
              <h3 className="font-semibold text-center">What this means for you:</h3>
              <ul className="space-y-2">
                {personalizedInsights.slice(0, 4).map((insight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <span className="shrink-0 w-5 h-5 bg-black rounded-full flex items-center justify-center mt-0.5">
                      <CheckIcon className="w-3 h-3 text-white" />
                    </span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Solution Card */}
        <Card className="border-[3px] border-black rounded-[25px] shadow-none animate-fade-in-up">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
                {learningPathContent.labels.newOffer}
              </span>
              <h2 className="text-xl md:text-2xl font-bold">
                {pathData.headline}
              </h2>
              <p className="text-muted-foreground">
                {pathData.description.replace("{name}", name)}
              </p>
            </div>

            {/* What's Included */}
            <div className="space-y-3">
              <h3 className="font-semibold">{learningPathContent.labels.whatsIncluded}</h3>
              <ul className="space-y-3">
                {pathData.included.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <CheckIcon className="w-3 h-3 text-white" />
                    </span>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Achievements */}
            <div className="space-y-3">
              <h3 className="font-semibold">{learningPathContent.labels.whatYoullAchieve}</h3>
              <ul className="space-y-2">
                {pathData.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <CheckIcon className="w-4 h-4 text-green-500 shrink-0" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="space-y-4 pt-4">
              <Button
                asChild
                className="w-full h-14 text-lg font-bold bg-black text-white hover:bg-black/90 rounded-xl"
              >
                <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
                  {learningPathContent.finalCta.button}
                </a>
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {learningPathContent.pricing.subtitle}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="space-y-4">
          <h3 className="font-semibold text-center">{learningPathContent.labels.testimonialsHeading}</h3>
          <div className="space-y-4">
            {pathData.testimonials.map((testimonial, index) => (
              <Card key={index} className="border border-gray-200 rounded-xl shadow-none">
                <CardContent className="p-4">
                  <p className="text-sm italic mb-2">&ldquo;{testimonial.quote}&rdquo;</p>
                  <p className="text-xs font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <Card className="border-[3px] border-black rounded-[25px] shadow-none bg-black text-white">
          <CardContent className="p-6 md:p-8 text-center space-y-4">
            <h2 className="text-xl md:text-2xl font-bold">
              {learningPathContent.finalCta.heading.replace("{name}", name)}
            </h2>
            <p className="text-gray-300">
              {learningPathContent.finalCta.subheading}
            </p>
            <Button
              asChild
              className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-gray-100 rounded-xl"
            >
              <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
                {learningPathContent.finalCta.button}
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Retake Quiz */}
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← Retake the quiz
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          {learningPathContent.labels.footer}
        </p>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            {resultsContent.labels.suspenseFallback}
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
