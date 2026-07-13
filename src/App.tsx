import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { CookieConsent } from "@/components/CookieConsent";

// Pages
import EggReorder from "@/pages/EggReorder";
import Bread from "@/pages/Bread";
import BreadSuccess from "@/pages/BreadSuccess";
import UnderConstruction from "@/pages/UnderConstruction";
import NotFound from "@/pages/not-found";

// Only Eggs and Bread are "live" right now — every other page shows a
// friendly Under Construction placeholder instead. To bring a page
// back, swap its <UnderConstruction .../> line below for its real
// import (see the commented-out imports above as a reminder of what
// each route used to point to).
//
// import Home from "@/pages/Home";
// import Blog from "@/pages/Blog";
// import PostDetail from "@/pages/PostDetail";
// import Shop from "@/pages/Shop";
// import About from "@/pages/About";
// import Contact from "@/pages/Contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <UnderConstruction />} />
      <Route path="/blog" component={() => <UnderConstruction pageName="Farm Journal" />} />
      <Route path="/blog/:slug" component={() => <UnderConstruction pageName="Farm Journal" />} />
      <Route path="/shop" component={() => <UnderConstruction pageName="Shop" />} />
      <Route path="/eggs" component={EggReorder} />
      <Route path="/bread/success" component={BreadSuccess} />
      <Route path="/bread" component={Bread} />
      <Route path="/about" component={() => <UnderConstruction pageName="Our Story" />} />
      <Route path="/contact" component={() => <UnderConstruction pageName="Contact" />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
      <ScrollToTop />
      <main className="flex-grow">
        <Router />
      </main>
      <Footer />
      <Toaster />
      <CookieConsent />
    </QueryClientProvider>
  );
}

export default App;
