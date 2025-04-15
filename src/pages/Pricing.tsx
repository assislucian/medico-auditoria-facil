
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import PricingPlans from "@/components/PricingPlans";

const PricingPage = () => {
  return (
    <>
      <Helmet>
        <title>Planos e Preços | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={false} />
        <div className="flex-1 container py-12 md:py-16">
          <PricingPlans />
        </div>
      </div>
    </>
  );
};

export default PricingPage;
