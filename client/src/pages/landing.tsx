import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertWaitlistEmailSchema, type InsertWaitlistEmail } from "@shared/schema";
import { Code, Users, Bot, Bug, GitBranch, Search, Layers, Clock, CheckCircle, Play, Twitter, Github, MessageCircle, Star } from "lucide-react";

export default function Landing() {
  const { toast } = useToast();
  const [typingText, setTypingText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  const codeSnippets = [
    'if (typeof a !== "number" || typeof b !== "number") {',
    '    throw new Error("Arguments must be numbers");',
    '}',
    'return a + b;'
  ];

  // Get waitlist count
  const { data: waitlistData } = useQuery<{ count: number }>({
    queryKey: ['/api/waitlist/count'],
  });

  const form = useForm<InsertWaitlistEmail>({
    resolver: zodResolver(insertWaitlistEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: InsertWaitlistEmail) => {
      const response = await apiRequest("POST", "/api/waitlist", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thanks for joining! We'll be in touch soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist/count'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertWaitlistEmail) => {
    waitlistMutation.mutate(data);
  };

  // Typing animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLine < codeSnippets.length) {
        if (currentChar < codeSnippets[currentLine].length) {
          setTypingText(prev => prev + codeSnippets[currentLine][currentChar]);
          setCurrentChar(prev => prev + 1);
        } else {
          setCurrentLine(prev => prev + 1);
          setCurrentChar(0);
          setTypingText(prev => prev + '\n        ');
        }
      }
    }, currentChar === 0 && currentLine > 0 ? 500 : 50);

    return () => clearTimeout(timer);
  }, [currentChar, currentLine, codeSnippets]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="text-primary-foreground text-sm" />
              </div>
              <span className="text-xl font-bold gradient-text">CodeSync</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-features"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-how-it-works"
              >
                How it Works
              </button>
              <Button 
                onClick={() => scrollToSection('waitlist')}
                className="pulse-glow"
                data-testid="nav-join-waitlist"
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Code Together with
              <span className="gradient-text"> AI Intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Experience the future of collaborative coding. Write, edit, and debug code with your team and AI in real-time. 
              From concept to deployment, faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => scrollToSection('waitlist')}
                size="lg"
                className="pulse-glow text-lg px-8 py-4"
                data-testid="hero-join-waitlist"
              >
                Join the Waitlist
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4"
                data-testid="hero-watch-demo"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Interactive Code Editor Mockup */}
          <div className="relative max-w-5xl mx-auto">
            <div className="glass-card rounded-xl p-6 code-editor shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">main.js</span>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Collaborative Avatars */}
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-background floating-avatar flex items-center justify-center text-xs font-semibold" style={{animationDelay: '0s'}}>JS</div>
                    <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-background floating-avatar flex items-center justify-center text-xs font-semibold" style={{animationDelay: '0.5s'}}>AM</div>
                    <div className="w-8 h-8 rounded-full bg-primary border-2 border-background floating-avatar flex items-center justify-center text-xs font-semibold" style={{animationDelay: '1s'}}>AI</div>
                  </div>
                  <div className="text-xs text-green-400 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Live
                  </div>
                </div>
              </div>
              
              <div className="font-mono text-sm space-y-2">
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-4 select-none">1</span>
                  <span className="text-blue-400">function</span>
                  <span className="text-yellow-300 ml-2">calculateSum</span>
                  <span className="text-foreground">(</span>
                  <span className="text-orange-400">a</span>
                  <span className="text-foreground">,</span>
                  <span className="text-orange-400 ml-2">b</span>
                  <span className="text-foreground">) {"{"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-4 select-none">2</span>
                  <span className="ml-6 text-blue-400">return</span>
                  <span className="text-foreground ml-2">a + b;</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-4 select-none">3</span>
                  <span className="text-foreground">{"}"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-4 select-none">4</span>
                  <span className="text-foreground"></span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-4 select-none">5</span>
                  <span className="text-gray-500">// AI Suggestion: Add error handling</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-4 select-none">6</span>
                  <span className="text-blue-400">function</span>
                  <span className="text-yellow-300 ml-2">safeCalculateSum</span>
                  <span className="text-foreground">(</span>
                  <span className="text-orange-400">a</span>
                  <span className="text-foreground">,</span>
                  <span className="text-orange-400 ml-2">b</span>
                  <span className="text-foreground">) {"{"}</span>
                  <span className="typing-animation ml-1">{typingText}</span>
                </div>
              </div>
            </div>
            
            {/* Floating Collaboration Indicators */}
            <div className="absolute top-20 right-4 bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-1 text-xs text-blue-300">
              <Users className="inline mr-1 h-3 w-3" />
              John is typing...
            </div>
            <div className="absolute bottom-20 left-4 bg-primary/20 border border-primary/30 rounded-lg px-3 py-1 text-xs text-primary">
              <Bot className="inline mr-1 h-3 w-3" />
              AI suggestion available
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Everything you need to
              <span className="gradient-text"> code better</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features that make collaborative coding seamless, intelligent, and fun.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real-time Collaboration */}
            <div className="glass-card p-8 rounded-xl hover:bg-accent/10 transition-colors" data-testid="feature-collaboration">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-blue-400 text-xl h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-time Collaboration</h3>
              <p className="text-muted-foreground mb-4">
                See your teammates' cursors, edits, and comments in real-time. No more merge conflicts or lost changes.
              </p>
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-background"></div>
                <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
                <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-background"></div>
                <div className="w-6 h-6 bg-muted flex items-center justify-center rounded-full border-2 border-background text-xs">+</div>
              </div>
            </div>

            {/* AI Code Generation */}
            <div className="glass-card p-8 rounded-xl hover:bg-accent/10 transition-colors" data-testid="feature-ai-generation">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Bot className="text-primary text-xl h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Code Generation</h3>
              <p className="text-muted-foreground mb-4">
                Describe what you want to build, and our AI will generate production-ready code instantly.
              </p>
              <div className="bg-background/50 rounded-lg p-3 font-mono text-sm">
                <span className="text-gray-500">// Generate a REST API endpoint</span><br/>
                <span className="text-blue-400">app</span><span className="text-foreground">.get(</span><span className="text-green-400">'/users'</span><span className="text-foreground">, ...</span>
              </div>
            </div>

            {/* Smart Debugging */}
            <div className="glass-card p-8 rounded-xl hover:bg-accent/10 transition-colors" data-testid="feature-debugging">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
                <Bug className="text-red-400 text-xl h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Debugging</h3>
              <p className="text-muted-foreground mb-4">
                AI-powered debugging that finds and fixes issues before they become problems.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-red-400">3 issues found</span>
                <div className="w-2 h-2 bg-green-400 rounded-full ml-4"></div>
                <span className="text-green-400">Auto-fixed</span>
              </div>
            </div>

            {/* Version Control */}
            <div className="glass-card p-8 rounded-xl hover:bg-accent/10 transition-colors" data-testid="feature-git">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-6">
                <GitBranch className="text-yellow-400 text-xl h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Git Integration</h3>
              <p className="text-muted-foreground">
                Seamless Git integration with visual conflict resolution and automated commit suggestions.
              </p>
            </div>

            {/* Code Review */}
            <div className="glass-card p-8 rounded-xl hover:bg-accent/10 transition-colors" data-testid="feature-review">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                <Search className="text-green-400 text-xl h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Code Review</h3>
              <p className="text-muted-foreground">
                Get instant feedback on code quality, security, and best practices from our AI reviewer.
              </p>
            </div>

            {/* Multi-Language */}
            <div className="glass-card p-8 rounded-xl hover:bg-accent/10 transition-colors" data-testid="feature-languages">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
                <Layers className="text-indigo-400 text-xl h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Multi-Language Support</h3>
              <p className="text-muted-foreground">
                Support for 40+ programming languages with intelligent syntax highlighting and completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              How <span className="gradient-text">CodeSync</span> Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and transform your development workflow forever.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center" data-testid="step-1">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
                <span className="text-primary text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Workspace</h3>
              <p className="text-muted-foreground">
                Set up your collaborative coding environment in seconds. Invite your team and start coding together.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center" data-testid="step-2">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Code with AI Assistance</h3>
              <p className="text-muted-foreground">
                Write code naturally while our AI suggests improvements, generates boilerplate, and catches errors.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center" data-testid="step-3">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-primary text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Deploy & Iterate</h3>
              <p className="text-muted-foreground">
                Push to production with confidence. Continuous integration and deployment made simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by <span className="gradient-text">developers</span> worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of developers who are already coding faster with CodeSync.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-xl" data-testid="testimonial-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "CodeSync has revolutionized how our team collaborates. The AI suggestions are incredibly accurate, and real-time editing feels magical."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">Senior Developer at TechCorp</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl" data-testid="testimonial-2">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "The debugging features alone have saved us countless hours. It's like having a senior developer reviewing every line of code."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Marcus Rodriguez</div>
                  <div className="text-sm text-muted-foreground">CTO at StartupLab</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl" data-testid="testimonial-3">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "We've increased our development speed by 3x since switching to CodeSync. The team collaboration features are unmatched."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Emily Watson</div>
                  <div className="text-sm text-muted-foreground">Lead Engineer at InnovateCo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-8 md:p-12 rounded-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to transform your
              <span className="gradient-text"> coding experience</span>?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the waitlist and be among the first to experience the future of collaborative coding with AI.
            </p>
            
            {/* Waitlist Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto mb-8" data-testid="waitlist-form">
                <div className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input 
                            placeholder="Enter your email address" 
                            className="bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                            data-testid="input-email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={waitlistMutation.isPending}
                    className="px-8 py-3 font-semibold"
                    data-testid="button-submit-waitlist"
                  >
                    {waitlistMutation.isPending ? "Joining..." : "Join Waitlist"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  No spam. Unsubscribe at any time. We respect your privacy.
                </p>
              </form>
            </Form>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-muted-foreground">
              <div className="flex items-center" data-testid="waitlist-count">
                <Users className="mr-2 h-4 w-4" />
                <span className="text-sm">{waitlistData?.count || 0} developers waiting</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span className="text-sm">Early access soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent/10 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="text-primary-foreground text-sm" />
              </div>
              <span className="text-xl font-bold gradient-text">CodeSync</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-privacy">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-terms">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-support">Support</a>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-twitter">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-github">
                  <Github className="h-4 w-4" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-discord">
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 CodeSync. All rights reserved. Made with ❤️ for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
