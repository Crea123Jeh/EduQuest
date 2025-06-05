import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to EduQuest</h1>
        <p className="text-xl mb-8">Gamify your learning journey and achieve your academic goals!</p>
        <div className="space-x-4">
          <Link href="/signup" className="bg-white text-blue-600 py-3 px-8 rounded-full font-semibold hover:bg-gray-200">
            Sign Up
          </Link>
          <Link href="/login" className="border border-white text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700">
            Log In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">Discover the Power of EduQuest</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Engaging Quests</h3>
              <p className="text-gray-600">Turn your lessons into exciting quests with interactive challenges and rewards.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-green-600">Personalized Learning</h3>
              <p className="text-gray-600">Tailor your learning path and progress at your own pace with adaptive content.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-purple-600">Track Your Progress</h3>
              <p className="text-gray-600">Visualize your achievements, track your performance, and stay motivated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>&copy; 2023 EduQuest. All rights reserved.</p>
      </footer>
    </div>
  );
}