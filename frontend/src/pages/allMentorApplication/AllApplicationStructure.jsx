import ApplicationCard from "./applicationCard/ApplicationCard";

const AllApplicationPageStructure = ({ applications, loading, count,handleApprove,handleReject,loadingAction }) => {
  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Applications</h1>

      {count === 0 ? (
        <p>No applications found</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationCard
              key={app._id}
              app={app}
              onApprove={handleApprove}
              onReject={handleReject}
              loadingAction={loadingAction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllApplicationPageStructure;
