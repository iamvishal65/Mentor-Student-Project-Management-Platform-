import React, { useMemo, useState } from "react";

const role = "student"; // user | student | mentor | admin

const profileMap = {
  user: [
    { key: "name", label: "Name", value: "Vishal Kumar Singh" },
    { key: "username", label: "Username", value: "user_x7k29ab" },
    { key: "bio", label: "Bio", value: "I build MERN projects." },
  ],
  student: [
    { key: "name", label: "Name", value: "Vishal Kumar Singh" },
    { key: "username", label: "Username", value: "user_x7k29ab" },
    { key: "bio", label: "Bio", value: "I build MERN projects." },
    { key: "enrollment", label: "Enrollment", value: "2023BTECH001" },
    { key: "department", label: "Department", value: "Computer Science" },
    { key: "github", label: "GitHub", value: "github.com/vishal" },
  ],
  mentor: [
    { key: "name", label: "Name", value: "Vishal Kumar Singh" },
    { key: "username", label: "Username", value: "mentor_vishal" },
    { key: "bio", label: "Bio", value: "Backend mentor." },
    { key: "designation", label: "Designation", value: "Senior Engineer" },
    { key: "linkedin", label: "LinkedIn", value: "linkedin.com/in/vishal" },
  ],
  admin: [
    { key: "name", label: "Name", value: "Admin Vishal" },
    { key: "username", label: "Username", value: "admin_vishal" },
  ],
};

const UserDataStructure = () => {
  const initialProfile = useMemo(() => profileMap[role] || profileMap.user, []);
  const [profileData, setProfileData] = useState(initialProfile);
  const [editingKey, setEditingKey] = useState(null);
  const [draftValue, setDraftValue] = useState("");

  const nameValue = profileData.find((item) => item.key === "name")?.value || "U";
  const initials = nameValue
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const startEdit = (item) => {
    setEditingKey(item.key);
    setDraftValue(item.value);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setDraftValue("");
  };

  const saveEdit = () => {
    const trimmed = draftValue.trim();
    if (!trimmed) return;

    setProfileData((prev) =>
      prev.map((item) =>
        item.key === editingKey ? { ...item, value: trimmed } : item
      )
    );
    cancelEdit();
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-md border border-gray-100">
      {/* Simple avatar circle, no random photo */}
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-700">
          {initials}
        </div>
      </div>

      {/* Role Badge */}
      <div className="flex justify-center mb-8">
        <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium capitalize">
          {role}
        </span>
      </div>

      {/* Profile Fields */}
      <div className="space-y-5">
        {profileData.map((item) => (
          <div
            key={item.key}
            className="flex justify-between items-start border-b pb-4 gap-4 group"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500">{item.label}</p>

              {editingKey === item.key ? (
                <input
                  value={draftValue}
                  onChange={(e) => setDraftValue(e.target.value)}
                  autoFocus
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-800 font-medium break-words">
                  {item.value}
                </p>
              )}
            </div>

            {editingKey === item.key ? (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={saveEdit}
                  className="text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => startEdit(item)}
                className="text-sm text-blue-600 opacity-70 group-hover:opacity-100 hover:text-blue-700 hover:underline transition shrink-0"
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDataStructure;