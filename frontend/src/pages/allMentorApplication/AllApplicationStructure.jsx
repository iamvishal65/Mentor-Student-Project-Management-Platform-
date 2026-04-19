


const AllApplicationPageStructure = (applications,loading,count) => {


  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Applications
      </h1>

      {count === 0 ? (
        <p>No applications found</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app._id}
              className="border rounded-md p-3 bg-white shadow-sm"
            >
              <p className="font-medium">
                {app.userId?.name || "Unknown User"}
              </p>
              <p className="text-sm text-gray-500">
                {app.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllApplicationPageStructure;