import SearchBar from "../../components/searchBar/SearchBar";

const HomeSchema = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">

        {/* Hero Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to ProjectHub
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Discover projects, connect with mentors, collaborate with students,
            and build real-world software together.
          </p>

          <SearchBar
            className="mt-6 w-full"
            scope="profile"
            placeholder="Search projects, mentors, students..."
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-lg bg-black px-5 py-2 text-white transition hover:bg-gray-800">
              Browse Projects
            </button>

            <button className="rounded-lg border border-gray-300 px-5 py-2 transition hover:bg-gray-100">
              Create Project
            </button>

            <button className="rounded-lg border border-gray-300 px-5 py-2 transition hover:bg-gray-100">
              Become Mentor
            </button>

            <button className="rounded-lg border border-gray-300 px-5 py-2 transition hover:bg-gray-100">
              My Messages
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Recent Activity */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>

            <div className="mt-5 space-y-3">

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="font-medium text-gray-900">
                  John uploaded "Realtime Chat Application"
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  2 hours ago
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="font-medium text-gray-900">
                  Priya applied to become a mentor
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Yesterday
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="font-medium text-gray-900">
                  Rahul joined a collaboration
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Yesterday
                </p>
              </div>

            </div>
          </div>

          {/* Trending Projects */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Trending Projects
            </h2>

            <div className="mt-5 space-y-3">

              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">
                  Expense Tracker
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  React • Node.js • PostgreSQL
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">
                  Realtime Chat
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  MERN • WebSocket
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">
                  AI Resume Analyzer
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Next.js • Python
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeSchema;