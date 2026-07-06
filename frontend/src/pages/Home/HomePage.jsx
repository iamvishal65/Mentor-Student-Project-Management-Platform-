import SearchBar from "../../components/searchBar/SearchBar";

const HomeSchema = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        
        {/* Header + Search */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Home</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search projects, users, mentors...
          </p>
          <SearchBar className="mt-4 w-full" scope="profile"/>
        </div>

        {/* Updates Only */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Updates</h2>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600">
              New project uploaded
            </div>

            <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600">
              Mentor commented on a project
            </div>

            <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600">
              Student joined a collaboration
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomeSchema;