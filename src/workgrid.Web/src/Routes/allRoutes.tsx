import React from "react";

//AuthenticationInner pages
import BasicSignIn from '../pages/AuthenticationInner/Login/BasicSignIn';
import BasicSignUp from '../pages/AuthenticationInner/Register/BasicSignUp';
import BasicPasswReset from '../pages/AuthenticationInner/PasswordReset/BasicPasswReset'; 

import BasicLockScreen from '../pages/AuthenticationInner/LockScreen/BasicLockScr';
import BasicLogout from '../pages/AuthenticationInner/Logout/BasicLogout';
import BasicSuccessMsg from '../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg';
import BasicTwosVerify from '../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify';
import Basic404 from '../pages/AuthenticationInner/Errors/Basic404';
import Alt404 from '../pages/AuthenticationInner/Errors/Alt404';
import Error500 from '../pages/AuthenticationInner/Errors/Error500';

import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

//login
// import Logout from "pages/Authentication/Logout";
import Login from "pages/Authentication/Login";
import Register from "pages/Authentication/Register";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";
import { MainMenuItems } from "pages/MenuItems";

import { ForgetPasswordPage } from "pages/Authentication/ForgetPassword";
import { MainDatatables } from "pages/Crm/Datatables";
import { MainDatatableItem } from "pages/Crm/DatatableItem";
import { MainCreateOrUpdatePage } from "pages/Crm/DatatableItem/CreateRow/components/MainCreateOrUpdatePage";
import { Profile } from "pages/Profile";
import Team from "pages/Team/Team";
import SearchResults from "pages/SearchResults/SearchResults";
import TermsCondition from "pages/TermsCondition";
import PrivacyPolicy from "pages/PrivacyPolicy";
import { UserManagementPage } from "pages/Users";
import { RoleManagementPage } from "pages/Roles";
import Documents from "pages/Documents";  
import EcommerceProducts from "pages/Ecommerce/EcommerceProducts";
import EcommerceProductDetail from "pages/Ecommerce/EcommerceProducts/EcommerceProductDetail";
import EcommerceAddProduct from "pages/Ecommerce/EcommerceProducts/EcommerceAddProduct";
import EcommerceOrders from "pages/Ecommerce/EcommerceOrders";
import EcommerceOrderDetail from "pages/Ecommerce/EcommerceOrders/EcommerceOrderDetail";
import EcommerceCustomers from "pages/Ecommerce/EcommerceCustomers";
import EcommerceCart from "pages/Ecommerce/EcommerceCart";
import EcommerceCheckout from "pages/Ecommerce/EcommerceCheckout";
import Chat from "pages/Chat";
import { ProfileSettings } from "pages/Profile/ProfileSettings";
import { TaskKanbanboard } from "pages/Tasks/Kanban/TasksKanban"
import ProjectsPage from "pages/Tasks/Project/ProjectsPage";
import { TaskDetails } from "pages/Tasks/TaskDetails";
import ToDoList from "pages/Tasks/ToDoList";
import Calendar from "pages/Calendar";
import OnePage from "pages/Landing";
import { TenantSettings } from "pages/Tenant";
import { FeatureGuard } from "./FeatureGuard";
import { Dashboard } from "pages/Dashboard";
import BlogListView from "pages/Blog";
import PageBlogOverview from "pages/Blog/Pages/PageBlogOverview";
import CreateBlog from "pages/Blog/Pages/CreateBlog";
import { CommentItemType } from "common/data/comment";
import { CommentPanel } from "pages/Comment/Commentpanel";  
import EcommerceWishlist from "pages/Ecommerce/EcommerceWishlist";
import EcommerceCoupons from "pages/Ecommerce/EcommerceProducts/EcommerceCoupons";
import EcommerceUserOrders from "pages/Ecommerce/EcommerceOrders/EcommerceUserOrders";
import InvoiceDetails from "pages/Ecommerce/InvoiceDetails";
import EcommerceHome from "pages/Ecommerce/EcommerceHome";
import Gallery from "pages/Gallery/Gallery";
import { MainFaqsPage } from "pages/Faqs/Faqs";
import Contacts from "pages/Contacts/Contacts";
import About from "pages/About";
import Basic403 from "pages/AuthenticationInner/Errors/Basic403";


