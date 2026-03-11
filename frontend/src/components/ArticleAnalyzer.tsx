import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { detectArticle, detectBatch, detectFromUrl, type DetectResult, type DetectUrlResult } from "@/lib/api";
import { ResultCard } from "./ResultCard";
import { Loader2, Send, Layers, Newspaper, Sparkles, Link2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export function ArticleAnalyzer() {
  const [text, setText] = useState("");
  const [batchText, setBatchText] = useState("");
  const [url, setUrl] = useState("");
  const [singleResult, setSingleResult] = useState<DetectResult | null>(null);
  const [batchResults, setBatchResults] = useState<DetectResult[]>([]);
  const [urlResult, setUrlResult] = useState<DetectUrlResult | null>(null);

  const singleMutation = useMutation({
    mutationFn: detectArticle,
    onSuccess: setSingleResult,
  });

  const batchMutation = useMutation({
    mutationFn: detectBatch,
    onSuccess: setBatchResults,
  });

  const urlMutation = useMutation({
    mutationFn: detectFromUrl,
    onSuccess: setUrlResult,
  });

  const handleSingle = () => {
    if (!text.trim()) return;
    setSingleResult(null);
    singleMutation.mutate(text.trim());
  };

  const handleBatch = () => {
    const texts = batchText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (!texts.length) return;
    setBatchResults([]);
    batchMutation.mutate(texts);
  };

  const handleUrl = () => {
    if (!url.trim()) return;
    setUrlResult(null);
    urlMutation.mutate(url.trim());
  };

  const charCount = text.length;

  return (
    <div>
      {/* Hero section */}
      <section className="hero-gradient relative overflow-hidden pb-4 pt-16 sm:pt-24 neural-pattern">
        {/* Animated background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute -left-20 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="animate-float-delayed absolute -right-20 top-40 h-80 w-80 rounded-full bg-success/10 blur-3xl" />
          <div className="animate-float absolute left-1/3 top-60 h-48 w-48 rounded-full bg-warning/5 blur-3xl" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container relative max-w-3xl text-center">
          {/* Website Name */}
          <div className="animate-fade-in mb-6">
            <h2 className="text-3xl font-bold text-primary">TruthGuard</h2>
            <p className="text-sm text-muted-foreground mt-1">Fake News Detection</p>
          </div>

          {/* Badge */}
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-warning" />
            AI-Powered Analysis
            <span className="ml-1 h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
          </div>

          <h1 className="animate-slide-up font-display text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Separate{" "}
            <span className="relative">
              <span className="text-gradient">Fact</span>
              <svg
                className="absolute -bottom-2 left-0 w-full text-success/40"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8C40 2 80 2 100 6C120 10 160 4 198 4"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            from{" "}
            <span className="text-gradient-destructive">Fiction</span>
          </h1>

          <p
            className="animate-slide-up mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground"
            style={{ animationDelay: "0.1s" }}
          >
            Paste any news article, enter a URL, or analyze multiple articles — our machine learning model will assess credibility instantly.
          </p>

          {/* Quick stats */}
          <div className="animate-slide-up mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground/70" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2 rounded-full bg-card/50 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span>99.7% Accuracy</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-card/50 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>45K+ Articles</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-card/50 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span>Real-time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section
        className="animate-slide-up container max-w-3xl pb-16 pt-8"
        style={{ animationDelay: "0.2s" }}
      >
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 rounded-xl bg-secondary p-1">
            <TabsTrigger
              value="single"
              className="gap-2 rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Newspaper className="h-4 w-4" /> Single Article
            </TabsTrigger>
            <TabsTrigger
              value="url"
              className="gap-2 rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Link2 className="h-4 w-4" /> URL Analysis
            </TabsTrigger>
            <TabsTrigger
              value="batch"
              className="gap-2 rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Layers className="h-4 w-4" /> Batch Mode
            </TabsTrigger>
          </TabsList>

          {/* Single analysis */}
          <TabsContent value="single" className="space-y-4">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                placeholder="Paste the full article text here…"
                className="textarea-glow w-full resize-none rounded-xl border bg-card p-5 font-body text-sm leading-relaxed text-card-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <span className="absolute bottom-3 right-4 text-[11px] font-medium text-muted-foreground/40">
                {charCount > 0 ? `${charCount.toLocaleString()} chars` : ""}
              </span>
            </div>

            <Button
              onClick={handleSingle}
              disabled={singleMutation.isPending || !text.trim()}
              size="lg"
              className="w-full gap-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              {singleMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Analyze Article
            </Button>

            {singleMutation.isError && (
              <div className="animate-fade-in rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-center text-sm text-destructive">
                Failed to analyze. Make sure the API server is running.
              </div>
            )}

            {singleResult && (
              <div className="pt-2">
                <ResultCard result={singleResult} />
              </div>
            )}
          </TabsContent>

          {/* URL analysis */}
          <TabsContent value="url" className="space-y-4">
            <div className="relative">
              <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter news article URL (e.g., https://example.com/news/article)"
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <Button
              onClick={handleUrl}
              disabled={urlMutation.isPending || !url.trim()}
              size="lg"
              className="w-full gap-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              {urlMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
              Analyze URL
            </Button>

            {urlMutation.isError && (
              <div className="animate-fade-in rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-center text-sm text-destructive">
                {urlMutation.error instanceof Error ? urlMutation.error.message : "Failed to analyze URL. Please check the URL and try again."}
              </div>
            )}

            {urlResult && (
              <div className="pt-2">
                <ResultCard result={urlResult} />
                {urlResult.extracted_text_preview && (
                  <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Extracted content preview:</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">{urlResult.extracted_text_preview}</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Batch analysis */}
          <TabsContent value="batch" className="space-y-4">
            <textarea
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              rows={10}
              placeholder={"Paste one article per line…\n\nLine 1: First article text\nLine 2: Second article text\nLine 3: Third article text"}
              className="textarea-glow w-full resize-none rounded-xl border bg-card p-5 font-body text-sm leading-relaxed text-card-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/20"
            />

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground/60">
                {batchText.split("\n").filter((l) => l.trim()).length} article(s)
                detected
              </p>
              <Button
                onClick={handleBatch}
                disabled={batchMutation.isPending || !batchText.trim()}
                size="lg"
                className="gap-2 rounded-xl px-8 text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              >
                {batchMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Layers className="h-4 w-4" />
                )}
                Analyze All
              </Button>
            </div>

            {batchMutation.isError && (
              <div className="animate-fade-in rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-center text-sm text-destructive">
                Batch analysis failed. Make sure the API server is running.
              </div>
            )}

            {batchResults.length > 0 && (
              <div className="space-y-4 pt-2">
                {batchResults.map((r, i) => (
                  <ResultCard key={i} result={r} index={i} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground/50">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
            Real-time analysis
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-warning" />
            ML-powered predictions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive" />
            Confidence scoring
          </span>
        </div>
      </section>
    </div>
  );
}
