import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Users, ArrowRight, Check, Plane, Globe, Heart, Star, Sparkles } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/50 to-white pt-16">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-16 w-32 h-32 bg-purple-100/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-100/30 rounded-full blur-xl animate-pulse delay-500" />

        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-50/80 backdrop-blur-sm rounded-full text-sm font-medium text-blue-700 mb-8 border border-blue-100/50 hover:bg-blue-100/80 transition-all duration-300 group">
              <Globe className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
              Trusted by travelers worldwide
              <Sparkles className="ml-2 h-3 w-3 opacity-60" />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-slate-900 mb-8 tracking-tight">
              <span className="inline-block hover:scale-105 transition-transform duration-300">Plan your</span>{" "}
              <span className="inline-block hover:scale-105 transition-transform duration-300 delay-100">perfect</span>
              <span className="block font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300 mt-2">
                journey
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-300">
              Create beautiful itineraries, organize your trips, and make every adventure unforgettable with our simple
              planning tools.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up delay-500">
              <Button
                asChild
                size="lg"
                className="px-8 py-6 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <Link href="/register">
                  Start planning
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-6 text-base border-slate-200 text-slate-700 hover:text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-lg bg-transparent transition-all duration-300 hover:scale-105"
              >
                <Link href="/dashboard">View demo</Link>
              </Button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-in-up delay-700">
              <div className="text-center group cursor-default">
                <div className="text-2xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                  10K+
                </div>
                <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                  Travelers
                </div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-2xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                  500+
                </div>
                <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                  Cities
                </div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-2xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                  25K+
                </div>
                <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                  Trips
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-slate-900 mb-4">Everything you need to plan</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple tools that help you organize every aspect of your journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white group hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                  <MapPin className="h-6 w-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl font-medium text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                  Smart Itineraries
                </CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">
                  Create day-by-day plans with activities, places, and timing all organized beautifully.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white group hover:-translate-y-2 delay-100">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 group-hover:scale-110 transition-all duration-300">
                  <Users className="h-6 w-6 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl font-medium text-slate-900 group-hover:text-green-600 transition-colors duration-300">
                  Collaborate
                </CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">
                  Share your plans with friends and family. Plan together, travel together.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white group hover:-translate-y-2 delay-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300">
                  <Calendar className="h-6 w-6 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl font-medium text-slate-900 group-hover:text-purple-600 transition-colors duration-300">
                  Stay Organized
                </CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">
                  Keep track of bookings, expenses, and memories all in one simple place.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50/50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-4 h-4 bg-blue-600 rounded-full" />
          <div className="absolute top-20 right-20 w-2 h-2 bg-purple-600 rounded-full" />
          <div className="absolute bottom-20 left-20 w-3 h-3 bg-green-600 rounded-full" />
          <div className="absolute bottom-10 right-10 w-4 h-4 bg-orange-600 rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-slate-900 mb-4">How it works</h2>
            <p className="text-lg text-slate-600">Three simple steps to your perfect trip</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 text-white text-xl font-medium shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative">
                1
                <div className="absolute inset-0 bg-blue-700 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                Create
              </h3>
              <p className="text-slate-600 leading-relaxed">Add your destination and travel dates to get started</p>
            </div>

            <div className="text-center group">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 text-white text-xl font-medium shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative">
                2
                <div className="absolute inset-0 bg-blue-700 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                Plan
              </h3>
              <p className="text-slate-600 leading-relaxed">Add activities, places, and create your daily itinerary</p>
            </div>

            <div className="text-center group">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 text-white text-xl font-medium shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative">
                3
                <div className="absolute inset-0 bg-blue-700 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                Travel
              </h3>
              <p className="text-slate-600 leading-relaxed">Follow your plan and enjoy your perfectly organized trip</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-slate-500 mb-6">Loved by travelers around the world</p>
            <div className="flex justify-center items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-slate-600 font-medium">4.9/5 from 2,000+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50/50 to-purple-50/30 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-100/20 rounded-full blur-2xl" />

        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-light text-slate-900 mb-6">Ready to start planning?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Join thousands of travelers who trust us with their adventures
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                asChild
                size="lg"
                className="px-8 py-6 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <Link href="/register">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>

            <div className="flex justify-center items-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center group">
                <Check className="mr-2 h-4 w-4 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                Free forever
              </div>
              <div className="flex items-center group">
                <Check className="mr-2 h-4 w-4 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                No credit card
              </div>
              <div className="flex items-center group">
                <Check className="mr-2 h-4 w-4 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                2 min setup
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-slate-200 bg-white py-16 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0 group">
              <Plane className="h-6 w-6 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xl font-medium text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                TravelPlanner
              </span>
            </div>

            <div className="flex space-x-8 text-sm text-slate-600">
              <Link href="#" className="hover:text-slate-900 transition-colors duration-200 relative group">
                Privacy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href="#" className="hover:text-slate-900 transition-colors duration-200 relative group">
                Terms
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href="#" className="hover:text-slate-900 transition-colors duration-200 relative group">
                Support
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-sm text-slate-500">
            © 2024 TravelPlanner. Made with{" "}
            <Heart className="inline h-4 w-4 text-red-500 hover:scale-110 transition-transform duration-300" /> for
            travelers.
          </div>
        </div>
      </footer>
    </div>
  )
}
