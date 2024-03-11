import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { redirect } from "../utils";

const Main: React.FC<PageProps> = () => {
  React.useEffect(() => {
    redirect("/login", []); // Assuming "/login" is the path to your login page
  }, []); // Empty dependency array ensures this effect runs only once, on mount

  return (
    <>
    </>
  );
};

export const Head: HeadFC = () => (
  <>
    <title>Cognoso</title>
    <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
  </>
);

export default Main;
