import { Spinner } from "reactstrap"; 

type TabId = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

const TABS: { id: TabId; label: string; icon: string }[] = [
    { id: "1", label: "Tema",          icon: "ri-palette-line" },
    { id: "2", label: "Plans",         icon: "ri-price-tag-3-line" },
    { id: "3", label: "SSS",           icon: "ri-question-answer-line" },
    { id: "4", label: "İstatistikler", icon: "ri-bar-chart-box-line" },
    { id: "5", label: "Hizmetler",     icon: "ri-stack-line" },
    { id: "6", label: "Sosyal",        icon: "ri-share-line" },
    { id: "7", label: "Marka",         icon: "ri-building-4-line" },
    { id: "8", label: "Yorumlar",      icon: "ri-star-line" },
    { id: "9", label: "Projeler",      icon: "ri-briefcase-line" },
];

/** Yükleniyor göstergesi */
export const LoadingState = () => (
    <div className="text-center py-5">
        <Spinner color="primary" />
        <p className="text-muted mt-2 fs-13">Yükleniyor...</p>
    </div>
);
