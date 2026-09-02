//import { useState } from "react"

function Search({research,setResearch}) {
   //const [research,setSearch]=useState("");
    return(
<div>
    <input type="text" placeholder="Recherche un produit" value={research} onChange={(e)=>setResearch(e.target.value)} />
</div>
    )
}

export default Search