import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserCheck,
  XCircle,
} from "lucide-react";

export default function MentorApplicationStructure({
  application,
  loading,
  error,
  onApply,
}) {
  const { status, nextEligibleAt } = application;

  const canApplyAgain =
    status === "REJECTED" &&
    nextEligibleAt &&
    new Date(nextEligibleAt) <= new Date();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="mx-auto max-w-xl rounded-2xl bg-white shadow-lg border">

        {/* Header */}
        <div className="border-b px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Mentor Application
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Apply to become a mentor and guide students through their projects.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="p-6">

          {/* ---------------- Loading ---------------- */}

          {status === "LOADING" && (
            <div className="py-12 text-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}

          {/* ---------------- Not Applied ---------------- */}

          {status === "NOT APPLIED" && (
            <div className="space-y-6">

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

                <div className="flex items-start gap-3">
                  <UserCheck
                    className="text-blue-600"
                    size={30}
                  />

                  <div>
                    <h2 className="font-semibold text-blue-700">
                      Become a Mentor
                    </h2>

                    <p className="mt-2 text-sm text-blue-600">
                      You haven't submitted a mentor application yet.
                    </p>
                  </div>
                </div>

              </div>

              <button
                onClick={onApply}
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Apply Now"}
              </button>

            </div>
          )}

          {/* ---------------- Pending ---------------- */}

          {status === "PENDING" && (
            <div className="space-y-6">

              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">

                <div className="flex items-start gap-3">
                  <Clock3
                    className="text-yellow-600"
                    size={30}
                  />

                  <div>
                    <h2 className="font-semibold text-yellow-700">
                      Application Pending
                    </h2>

                    <p className="mt-2 text-sm text-yellow-700">
                      Your application is currently under review.
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm text-yellow-700">
                      <CalendarDays size={16} />
                      Eligible Again:
                      <span className="font-medium">
                        {nextEligibleAt
                          ? new Date(nextEligibleAt).toLocaleDateString()
                          : "--"}
                      </span>
                    </div>

                  </div>
                </div>

              </div>

              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-yellow-400 py-3 font-medium text-white"
              >
                Application Submitted
              </button>

            </div>
          )}

          {/* ---------------- Approved ---------------- */}

          {status === "APPROVED" && (
            <div className="space-y-6">

              <div className="rounded-xl border border-green-200 bg-green-50 p-5">

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-green-600"
                    size={30}
                  />

                  <div>
                    <h2 className="font-semibold text-green-700">
                      Application Approved
                    </h2>

                    <p className="mt-2 text-sm text-green-700">
                      Congratulations! Your mentor application has been approved.
                    </p>
                  </div>

                </div>

              </div>

              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-green-500 py-3 font-medium text-white"
              >
                You're a Mentor
              </button>

            </div>
          )}

          {/* ---------------- Rejected ---------------- */}

          {status === "REJECTED" && (
            <div className="space-y-6">

              <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                <div className="flex items-start gap-3">

                  <XCircle
                    className="text-red-600"
                    size={30}
                  />

                  <div>

                    <h2 className="font-semibold text-red-700">
                      Application Rejected
                    </h2>

                    <p className="mt-2 text-sm text-red-700">
                      Unfortunately your application wasn't approved.
                    </p>

                    {canApplyAgain ? (
                      <div className="mt-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
                        You are eligible to apply again.
                      </div>
                    ) : (
                      <div className="mt-4 rounded-lg bg-white p-3 text-sm text-gray-700">
                        You can apply again after

                        <div className="mt-1 font-semibold text-red-600">
                          {nextEligibleAt
                            ? new Date(nextEligibleAt).toLocaleDateString()
                            : "--"}
                        </div>

                      </div>
                    )}

                  </div>

                </div>

              </div>

              <button
                onClick={onApply}
                disabled={!canApplyAgain || loading}
                className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
              >
                {loading ? "Submitting..." : "Apply Again"}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}