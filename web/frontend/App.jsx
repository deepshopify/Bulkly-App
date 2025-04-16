import { NavMenu } from "@shopify/app-bridge-react";
import { BrowserRouter, NavLink } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Routes from "./Routes";
import { QueryProvider, PolarisProvider } from "./components";
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
              <NavLink to="/ManageCustomers" className='active'>Manage Customers</NavLink>
              <NavLink to="/ManageProducts" className='active'>Manage Products</NavLink>
            </NavMenu>
            <Routes pages={pages} />
          </QueryProvider>
        </BrowserRouter>
      </Provider>
    </PolarisProvider>
  );
}
