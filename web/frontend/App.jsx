import { BrowserRouter, NavLink } from "react-router-dom";
import { NavMenu } from "@shopify/app-bridge-react";
import { Provider } from "react-redux";
import { QueryProvider, PolarisProvider } from "./components";
import store from "./redux/store";
import Routes from "./Routes";
import { useTranslation } from "react-i18next";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <Provider store={store}>
        <BrowserRouter>
          <QueryProvider>
            <NavMenu>
              <NavLink to="/" rel="home" className='active'></NavLink>
              <NavLink to="/ManageCustomers">Manage Customers</NavLink>
              <NavLink to="/ManageProducts">Manage Products</NavLink>
            </NavMenu>
            <Routes pages={pages} />
          </QueryProvider>
        </BrowserRouter>
      </Provider>
    </PolarisProvider>
  );
}
