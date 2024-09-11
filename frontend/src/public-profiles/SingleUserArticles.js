function SingleUserArticles({currentPublicProfile}) {
    console.log(currentPublicProfile)
    return (
        <div>
            <h1 style={{color: "white"}}>Articles</h1>
            <hr style={{width: "95%"}}/>
            {
              currentPublicProfile?.articles?.length === 0 
              ? <h5>User Hasn't Posted Yet</h5>
              : 
              <h1>Display articles</h1>
            }

        </div>
    )
}
export default SingleUserArticles