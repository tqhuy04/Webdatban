import Header from "./Header";
import Footer from "./Footer";
import { ChatBubble } from "../../shared/Chat";

function User({ children }) {
    return (
        <div >
            <Header />
            <div className="">{children}</div>
            <Footer />
            <ChatBubble />
        </div>
    );
}
export default User;