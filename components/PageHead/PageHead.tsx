import Head from "next/head";
import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children?: ReactNode;
};
const PageHead = ({ title, description, children }: Props) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {children}
    </Head>
  );
};

export default PageHead;
