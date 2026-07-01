import { SocialLinksProvider } from "./SocialLinksContext";
import { ServicesProvider } from "./ServicesContext";
import { PlansProvider } from "./PlansContext";
import { FaqProvider } from "./FaqContext";
import { StatsProvider } from "./StatsContext";
import { TestimonialsProvider } from "./TestimonialContext";
import { WorksProvider } from "./WorksContext";
import { BrandProvider } from "./BrandContext";
import { ContactProvider } from "./ContactContext";
import { ReactNode } from "react";
import { ClientItemsProvider } from "./ClientItemsContext";
import { FeaturesProvider } from "./FeaturesContext";
import { AboutProvider } from "./AboutContext";
import { GalleryProvider } from "./Gallerycontext";

export const TenantSettingsProviders = ({ children }: { children: ReactNode }) => (
    <SocialLinksProvider> 
        <ServicesProvider>
            <PlansProvider>
                <FaqProvider>
                    <StatsProvider>
                        <TestimonialsProvider>
                            <WorksProvider>
                                <BrandProvider>
                                    <ClientItemsProvider>
                                        <ContactProvider>
                                            <FeaturesProvider>
                                                <AboutProvider>
                                                    <GalleryProvider>
                                                        {children}
                                                    </GalleryProvider>
                                                </AboutProvider>
                                            </FeaturesProvider>
                                        </ContactProvider>
                                    </ClientItemsProvider>
                                </BrandProvider>
                            </WorksProvider>
                        </TestimonialsProvider>
                    </StatsProvider>
                </FaqProvider>
            </PlansProvider>
        </ServicesProvider>
    </SocialLinksProvider>
);