const withGuard = (component: React.ReactNode, featureKey: string) => (
  <FeatureGuard featureKey={featureKey}>
    {component}
  </FeatureGuard>
);
const withGuardByRoles = (component: React.ReactNode, featureKey: string, allowedRoles:string[]) => (
  <FeatureGuard featureKey={featureKey} allowedRoles={[...allowedRoles]}>
    {component}
  </FeatureGuard>
);
const STAFF_ROLES = ["WG", "Admin", "User"]; 
const ADMIN_ROLES =  ["WG", "Admin"];
const authProtectedRoutes = [  

{ 
  path: "/datatables", 
  component: withGuardByRoles(<MainDatatables />, "showCrm", STAFF_ROLES) 
},
{ 
  path: "/datatable/:id", 
  component: withGuardByRoles(<MainDatatableItem />, "showCrm", STAFF_ROLES) 
},
{ 
  path: "/datatable-view/:id", 
  component: withGuardByRoles(<MainCreateOrUpdatePage />, "showCrm", STAFF_ROLES) 
},

  //MenuItemList
  { 
    path: "/menuItems", 
    component: withGuardByRoles(
      <MainMenuItems />, 
      "",
      ADMIN_ROLES
    ) 
  },
  { 
    path: "/users", 
    component: withGuardByRoles(
      <UserManagementPage />, 
      "",
      ADMIN_ROLES
    ) 
  },
  { 
    path: "/roles", 
    component: withGuardByRoles(
      <RoleManagementPage />, 
      "",
      ADMIN_ROLES
    ) 
  },
  
  //profile
  { path: "/user-profile", component: <UserProfile /> },
  { path: "/profile/:id", component: <Profile /> },
  { 
    path: "/profile-settings", 
    component: withGuard(
      <ProfileSettings />, 
      ""
    ) 
  },

  { path: "/documents", component: <Documents /> },
  { path: "/team", component: withGuardByRoles(<Team />, "", STAFF_ROLES) },
  
  //Calendar
  { 
    path: "/calendar", 
    component: withGuardByRoles(<Calendar />, "showCalendar", STAFF_ROLES) 
  },

  //Chat
  { 
    path: "/chat", 
    component: withGuardByRoles(<Chat />, "showChat", STAFF_ROLES) 
  },

  //Task
  { 
    path: "/projects", 
    component: withGuardByRoles(<ProjectsPage />, "showTask", STAFF_ROLES) 
  },
  { 
    path: "/kanbanboard", 
    component: withGuardByRoles(<TaskKanbanboard />, "showTask", STAFF_ROLES) 
  },
  { 
    path: "/taskDetails/:id", 
    component: withGuardByRoles(<TaskDetails />, "showTask", STAFF_ROLES) 
  },
  { 
    path: "/toDoList", 
    component: withGuardByRoles(<ToDoList />, "showTask", STAFF_ROLES) 
  },

  //Blogs 
  { 
    path: "/blog-create", 
    component: withGuardByRoles(
      <CreateBlog />, 
      "showECommerce",
      ADMIN_ROLES
    ) 
  },
  { 
    path: "/blog-edit/:id", 
    component: withGuardByRoles(
      <CreateBlog />, 
      "showECommerce",
      ADMIN_ROLES
    ) 
  },
  { 
    path: "/comment-panel-blog/:id", 
    component: withGuardByRoles(
      <CommentPanel itemType={CommentItemType.Blog} />, 
      "showECommerce",
      ADMIN_ROLES
    ) 
  },
  
  // File Manger
  // { path: "/file-manager", component: <FileManager /> },

  //Ecommerce
  { 
    path: "/comment-panel-product/:id", 
    component: withGuardByRoles(
      <CommentPanel itemType={CommentItemType.Product} />, 
      "showECommerce",
      ADMIN_ROLES
    ) 
  }, 

    { 
    path: "/add-product", 
    component: withGuardByRoles(
      <EcommerceAddProduct />, 
      "showECommerce",
      ADMIN_ROLES
    ) 
  },
  { 
    path: "/edit-product/:id", 
    component: withGuardByRoles(
      <EcommerceAddProduct />, 
      "showECommerce",
      ADMIN_ROLES
    ) 
  },
  { 
    path: "/wishlist", 
    component: withGuard(
      <EcommerceWishlist />, 
      "showECommerce"
    ) 
  },
  { 
    path: "/coupons", 
    component: withGuardByRoles(
      <EcommerceCoupons />, 
      "showECommerce",
      ADMIN_ROLES
    ) 
  },
  { 
    path: "/orders", 
    component: withGuard(
      <EcommerceUserOrders />, 
      "showECommerce"
    ) 
  },
  { 
    path: "/admin-orders", 
    component: withGuardByRoles(
      <EcommerceOrders />, 
      "showECommerce",
      ADMIN_ROLES
    ) 
  },
  { 
    path: "/order-details/:id", 
    component: withGuard(
      <EcommerceOrderDetail />, 
      "showECommerce"
    ) 
  },
  { 
    path: "/invoice-details/:id", 
    component: withGuard(
      <InvoiceDetails />, 
      "showECommerce"
    ) 
  },
  { 
    path: "/customers", 
    component: withGuardByRoles(
      <EcommerceCustomers />, 
      "showECommerce",
      ADMIN_ROLES
    ) 
  },
  { 
    path: "/cart", 
    component: withGuard(
      <EcommerceCart />, 
      "showECommerce"
    ) 
  },
  { 
    path: "/checkout", 
    component: withGuard(
      <EcommerceCheckout />, 
      "showECommerce"
    ) 
  },

  { 
    path: "/settings", 
    component: withGuardByRoles(
      <TenantSettings />, 
      "",
      ["WG"]
    ) 
  },
  { 
    path: "/dashboard", 
    exact: true,
    component: withGuard(
      <Dashboard />, 
      ""
    ) 
  },
  {
    path: "/",
    exact: true,
    component: <FeatureGuard />,
  },
  { 
    path: "*", 
    component: <FeatureGuard /> 
  },
];

