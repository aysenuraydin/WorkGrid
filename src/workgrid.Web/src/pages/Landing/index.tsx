import React from 'react';
import Navbar from './components/navbar';
import Home from './components/home';
import Client from './components/client';
import Services from './components/services';
import Features from './components/features';
import Plans from './components/plans';
import Faqs from './components/faq';
import Reviews from './components/reviews';
import Counter from './components/counter';
import WorkProcess from './components/workProcess';
import Team from './components/team';
import Contact from './components/contact';
import Cta from './components/cta';
import Footer from './components/footer';
import { TenantSettingsProviders } from 'context/TenantsettingContext';
import { useGetBrand } from 'hooks/useBrand';

const Index = () => {
    const { data:brand } = useGetBrand();
    document.title = "Landing | " +(brand?.companyName || "Workgrid");

    window.onscroll = function () {
        scrollFunction();
    };

    const scrollFunction = () => {
        const element = document.getElementById("back-to-top");
        if (element) {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        }
    };

    const toTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    return (
        <React.Fragment>
            <div className="layout-wrapper landing">
                <TenantSettingsProviders>
                    <Navbar />
                    <Home />
                    <Client />
                    <Services />
                    <Features />
                    <Plans />
                    <Faqs />
                    <Reviews />
                    <Counter />
                    <WorkProcess />
                    <Team />
                    <Contact />
                    <Cta />
                    <Footer />
                </TenantSettingsProviders>
                <button onClick={() => toTop()} className="btn btn-danger btn-icon landing-back-top" id="back-to-top">
                    <i className="ri-arrow-up-line"></i>
                </button>
            </div>
        </React.Fragment>
    );
};

export default Index;