export default function ApplicationCard ({
  app,
  onApprove,
  onReject,
  loadingAction,
}) {
  const isApproving =
    loadingAction.id === app._id && loadingAction.type === "APPROVE";

  const isRejecting =
    loadingAction.id === app._id && loadingAction.type === "REJECT";

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-center">
      <div>
        <p className="font-semibold text-lg">
          {app.userId?.name || "Unknown User"}
        </p>
        <p className="text-sm text-gray-500">
          Applied on: {new Date(app.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onApprove(app._id)}
          disabled={isApproving || isRejecting}
          className="px-4 py-1.5 bg-green-500 text-white rounded-md"
        >
          {isApproving ? "Approving..." : "Approve"}
        </button>

        <button
          onClick={() => onReject(app._id)}
          disabled={isApproving || isRejecting}
          className="px-4 py-1.5 bg-red-500 text-white rounded-md"
        >
          {isRejecting ? "Rejecting..." : "Reject"}
        </button>
      </div>
    </div>
  );
};
