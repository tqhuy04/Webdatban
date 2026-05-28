// ================== LAYOUT ==================
import Admin from "../components/layout/Admin";

// ================== USER PAGES ==================
import Home from "../pages/User/Home";
import Login from "../pages/User/Login";
import ProductDetails from "../pages/User/ProductDetails";
import Cart from "../pages/User/Cart";
import Checkout from "../pages/User/Checkout";
import Pay from "../pages/User/Pay";
import Thanks from "../pages/User/Thanks";
import Bookings from "../pages/User/Bookings";
import Bill from "../pages/User/Bill";
import Order from "../pages/User/Order";
import PersonalIn4 from "../pages/User/PersonalIn4";
import Show_booking from "../pages/User/show_booking";
import Show_bookingTable from "../pages/User/show_bookingTable";
import OrderDetail from "../pages/User/OrderDetail";
import FeedbackOFUser from "../pages/User/Feedback";
import Search from "../pages/User/Search";

// ================== ADMIN PAGES ==================
import HomeAd from "../pages/Admin/Home";
import Account from "../pages/Admin/Account";
import Customer from "../pages/Admin/Customer";
import Promotion from "../pages/Admin/Promotion";
import Table from "../pages/Admin/Table";
import Menu_category from "../pages/Admin/Menu_category";
import Menu_item from "../pages/Admin/Menu_item";
import Table_booking from "../pages/Admin/Table_booking";
import Booking_tableAdmin from "../pages/Admin/Booking_table";
import OrderAdmin from "../pages/Admin/Order";
import Order_detail from "../pages/Admin/Order_detail";
import Feedback from "../pages/Admin/Feedback";
import Settings from "../pages/Admin/Settings";
import Profile from "../pages/Admin/Profile";

// ================== USER ROUTES ==================
export const publicRoutes = [
  { path: "/", component: Home },
  { path: "/Login", component: Login },
  { path: "/ProductDetails/:id", component: ProductDetails },
  { path: "/Cart", component: Cart },
  { path: "/Checkout", component: Checkout },
  { path: "/Pay", component: Pay },
  { path: "/Thanks", component: Thanks },
  { path: "/Bookings", component: Bookings },
  { path: "/Bill", component: Bill },

  { path: "/Order/:BookingID", component: Order },

  { path: "/OrderDetail/:OrderID", component: OrderDetail },
  { path: "/PersonalIn4", component: PersonalIn4 },
  { path: "/Show_booking", component: Show_booking },
  { path: "/Show_bookingTable/:BookingID", component: Show_bookingTable },
  { path: "/Feedback", component: FeedbackOFUser },
  { path: "/Search", component: Search },
];

// ================== ADMIN ROUTES ==================
export const adminRoutes = [
  {
    path: "/Admin/Home",
    component: HomeAd,
    layout: Admin,
  },
  {
    path: "/Admin/Account",
    component: Account,
    layout: Admin,
  },
  {
    path: "/Admin/Customer",
    component: Customer,
    layout: Admin,
  },
  {
    path: "/Admin/Promotion",
    component: Promotion,
    layout: Admin,
  },
  {
    path: "/Admin/Table",
    component: Table,
    layout: Admin,
  },
  {
    path: "/Admin/Menu_category",
    component: Menu_category,
    layout: Admin,
  },
  {
    path: "/Admin/Menu_item",
    component: Menu_item,
    layout: Admin,
  },
  {
    path: "/Admin/Table_booking",
    component: Table_booking,
    layout: Admin,
  },
  {
    path: "/Admin/Booking_table/:BookingID/:CustomerID",
    component: Booking_tableAdmin,
    layout: Admin,
  },
  {
    path: "/Admin/Order/:BookingID/:CustomerID",
    component: OrderAdmin,
    layout: Admin,
  },
  {
    path: "/Admin/Order_detail/:OrderID",
    component: Order_detail,
    layout: Admin,
  },
  {
    path: "/Admin/Feedback",
    component: Feedback,
    layout: Admin,
  },
  {
    path: "/Admin/Settings",
    component: Settings,
    layout: Admin,
  },
  {
    path: "/Admin/Profile",
    component: Profile,
    layout: Admin,
  },
];
