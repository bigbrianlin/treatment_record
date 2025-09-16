import Link from "next/link";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout>
      <div>
        <h1>這是網站首頁。</h1>
        <Link href="/newPage">新的頁面。</Link>
        <Link href="/posts/edit-post">編輯post</Link>
      </div>
    </Layout>
  );
}
