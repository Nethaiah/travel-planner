import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  Calendar,
  Camera,
  Plane,
  Star,
  ArrowRight,
  Users,
  DollarSign,
  Cloud,
  CheckCircle,
  Heart,
  Sparkles,
  Globe,
  Shield,
} from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen">
    {/* Navbar */}
      <Navbar />
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/simon-english-48nerZQCHgo-unsplash.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-cyan-900/80" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-orange-400/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-pink-400/20 rounded-full blur-xl animate-pulse delay-500" />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
            <Sparkles className="mr-2 h-4 w-4 text-yellow-400" />
            Trusted by 10,000+ travelers worldwide
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 leading-tight">
            Plan Your Perfect
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Adventure
            </span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-95 font-light">
            Create stunning itineraries, discover amazing destinations, and make every journey unforgettable with our
            intelligent travel planning platform
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              asChild
              size="lg"
              className="text-lg px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-2xl shadow-cyan-500/25 transform hover:scale-105 transition-all duration-200"
            >
              <Link href="/auth/sign-up">
                <Plane className="mr-2 h-5 w-5" />
                Start Planning Free
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-10 py-5 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-200"
            >
              <Link href="/dashboard">
                Explore Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-4xl sm:text-5xl font-bold mb-2">10K+</div>
              <div className="text-base font-medium">Happy Travelers</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-4xl sm:text-5xl font-bold mb-2">500+</div>
              <div className="text-base font-medium">Destinations</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-4xl sm:text-5xl font-bold mb-2">25K+</div>
              <div className="text-base font-medium">Trips Planned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-sm font-medium text-orange-800 mb-4">
              <Star className="mr-2 h-4 w-4" />
              Powerful Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="block text-orange-500">Plan & Explore</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Powerful features designed to make travel planning effortless and enjoyable, from initial inspiration to
              unforgettable memories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white">
              <CardHeader className="pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-3">Interactive Maps</CardTitle>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  Visualize your entire journey with beautiful, interactive maps that show your route, destinations, and
                  points of interest in stunning detail.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white">
              <CardHeader className="pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <Calendar className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-3">Smart Itineraries</CardTitle>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  Create detailed day-by-day plans with activities, restaurants, and attractions all organized in one
                  place with intelligent scheduling.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white">
              <CardHeader className="pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-3">Trip Collaboration</CardTitle>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  Share your travel plans with friends and family, allowing everyone to contribute ideas and create the
                  perfect group adventure.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white">
              <CardHeader className="pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <DollarSign className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-3">Expense Tracking</CardTitle>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  Keep track of your travel budget and expenses in real-time with detailed analytics to stay within your
                  planned budget.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white">
              <CardHeader className="pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <Camera className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-3">Photo Memories</CardTitle>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  Upload and organize all your travel photos with AI-powered tagging, creating a beautiful digital
                  memory book of your adventures.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white">
              <CardHeader className="pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <Cloud className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-3">Weather Integration</CardTitle>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  Get accurate weather forecasts for your destinations with packing suggestions and activity
                  recommendations based on conditions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-800 mb-4">
              <Globe className="mr-2 h-4 w-4" />
              Simple Process
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get started with your perfect trip in just three simple steps. Our intuitive platform guides you through
              every stage of planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center relative">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-8 text-white text-3xl font-bold shadow-2xl shadow-blue-500/25">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Create Your Trip</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Start by adding your destination, travel dates, and basic trip information. Our smart system will help
                you get organized instantly.
              </p>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-12 left-3/4 w-1/2 h-0.5 bg-gradient-to-r from-blue-300 to-orange-300"></div>
            </div>

            <div className="text-center relative">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-8 text-white text-3xl font-bold shadow-2xl shadow-orange-500/25">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Plan Your Days</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Add activities, restaurants, and attractions to create detailed daily itineraries. Use our suggestions
                or add your own discoveries.
              </p>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-12 left-3/4 w-1/2 h-0.5 bg-gradient-to-r from-orange-300 to-green-300"></div>
            </div>

            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-8 text-white text-3xl font-bold shadow-2xl shadow-green-500/25">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Enjoy Your Adventure</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Follow your personalized itinerary, track expenses, and capture memories. Your perfect trip awaits with
                everything organized.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-sm font-medium text-purple-800 mb-4">
              <Heart className="mr-2 h-4 w-4" />
              Customer Love
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">What Travelers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of happy travelers who trust TravelPlanner for their adventures. See what makes us the #1
              choice for trip planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-lg text-gray-700 leading-relaxed">
                  "TravelPlanner made organizing our European trip so easy! The itinerary feature helped us make the
                  most of every single day. Absolutely love it!"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Sarah Johnson</p>
                    <p className="text-gray-600">Travel Blogger & Photographer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-lg text-gray-700 leading-relaxed">
                  "The collaboration feature is amazing! Our whole family could contribute to planning our reunion trip.
                  Everyone felt involved and excited!"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    M
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Mike Chen</p>
                    <p className="text-gray-600">Family Travel Enthusiast</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-lg text-gray-700 leading-relaxed">
                  "I love how I can track my expenses and see everything on the map. It's like having a personal travel
                  assistant that never sleeps!"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    E
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Emma Rodriguez</p>
                    <p className="text-gray-600">Solo Adventure Seeker</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-sm font-medium text-green-800 mb-4">
              <Shield className="mr-2 h-4 w-4" />
              Trusted & Secure
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Why Choose TravelPlanner?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">
                Your data is encrypted and protected with enterprise-grade security
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Always Free</h3>
              <p className="text-gray-600 text-sm">Core features are completely free with no hidden costs or limits</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Get help whenever you need it from our friendly support team</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Global Coverage</h3>
              <p className="text-gray-600 text-sm">Plan trips anywhere in the world with local insights and tips</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-700 relative overflow-hidden">
        {/* Subtle overlay tint */}
        <div className="absolute inset-0 bg-white/5 mix-blend-overlay pointer-events-none"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Start Your
              <span className="block text-cyan-300">Dream Journey?</span>
            </h2>
            <p className="text-xl sm:text-2xl text-blue-100 mb-12 leading-relaxed">
              Join thousands of travelers who trust TravelPlanner to organize their perfect trips. Start planning your
              next adventure today and make memories that last a lifetime!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button
                asChild
                size="lg"
                className="text-xl px-12 py-6 bg-white text-blue-600 hover:bg-blue-50 shadow-2xl shadow-white/25 transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                <Link href="/auth/sign-up">
                  <Heart className="mr-3 h-6 w-6" />
                  Get Started Free
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-xl px-12 py-6 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                <Link href="/dashboard">
                  View Live Demo
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 text-blue-100">
              <div className="flex items-center text-lg">
                <CheckCircle className="mr-3 h-6 w-6 text-green-400" />
                Free forever plan
              </div>
              <div className="flex items-center text-lg">
                <CheckCircle className="mr-3 h-6 w-6 text-green-400" />
                No credit card required
              </div>
              <div className="flex items-center text-lg">
                <CheckCircle className="mr-3 h-6 w-6 text-green-400" />
                Setup in 2 minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">TravelPlanner</span>
              </div>
              <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
                Plan your perfect adventures with our intuitive travel planning platform. Create beautiful itineraries,
                discover amazing destinations, and make every journey unforgettable.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                  Twitter
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                  Instagram
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                  Facebook
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <div className="space-y-3">
                <Link href="/" className="block text-gray-300 hover:text-white transition-colors text-lg">
                  Home
                </Link>
                <Link href="/trips" className="block text-gray-300 hover:text-white transition-colors text-lg">
                  My Trips
                </Link>
                <Link href="/dashboard" className="block text-gray-300 hover:text-white transition-colors text-lg">
                  Dashboard
                </Link>
                <Link href="#" className="block text-gray-300 hover:text-white transition-colors text-lg">
                  Features
                </Link>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xl font-bold mb-6">Support</h3>
              <div className="space-y-3">
                <Link href="#" className="block text-gray-300 hover:text-white transition-colors text-lg">
                  Help Center
                </Link>
                <Link href="#" className="block text-gray-300 hover:text-white transition-colors text-lg">
                  Contact Us
                </Link>
                <Link href="#" className="block text-gray-300 hover:text-white transition-colors text-lg">
                  Privacy Policy
                </Link>
                <Link href="#" className="block text-gray-300 hover:text-white transition-colors text-lg">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-lg">© 2024 TravelPlanner. All rights reserved.</p>
            <p className="text-gray-400 text-lg mt-4 sm:mt-0">Made with &hearts; for travelers worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  )
}