import React, { useState, useEffect } from "react";
import {
    Card, CardBody, Row, Col, Input
} from "reactstrap";
import { IStatsSection } from "common/data/tenant";
import { useStatsContext } from "context/StatsContext";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { SectionHead } from "./SectionHead";
import { SaveButton } from "./SaveButton";
import { useTenantContext } from "context/TenantContext";
import { getContrastIconClass } from "common/utils/getContrastIconClass";
import useThemeMode from "hooks/useThemeMode";

const STATS_META = [
    { key: "projectsCompleted", label: "Tamamlanan projeler", icon: "ri-briefcase-line" },
    { key: "awardsWon",         label: "Kazanılan ödüller",   icon: "ri-medal-line" },
    { key: "satisfiedClients",  label: "Mutlu müşteriler",    icon: "ri-user-smile-line" },
    { key: "employees",         label: "Ekip üyesi",          icon: "ri-team-line" },
] as const;

export const StatsAdminPage = () => {
    const { isDark } = useThemeMode();
    const { config: tenantConfig} = useTenantContext();
    const { stats: serverStats, isLoading, isError, saveStats, isSaving } = useStatsContext();
    const [stats, setStats] = useState<IStatsSection | undefined>(undefined);

    const inputClasses = `border-0 p-3 shadow-none fs-24 fw-bold text-center ${isDark ? "bg-dark text-light" : "bg-light text-dark"}`;

    useEffect(() => { if (serverStats) setStats(serverStats); }, [serverStats]);

    if (isLoading) return <LoadingState />;
    if (isError)   return <ErrorState />;
    if (!stats)    return null;

    const update = (key: keyof IStatsSection, value: number) =>
        setStats(prev => prev ? { ...prev, [key]: value } : prev);

    return (
        <div>
            <SectionHead icon="ri-bar-chart-box-line" title="İstatistik sayaçları" subtitle="Ana sayfada görünen sayısal değerleri düzenleyin" />
            <Row className="g-3">
                {STATS_META.map(({ key, label, icon }) => (
                    <Col lg={3} md={6} key={key}>
                        <Card className="mb-0 h-100 border border-2">
                            <CardBody className="p-4">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="avatar-sm bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center flex-shrink-0">
                                        <i className={`${icon} ${getContrastIconClass("var(--vz-primary)")} fs-20`}/>
                                    </div>
                                    <span className="fw-medium fs-13 text-muted">{label}</span>
                                </div>
                                <Input
                                    type="number"
                                    value={stats[key]}
                                    onChange={e => update(key, Number(e.target.value))}
                                    lassName={inputClasses}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
            <SaveButton onClick={() => saveStats(stats)} isSaving={isSaving} />
        </div>
    );
};
