export async function callGoogleAPI(query) {
    try{
        const response = await fetch("/api/google-api", {
            method: "POST",
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({searchInput: query, searchType: "search"}),
        });
        if(!response.ok) throw new Error("API call failed");

        const data = await response.json();
        const snippet=data.items?.[0]?.snippet;
        return snippet || "No result found";
    }
    catch(err){
        console.error("Google API error: ",err);
        return "Error calling Google API";
    }
}
    