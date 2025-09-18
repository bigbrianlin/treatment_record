import "@/styles/globals.css";
import Layout from "@/components/Layout/Layout";
import { AuthProvider } from "@/context/authContext";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <AuthProvider>
      {/* use getLayout */}
      {getLayout(<Component {...pageProps} />)}
    </AuthProvider>
  );
}
