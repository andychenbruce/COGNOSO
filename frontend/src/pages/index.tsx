import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";

const Main: React.FC<PageProps> = () => {
  return (
    <>
      <p>
        <a href="/login">login</a>
      </p>
      <p>
        <a href="/flashcard_viewer">view flashcards</a>
      </p>
      <p>
        <a href="/acc_create">acc_create</a>
      </p>
      <p>
        <a href="home_page">home_page</a>
      </p>
      <p>bruh bruh</p>
    </>
  );
};

export const Head: HeadFC = () => (
  <>
    <title>poopoo</title>
    <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
  </>
);

export default Main;
