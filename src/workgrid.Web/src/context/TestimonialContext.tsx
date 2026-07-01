import React, { createContext, useContext, ReactNode } from "react";
import {
    useGetTestimonials,
    useCreateTestimonial,
    useUpdateTestimonial,
    useDeleteTestimonial,
} from "hooks/useTestimonials";
import { ITestimonial } from "common/data/tenant";

interface TestimonialsContextValue {
    testimonials: ITestimonial[];
    isLoading: boolean;
    isError: boolean; 
    createTestimonial: (data: ITestimonial) => void;
    updateTestimonial: (id: string, data: Partial<ITestimonial>) => void;
    deleteTestimonial: (id: string) => void;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

const TestimonialsContext = createContext<TestimonialsContextValue | undefined>(undefined);

export const TestimonialsProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, isError } = useGetTestimonials();
    const { mutate: create, isPending: isCreating } = useCreateTestimonial();
    const { mutate: update, isPending: isUpdating } = useUpdateTestimonial();
    const { mutate: remove, isPending: isDeleting } = useDeleteTestimonial();

    const value: TestimonialsContextValue = {
        testimonials: data ?? [],
        isLoading,
        isError,
        createTestimonial: create,
        updateTestimonial: (id, data) => update({ id, data }),
        deleteTestimonial: remove,
        isCreating,
        isUpdating,
        isDeleting,
    };

    return (
        <TestimonialsContext.Provider value={value}>
            {children}
        </TestimonialsContext.Provider>
    );
};

export const useTestimonialsContext = () => {
    const ctx = useContext(TestimonialsContext);
    if (!ctx) throw new Error("useTestimonialsContext must be used within TestimonialsProvider");
    return ctx;
};

