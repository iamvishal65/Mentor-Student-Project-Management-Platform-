import React from "react";

const MentorApplicationStructure = ({
  applyForMentorRole,
  loading,
  applicationStatus,
  nextEligibleAt
}) => {
  if (loading) return <p>Loading...</p>;

  // 🔥 Normalize status (very important)
  const status = applicationStatus?.toUpperCase?.().trim();

  const isEligibleToReapply =
    nextEligibleAt && new Date() >= new Date(nextEligibleAt);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Become a Mentor</h1>

      {/* Info Section */}
      <div className="mb-6 text-gray-700">
        <p>As a mentor, you can:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Guide students on their projects</li>
          <li>Review and give feedback</li>
          <li>Help improve project quality</li>
          <li>Build your professional profile</li>
        </ul>
      </div>

      {/* 🔹 Conditional UI */}
      <div className="mt-4 space-y-3">

        {/* NOT APPLIED */}
        {status === "NOT APPLIED" && (
          <>
            <p className="text-gray-600">You haven’t applied yet.</p>
            <button
              onClick={applyForMentorRole}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Apply for Mentor Role
            </button>
          </>
        )}

        {/* PENDING */}
        {status === "PENDING" && (
          <p className="text-yellow-600">
            Your application is under review.
          </p>
        )}

        {/* REJECTED */}
        {status === "REJECTED" && (
          <div>
            <p className="text-red-600 mb-2">
              Your application was rejected.
            </p>

            {isEligibleToReapply ? (
              <button
                onClick={applyForMentorRole}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Reapply for Mentor Role
              </button>
            ) : (
              <p className="text-gray-600">
                You can reapply after:{" "}
                {nextEligibleAt
                  ? new Date(nextEligibleAt).toLocaleDateString()
                  : "N/A"}
              </p>
            )}
          </div>
        )}

        {/* APPROVED */}
        {status === "APPROVED" && (
          <p className="text-green-600">
            You are now a mentor 🎉
          </p>
        )}

        {/* ❗ Fallback (VERY IMPORTANT) */}
        {!status && (
          <p className="text-gray-500">Unable to load status.</p>
        )}
      </div>
    </div>
  );
};

export default MentorApplicationStructure;