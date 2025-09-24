import "@/styles/globals.css";
import Layout from "@/components/Layout/Layout";
import { AuthProvider } from "@/context/authContext";
import AuthGuard from "@/auth/AuthGuard";

export default function App({ Component, pageProps }) {
  const isAuthRequired = Component.auth || false;
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  const pageWithLayout = getLayout(<Component {...pageProps} />);

  return <AuthProvider>{isAuthRequired ? <AuthGuard>{pageWithLayout}</AuthGuard> : pageWithLayout}</AuthProvider>;
}
