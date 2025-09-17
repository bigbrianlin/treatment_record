import Head from "next/head";
import Link from "next/link";
// import styles from "./layout.module.css";
import React from "react";

const Navbar = () => (
  <header style={{ padding: "1rem", backgroundColor: "#f0f0f0", borderBottom: "1px solid #ddd" }}>
    我是導覽列 (Navbar)
  </header>
);

const Footer = () => (
  <footer style={{ padding: "1rem", backgroundColor: "#f0f0f0", borderTop: "1px solid #ddd", marginTop: "auto" }}>
    我是頁尾 (Footer)
  </footer>
);

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* `<main>` 標籤中的 `{children}` 就是您每個頁面的實際內容 */}
      <main style={{ flex: 1, padding: "1rem" }}>{children}</main>

      <Footer />
    </div>
  );
}
// const name = "Wilson";
// const websiteTitle = "Next.js練習網站";

// export default function Layout({ children, returnBack }) {
//   return (
//     <div className={styles.layout}>
//       <Head>
//         <meta charSet="utf-8" />
//         <meta
//           name="viewport"
//           content="width=device-width,initial-scale=1"
//         ></meta>
//         <meta name="author" content="Wilson" />
//       </Head>
//       <header className={styles.header}>
//         <h1>{websiteTitle}</h1>
//         <h2>作者:{name}</h2>
//       </header>
//       <main>{children}</main>
//       {returnBack && (
//         <Link className={styles.home} href="/">
//           回到首頁
//         </Link>
//       )}
//     </div>
//   );
// }
