import Header from "./Header";
import Sidebar from "./Sidebar";
function Admin({ children }) {
    return (
        <div >

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2 p-0"><Sidebar /></div>

                    <div className="col-md-10 p-0" style={{ background: '#f5f6f8' }} >
                        <Header />
                        <div style={{ marginTop: '80px', minHeight: '89vh' }}>
                            {children}
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}
export default Admin;