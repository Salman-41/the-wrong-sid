import { Entrance } from "@/components/entrance";
import { HomepageFeatures, HomepageFooter } from "@/components/homepage-features";
import "@/components/homepage.css";

export default function Page() {
  return <>
    <main id="main-content" tabIndex={-1}>
      <Entrance />
      <HomepageFeatures />
    </main>
    <HomepageFooter />
  </>;
}
