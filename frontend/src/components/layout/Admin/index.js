import Header from "./Header";
import Sidebar from "./Sidebar";
import Chat from "../../../pages/Admin/Chat";

function Admin({ children }) {
    return (
        <div >
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2 p-0"><Sidebar /></div>

                    <div className="col-md-10 p-0 admin-main-column">
                        <Header />
                        <div className="admin-main-body">
                            {children}
                        </div>

                    </div>
                </div>
            </div>
            <Chat />
        </div>
    );
}
export default Admin;