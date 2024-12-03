import ApprovedWriters from "./writer-requests/ApprovedWriters"
import WriterRequests from "./writer-requests/WriterRequests"
import AllUsersList from "./users/AllUsersList"
import CreateTag from "./admin-tags/TagsPage"
import TagsPage from "./admin-tags/TagsPage"

function AdminPages({
    setSelectedBox, selectedBox, writerRequests, setWriterRequests,
    approvedWriters, allUsers
}) 
{

    function goToPage() {
        if (selectedBox === "writerRequests") {
            return <WriterRequests 
                    setSelectedBox={setSelectedBox} 
                    selectedBox={selectedBox}
                    writerRequests={writerRequests} 
                    setWriterRequests={setWriterRequests}
                    />
        }  else if (selectedBox == "approvedWriters") {
            return <ApprovedWriters 
                    approvedWriters={approvedWriters} 
                    setSelectedBox={setSelectedBox}
                    selectedBox={selectedBox}
                    />
        } else if (selectedBox === "allUsers") {
            return <AllUsersList 
                    allUsers={allUsers}
                    selectedBox={selectedBox}
                    setSelectedBox={setSelectedBox}
                    />
        } else if (selectedBox === "tags") {
            return <TagsPage 
                    selectedBox={selectedBox}
                    setSelectedBox={setSelectedBox}
                    />
        }
    }

    return (
        <div>
        {goToPage()}
        </div>
    )
}
export default AdminPages