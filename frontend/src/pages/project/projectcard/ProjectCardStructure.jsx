import React from "react";

const ProjectCardStructure = ({ project = [], loading, onDelete ,allowDelete}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-10 text-gray-500">
        Loading projects...
      </div>
    );
  }

  if (project.length === 0) {
    return (
      <div className="flex justify-center py-10 text-gray-500">
        No projects found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
      
      {project.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
        >
          {/* Image */}
          <div className="h-40 bg-gray-200 flex items-center justify-center">
            {item.imageLink ? (
              <img
                src={item.imageLink}
                alt={item.projectName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800">
              {item.projectName || "Untitled Project"}
            </h2>

            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
              {item.description || "No description available"}
            </p>

            {/* Footer */}
            <div className="mt-auto pt-4 flex justify-between items-center">
              <div className="flex gap-3 text-sm">
                {item.repoLink && (
                  <a
                    href={item.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {item.deployLink && (
                  <a
                    href={item.deployLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    Live
                  </a>
                )}
              </div>

              {/* 🔴 DELETE BUTTON */}
              {allowDelete && (
                <button
                  onClick={() => onDelete(item._id)}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              )}
              
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectCardStructure;
