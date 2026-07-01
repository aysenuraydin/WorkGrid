import React, { useMemo, useState } from "react";
import CountUp from "react-countup";

import { useBoard } from "../../../hooks/useKanban";

import { Col,  Row, Card, CardBody } from "reactstrap"; 
import { KanbanStatus } from "common/enums/KanbanStatus";
import { KanbanBoardDto, KanbanCardDto } from "common/data/kanban";

interface WidgetDef {
  label:      string;
  status?:    KanbanStatus;
  icon:       string;
  iconClass:  string;  
  badgeClass: string;
  all?:       boolean;
}

const WIDGET_DEFS: WidgetDef[] = [
  {
    label:      "Toplam Görev",
    all:        true,
    icon:       "ri-task-line",
    iconClass:  "primary",
    badgeClass: "primary",
  },
  {
    label:      "Tamamlanan",
    status:     KanbanStatus.Completed,
    icon:       "ri-checkbox-circle-line",
    iconClass:  "success",
    badgeClass: "success",
  },
  {
    label:      "Devam Eden",
    status:     KanbanStatus.InProgress,
    icon:       "ri-loader-4-line",
    iconClass:  "warning",
    badgeClass: "warning",
  },
  {
    label:      "Bekleyen",
    status:     KanbanStatus.Pending,
    icon:       "ri-time-line",
    iconClass:  "danger",
    badgeClass: "danger",
  },
  {
    label:      "Yeni",
    status:     KanbanStatus.New,
    icon:       "ri-add-circle-line",
    iconClass:  "info",
    badgeClass: "info",
  },
];

interface KanbanWidgetsProps { projectId: string | null; }

export const KanbanWidgets: React.FC<KanbanWidgetsProps> = ({ projectId }) => {
  const { data: board } = useBoard(projectId);

  const allCards: KanbanCardDto[] = useMemo(
    () => (board ?? []).flatMap((col:KanbanBoardDto) => col.cards ?? []),
    [board]
  );

  const countByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    allCards.forEach(c => {
      map[c.status] = (map[c.status] ?? 0) + 1;
    });
    return map;
  }, [allCards]);

  return (
    <Row className="mb-3">
      {WIDGET_DEFS.map((w, i) => {
        const count = w.all
          ? allCards.length
          : countByStatus[w.status!] ?? 0;

        const total    = allCards.length || 1;
        const pct      = w.all ? 100 : Math.round((count / total) * 100);

        return (
          <Col xl={2} lg={3} md={4} sm={6} key={i}>
            <Card className="card-animate border border-1" style={{cursor:"pointer"}}>
              <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="fw-medium text-muted mb-0 text-truncate">{w.label}</p>
                    <h2 className="mt-3 mb-2 ff-secondary fw-semibold">
                      <CountUp start={0} end={count} duration={1.5} />
                    </h2>
                  </div>
                  <div className="flex-shrink-0 ms-2">
                    <div className="avatar-sm">
                      <span className={`avatar-title rounded-circle fs-4 bg-${w.iconClass}-subtle text-${w.iconClass}`}>
                        <i className={w.icon} />
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mb-0 text-muted fs-12 ">
                  <span className={`badge bg-${w.badgeClass}-subtle text-${w.badgeClass} mb-0`}>
                    %{pct}
                  </span>
                  <span className="ms-2 text-muted">toplam içinde</span>
                </p>
              </CardBody>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};


























