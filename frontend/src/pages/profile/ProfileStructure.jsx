export default function ProfilePageStructure({
  profile,
  messageUser,
  currentUser,
}) {
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading profile...</p>
      </div>
    );
  }

  const roles = profile?.roles || [];

  const isStudent = roles.includes("STUDENT");
  const isMentor = roles.includes("mentor");
  const isAdmin = roles.includes("admin");
  const isUser = roles.includes("user");

  const roleTitle = isStudent
    ? "Projects"
    : isMentor
      ? "Mentoring"
      : isAdmin
        ? "Admin Overview"
        : "Activity";

  const roleDescription = isStudent
    ? "Showcase your projects and work."
    : isMentor
      ? "Mentoring sessions and expertise."
      : isAdmin
        ? "Manage platform activity and reports."
        : "Recent activity and updates.";

  const canMessage = currentUser?._id && currentUser._id !== profile?._id;

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#161b22] shadow-2xl">
              <div className="h-16 bg-gradient-to-r from-[#1f6feb] to-[#238636]" />

              <div className="-mt-10 px-5 pb-5">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile?.Name || "Profile"}
                    className="h-24 w-24 rounded-full border-4 border-[#161b22] object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#161b22] bg-slate-700 text-3xl font-bold text-white shadow-lg">
                    {profile?.Name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}

                <div className="mt-4">
                  <h1 className="text-2xl font-bold tracking-tight text-white">
                    {profile?.Name || "Unnamed User"}
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">
                    @{profile?.userName || "unknown"}
                  </p>

                  <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
                    {roles.join(", ") || "USER"}
                  </span>

                  {canMessage && (
                    <button
                      onClick={() => messageUser(profile)}
                      className="mt-4 w-full rounded-xl bg-[#238636] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2ea043]"
                    >
                      Message
                    </button>
                  )}
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm text-slate-400">Projects</span>
                    <span className="text-sm font-semibold text-white">
                      {profile?.projects?.length || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm text-slate-400">Role</span>
                    <span className="text-sm font-semibold text-white">
                      {roles.join(", ") || "USER"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm text-slate-400">Status</span>
                    <span className="text-sm font-semibold text-emerald-400">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#161b22] shadow-2xl">
              <div className="border-b border-white/10 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {roleTitle}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {roleDescription}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                      Overview
                    </button>
                    <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                      Posts
                    </button>
                    <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                      Projects
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {isStudent && (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {(profile?.projects?.length
                      ? profile.projects
                      : [
                          {
                            title: "Project One",
                            description: "Short description of the project.",
                          },
                          {
                            title: "Project Two",
                            description: "Short description of the project.",
                          },
                          {
                            title: "Project Three",
                            description: "Short description of the project.",
                          },
                        ]
                    ).map((project, index) => (
                      <div
                        key={project?._id || index}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <h3 className="text-sm font-semibold text-white">
                          {project?.title ||
                            project?.name ||
                            `Project ${index + 1}`}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {project?.description || "No description available."}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {isMentor && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <h3 className="text-sm font-semibold text-white">
                        Mentoring Sessions
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Session details and schedule.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <h3 className="text-sm font-semibold text-white">
                        Expertise
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Skills and topics you mentor on.
                      </p>
                    </div>
                  </div>
                )}

                {isUser && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <h3 className="text-sm font-semibold text-white">
                        Recent Activity
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Your latest updates and interactions.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <h3 className="text-sm font-semibold text-white">
                        About
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Short bio or intro section.
                      </p>
                    </div>
                  </div>
                )}

                {isAdmin && (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <h3 className="text-sm font-semibold text-white">
                        Reports
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Review flags and issues.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <h3 className="text-sm font-semibold text-white">
                        User Control
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Manage users and roles.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <h3 className="text-sm font-semibold text-white">
                        Platform Stats
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        See overall platform health.
                      </p>
                    </div>
                  </div>
                )}

                {!["student", "mentor", "user", "admin"].includes(
                  profile?.role,
                ) && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <h3 className="text-sm font-semibold text-white">
                      No content available
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      This profile role does not have a configured section yet.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
