import React, { FC, ReactNode } from "react";
import { Outlet, Link } from "react-router-dom";

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};

export default Layout;
