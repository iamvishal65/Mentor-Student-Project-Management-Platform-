async function search(req,res){
    try {
        const searchQuery=(req.query.q || "").trim().toLowerCase();
        const searchDomain=req.query.scope || "profile";
        let results=[];
        switch(searchDomain){
            case "profile":
                results=searchProfile(searchQuery);
            case "project":
                results=searchProject(searchQuery);
            case "message":
                results=searchMessageUser(searchQuery);        
        }
        return res.json({
            success:true,
            data:results,
            searchQuery,
            searchDomain
        })
    } catch (error) {
        console.log(error+"err in searching in"+searchDomain);
    }
}
