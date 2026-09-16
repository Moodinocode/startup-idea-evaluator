import axios from "axios";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Brain, Target, MapPin, TrendingUp, Lightbulb, DollarSign, Rocket, Star, ThumbsUp, AlertTriangle, Users, Globe } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface IdeaForm {
  description: string;
  location: string;
  audience: string;
  pricingModel: string;
  industry: string;
}

interface Evaluation {
  successScore: number;
  strengths: string[];
  weaknesses: string[];
  marketPotential: string;
  competition: string;
  locationInsights: string;
  improvements: string[];
  monetization: string[];
  mvpSuggestion: string;
}

// Keep in step with MAX_DESCRIPTION_LENGTH on the server.
const MAX_DESCRIPTION_LENGTH = 4000;

// Join without assuming whether VITE_API_URL carries a trailing slash.
const evaluateEndpoint = `${(import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "")}/api/evaluate-idea`;

// The evaluation comes from a language model, so treat the list fields as
// untrusted: render nothing rather than crashing if one arrives malformed.
const asList = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String) : [];

const Index = () => {
  const [formData, setFormData] = useState<IdeaForm>({
    description: "",
    location: "",
    audience: "",
    pricingModel: "",
    industry: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      toast({
        title: "Please describe your startup idea",
        description: "We need to know what you're building to give you feedback!",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setEvaluation(null);
    try {
      const response = await axios.post(evaluateEndpoint, formData);
      setEvaluation(response.data);
      toast({
        title: "Analysis Complete! 🎉",
        description: "Your startup idea has been evaluated by our AI mentor.",
      });
    } catch (error: any) {
      toast({
        title: "Error evaluating idea",
        description: error?.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      description: "",
      location: "",
      audience: "",
      pricingModel: "",
      industry: ""
    });
    setEvaluation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  StartupMentor AI
                </h1>
                <p className="text-sm text-gray-600">Your 24/7 startup validation partner</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <Star className="w-3 h-3 mr-1" />
              Beta
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!evaluation ? (
          /* Idea Submission Form */
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Validate Your Startup Idea
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get instant, personalized feedback from our AI mentor. Discover strengths, weaknesses, and actionable insights to take your idea to the next level.
              </p>
            </div>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <Lightbulb className="w-5 h-5" />
                  <span>Tell us about your startup idea</span>
                </CardTitle>
                <CardDescription>
                  The more details you provide, the better feedback we can give you.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                      Startup Idea Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your startup idea in detail. What problem does it solve? How does it work? What makes it unique?"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="min-h-32 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      maxLength={MAX_DESCRIPTION_LENGTH}
                      required
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {formData.description.length} / {MAX_DESCRIPTION_LENGTH}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                        Target Location/Market
                      </Label>
                      <Input
                        id="location"
                        placeholder="e.g., United States, San Francisco, Europe"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audience" className="text-sm font-semibold text-gray-700">
                        Target Audience
                      </Label>
                      <Input
                        id="audience"
                        placeholder="e.g., Small business owners, Students, Freelancers"
                        value={formData.audience}
                        onChange={(e) => setFormData({...formData, audience: e.target.value})}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pricingModel" className="text-sm font-semibold text-gray-700">
                        Pricing Model
                      </Label>
                      <Select value={formData.pricingModel} onValueChange={(value) => setFormData({...formData, pricingModel: value})}>
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select pricing model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="freemium">Freemium</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
                          <SelectItem value="one-time">One-time purchase</SelectItem>
                          <SelectItem value="commission">Commission-based</SelectItem>
                          <SelectItem value="advertising">Advertising</SelectItem>
                          <SelectItem value="contract">Contract-based</SelectItem>
                          <SelectItem value="retainer">Corporate Retainer</SelectItem>
                          <SelectItem value="pay-per-use">Pay-per-use</SelectItem>
                          <SelectItem value="table-rental">Table/Seat Rental (for Cafes)</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-sm font-semibold text-gray-700">
                        Industry Category
                      </Label>
                      <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS / Software</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="fintech">FinTech</SelectItem>
                          <SelectItem value="healthtech">HealthTech</SelectItem>
                          <SelectItem value="edtech">EdTech</SelectItem>
                          <SelectItem value="marketplace">Marketplace</SelectItem>
                          <SelectItem value="consumer">Consumer</SelectItem>
                          <SelectItem value="b2b">B2B Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analyzing your idea...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Rocket className="w-5 h-5" />
                        <span>Get My Startup Evaluation</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Evaluation Results */
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Startup Evaluation Complete!</h2>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Here's your personalized feedback from our AI mentor. Use these insights to refine and improve your startup idea.
              </p>
            </div>

            {/* Success Score */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-bold text-gray-900">Startup Success Score</h3>
                  </div>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="text-4xl font-bold text-green-600">{evaluation.successScore}</div>
                    <div className="text-lg text-gray-600">/100</div>
                  </div>
                  <Progress value={evaluation.successScore} className="w-full max-w-md mx-auto h-3" />
                  <p className="text-sm text-gray-600 mt-2">
                    {evaluation.successScore >= 80 ? "Excellent potential! 🚀" : 
                     evaluation.successScore >= 70 ? "Good foundation with room for improvement 👍" : 
                     "Needs refinement but has potential 💡"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Strengths */}
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <ThumbsUp className="w-5 h-5" />
                    <span>Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {asList(evaluation.strengths).map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-800">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Areas for Improvement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {asList(evaluation.weaknesses).map((weakness, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Market Analysis */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Market Potential</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{evaluation.marketPotential}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Competition Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{evaluation.competition}</p>
                </CardContent>
              </Card>
            </div>

            {/* Location Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location-Specific Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{evaluation.locationInsights}</p>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Improvement Suggestions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {asList(evaluation.improvements).map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Monetization Ideas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {asList(evaluation.monetization).map((idea, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{idea}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* MVP Suggestion */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-800">
                  <Rocket className="w-5 h-5" />
                  <span>Recommended MVP Approach</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{evaluation.mvpSuggestion}</p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                onClick={resetForm}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Evaluate Another Idea
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => {
                  toast({
                    title: "Feature Coming Soon! 🚀",
                    description: "We're working on pitch deck generation and more advanced features.",
                  });
                }}
              >
                Generate Pitch Deck Outline
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">🚀 StartupMentor AI - Your 24/7 startup validation partner</p>
            <p className="text-sm">Helping founders turn ideas into successful ventures</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
