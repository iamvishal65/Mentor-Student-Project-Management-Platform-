const {
  createNewProject,
  allProject,
  projectAccessById,
  deleteProjectById,
  everyProject,
} = require("../services/projectServices");
const mongoose = require("mongoose");
async function createProject(req, res) {
  try {
    const { projectName, description, repoLink, imageLink, deployLink } =
      req.body;
    const newProject = await createNewProject(
      projectName,
      description,
      repoLink,
      imageLink,
      deployLink,
      req.token.id,
    );
    return res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("error is:" + error);
    return res.status(500).json({ message: error.message });
  }
}
async function accessAllProject(req, res) {
  try {
    const projects = await allProject(req.token.id);
    return res.status(200).json({
      message: "All projects fetched successfully",
      projects,
    });
  } catch (error) {
    console.error("error is:" + error);
    return res.status(500).json({ message: error.message });
  }
}
async function singleProject(req, res) {
  try {
    const projectId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "projet id is not correct" });
    }
    const project = await projectAccessById(req.token.id, projectId);
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }
    return res.status(200).json({
      message: "Project accessed successfully",
      project,
    });
  } catch (error) {
    console.error("error is:" + error);
    return res.status(500).json({ message: error.message });
  }
}
async function deleteProject(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "projet id is not correct" });
    }
    const deleted = await deleteProjectById(req.token.id, req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: error });
    }
    res.status(200).json({ message: "project deleted" });
  } catch (error) {
    console.error("error is:" + error);
    return res.status(500).json({ message: error.message });
  }
}
async function everyoneProject(req, res) {
  try {
    const projects = await everyProject();
    if (projects.length === 0) {
      return res.status(404).json({
        message: "no project found",
      });
    }
    

    return res.status(200).json({
      message: "All projects fetched successfully",
      projects: projects || [],
    });
  } catch (error) {
    console.error("error is:" + error);
    return res.status(500).json({ message: error.message });
  }
}
async function userProject(req,res){
    try {
      const id=req.params.id;
      const getProjects=getUserAllProject(id);
      
    } catch (error) {
      
    }
}
module.exports = {
  deleteProject,
  singleProject,
  accessAllProject,
  createProject,
  everyoneProject,
};
