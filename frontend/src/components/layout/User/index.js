import Header from "./Header";
import Footer from "./Footer";
import { ChatBubble } from "../../shared/Chat";
import { useChatContext } from "../../../contexts/ChatContext";

function User({ children }) {
    const { user } = useChatContext();

    return (
        <div >
            <Header />
            <div className="">{children}</div>
            <Footer />
            <ChatBubble user={user} />
        </div>
    );
}
export default User;