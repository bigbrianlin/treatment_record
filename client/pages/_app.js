import "@/styles/globals.css";
import Layout from "@/components/Layout/Layout";
import { AuthProvider } from "@/context/authContext";
import AuthGuard from "@/components/auth/AuthGuard";

export default function App({ Component, pageProps }) {
  const authConfig = Component.auth || false;
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  const pageWithLayout = getLayout(<Component {...pageProps} />);

  return (
    <AuthProvider>
      {authConfig ? <AuthGuard authConfig={authConfig}>{pageWithLayout}</AuthGuard> : pageWithLayout}
    </AuthProvider>
  );
}
