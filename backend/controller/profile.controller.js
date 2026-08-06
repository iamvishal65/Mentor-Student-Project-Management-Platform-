const { searchProfile } = require("../services/profile.services");

async function search(req, res) {
  const searchDomain = req.query.scope || "profile";
  try {
    const searchQuery = (req.query.q || "").trim().toLowerCase();

    let results = [];
    switch (searchDomain) {
      case "profile":
        results = await searchProfile(searchQuery);
        break;
      case "project":
        break;
        results = await searchProject(searchQuery);
      case "message":
        results = await searchMessageUser(searchQuery);
        break;
      default:
        return res.status(400).json({
          success: false,
          data: [],
          message: "Invalid search scope",
        });
    }
    if (!results || results.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No results found",
        searchQuery,
        searchDomain,
      });
    }

    console.log(results);

    return res.status(200).json({
      success: true,
      data: results,
      searchQuery,
      searchDomain,
    });
  } catch (error) {
    console.log(error + "err in searching in" + searchDomain);
    return res.status(500).json({
      success: false,
      data: [],
      message: "Search failed",
    });
  }
}
module.exports = { search };