const publicRoutes = [
  // { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
  
  { path: "/landing",     component: withGuard(<OnePage />, "showLanding") },

  //AuthenticationInner pages
  { path: "/auth-signin-basic", component: <BasicSignIn /> },
  { path: "/auth-signup-basic", component: <BasicSignUp /> },
  { path: "/auth-pass-reset-basic", component: <BasicPasswReset /> },
  { path: "/auth-lockscreen-basic", component: <BasicLockScreen /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  { path: "/auth-success-msg-basic", component: <BasicSuccessMsg /> },
  { path: "/auth-twostep-basic", component: <BasicTwosVerify /> },
  { path: "/auth-404-basic", component: <Basic404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> }, 
  { path: "/auth-pass-change-basic", component: <BasicPasswCreate /> }, 
  { path: "/auth-offline", component: <Offlinepage /> },
];

const publicLayoutRoutes = [
  { path: "/forbidden", component: <Basic403 /> },
  { path: "/about", component: <About /> },
  { path: "/gallery", component: <Gallery /> },
  { path: "/faqs", component: <MainFaqsPage /> },
  { path: "/contacts", component: <Contacts /> },
  { path: "/privacy-policy", component: <PrivacyPolicy /> },
  { path: "/terms-condition", component: <TermsCondition /> },
  { path: "/blog-list", component: withGuard(<BlogListView />, "showBLog") },
  { path: "/blog-detail/:id", component: withGuard(<PageBlogOverview />, "showBLog") },
  { path: "/store", component: withGuard(<EcommerceHome />, "showECommerce") },
  { path: "/products", component: withGuard(<EcommerceProducts />, "showECommerce") },
  { path: "/product-detail/:id", component: withGuard(<EcommerceProductDetail />, "showECommerce") },
  { path: "/search-results", component: <SearchResults /> },
];

export { authProtectedRoutes, publicRoutes, publicLayoutRoutes };



