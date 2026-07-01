import { useEffect, useState, memo } from "react";
import { Modal, ModalHeader, ModalBody, CardBody, Card, Col, Row, TabContent, TabPane, Nav, NavLink, NavItem } from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { PreviewCardHeaderChildren } from "components/Common/PreviewCardHeader";
import { EditRelation } from "./EditRelation";
import { EditColumns } from "./EditColumns";
import { EditValidations } from "./EditValidations";
import { EditModal } from "./EditModal";
import { EditTable } from "./EditTable";
import { EditDesign } from "./EditDesign";
import { EditFunction } from "./EditFunction";
import { useQueryClient } from "@tanstack/react-query";
import { EditOptions } from "./EditOptions";
import { EditRows } from "./EditRows";
import { useDataTable } from "context/DatatableContext";
import { TableRowProvider } from "context/TableRowContext";
import { TableColumnProvider } from "context/TableColumnContext";
import useThemeMode from "hooks/useThemeMode";
import { EditTableAccess } from "./EditTableAccess";

const TABS = [
    { id: "11", icon: "ri-table-line", label: "Tablo" },
    { id: "12", icon: "ri-lock-2-line", label: "İzinler" },
    { id: "1", icon: "ri-layout-column-line", label: "Sütunlar" },
    { id: "2", icon: "ri-layout-row-line", label: "Satırlar" },
    { id: "3", icon: "ri-links-line", label: "İlişkiler" },
    { id: "4", icon: "ri-shield-check-line", label: "Doğrulamalar" },
    { id: "5", icon: "ri-list-settings-line", label: "Seçenekler" },
    { id: "6", icon: "ri-palette-line", label: "Tasarımlar" },
    { id: "8", icon: "ri-function-line", label: "Fonksiyonlar" },
    { id: "10", icon: "ri-window-line", label: "Modal" },
];

export const EditSettings = memo(({ }) => {
    const { modal } = useDataTable();
    const { isDark } = useThemeMode();
    const queryClient = useQueryClient();

    const [verticalTab, setverticalTab] = useState("11");
    const toggleVertical = (tab: string) => {
        if (verticalTab !== tab) setverticalTab(tab);
    };

    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: ['GetTable', modal.table?.id] });
        };
    }, [modal.table?.id]);

    return (
        <Modal
            id="showModal"
            modalClassName="modal-fullscreen-md-down"
            isOpen={modal.editSettingModal}
            toggle={modal.settingToggle}
            size="xl"
            centered
            scrollable
        >
            <ModalHeader className={`bg-${isDark ? 'dark' : 'light'} p-3`} toggle={modal.settingToggle}>
                Düzenleme Ayarları
            </ModalHeader>
            <ModalBody className="p-2 p-md-3">
                <Card className="border mb-0" style={{ height: "min(40rem, 78vh)" }}>
                    <PreviewCardHeaderChildren>
                        <h4 className="card-title mb-0 flex-grow-1 text-truncate">
                            <Link to="#" onClick={(e) => e.preventDefault()} className="fw-medium link-primary">
                                #{modal.table?.id}
                            </Link>
                            {" "}{modal.table?.name}
                        </h4>
                    </PreviewCardHeaderChildren>

                    <CardBody className="position-relative" style={{ height: "calc(100% - 70px)" }}>
                        <Row className="h-100 g-2">
                            {/* ── Sol navigasyon: md+ dikey kolon, sm yatay scroll şerit ── */}
                            <Col xs={12} md={2} className="h-md-100">
                                <Nav
                                    pills
                                    id="v-pills-tab"
                                    className="flex-row flex-md-column flex-nowrap flex-md-wrap
                                               hide-scrollbar gap-1 pb-2 pb-md-0 mb-2 mb-md-0
                                               border-bottom border-md-0"
                                    style={{ overflowX: "auto", overflowY: "hidden" }}
                                >
                                    {TABS.map(t => (
                                        <NavItem key={t.id} className="flex-shrink-0">
                                            <NavLink
                                                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                                                className={classnames({
                                                    "mb-md-2 text-nowrap": true,
                                                    "link-primary": verticalTab === t.id,
                                                })}
                                                onClick={() => toggleVertical(t.id)}
                                                title={t.label}
                                            >
                                                <i className={`${t.icon} fs-16 me-1 me-md-2`}></i>
                                                <span className="d-none d-sm-inline">{t.label}</span>
                                            </NavLink>
                                        </NavItem>
                                    ))}
                                </Nav>
                            </Col>

                            {/* ── İçerik: kalan yüksekliği kaplar, kendi içinde scroll ── */}
                            <Col xs={12} md={10} className="hide-scrollbar" style={{ overflow: "auto", minHeight: 0 }}>
                                <TabContent activeTab={verticalTab} className="text-muted mt-2 mt-md-0" id="v-pills-tabContent">
                                    {verticalTab === "11" && <TabPane className="h-100" tabId="11"><EditTable /></TabPane>}
                                    {verticalTab === "12" && <TabPane className="h-100" tabId="12"><EditTableAccess /></TabPane>}
                                    {verticalTab === "1" && <TabPane className="h-100" tabId="1"><TableColumnProvider><EditColumns isSettings={true} /></TableColumnProvider></TabPane>}
                                    {verticalTab === "2" && <TabPane className="h-100" tabId="2"><TableRowProvider table={modal.table}><EditRows isSettings={true} table={modal.table} /></TableRowProvider></TabPane>}
                                    {verticalTab === "3" && <TabPane className="h-100" tabId="3"><EditRelation isSettings={true} /></TabPane>}
                                    {verticalTab === "4" && <TabPane className="h-100" tabId="4"><EditValidations /></TabPane>}
                                    {verticalTab === "5" && <TabPane className="h-100" tabId="5"><EditOptions /></TabPane>}
                                    {verticalTab === "6" && <TabPane className="h-100" tabId="6"><EditDesign /></TabPane>}
                                    {verticalTab === "8" && <TabPane className="h-100" tabId="8"><EditFunction /></TabPane>}
                                    {verticalTab === "10" && <TabPane className="h-100" tabId="10"><EditModal verticalTab={verticalTab} /></TabPane>}
                                </TabContent>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </ModalBody>
        </Modal>
    );
});