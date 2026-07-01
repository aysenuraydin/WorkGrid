import React, { useMemo } from "react";
import CountUp from "react-countup";
import { Card, CardBody, Col, Row } from "reactstrap";

import { useGridbaseAll } from "hooks/useGridBase";
import { IOrder } from "common/data/ecommerce";
import { ORDER_TABLE } from "common/data/constans";

const CUR = "$";

const Widgets = () => {
  const { data: orders } = useGridbaseAll<IOrder>(ORDER_TABLE, {
    sort: "orderDate:desc",
  });

  const stats = useMemo(() => {
    const list = orders ?? [];

    const totalOrders = list.length;

    const revenue = list
      .filter((o) => o.status !== "cancelled" && o.status !== "returns")
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const pending = list.filter((o) => o.status == "pending").length;

    const cancelledOrReturned = list.filter(
      (o) => o.status == "cancelled" || o.status == "returns"
    ).length;

    return { totalOrders, revenue, pending, cancelledOrReturned };
  }, [orders]);

  const cards = [
    {
      label: "Toplam Gelir",
      counter: stats.revenue,
      prefix: CUR,
      suffix: "",
      separator: ",",
      decimals: 2,
      icon: "ri-money-dollar-circle-fill",
      link: "Tüm zamanlar",
    },
    {
      label: "Toplam Sipariş",
      counter: stats.totalOrders,
      prefix: "",
      suffix: "",
      separator: ",",
      decimals: 0,
      icon: "ri-shopping-bag-fill",
      link: "Tüm siparişler",
    },
    {
      label: "Bekleyen Sipariş",
      counter: stats.pending,
      prefix: "",
      suffix: "",
      separator: ",",
      decimals: 0,
      icon: "ri-time-fill",
      link: "İşlem bekliyor",
    },
    {
      label: "İptal / İade",
      counter: stats.cancelledOrReturned,
      prefix: "",
      suffix: "",
      separator: ",",
      decimals: 0,
      icon: "ri-close-circle-fill",
      link: "İptal ve iadeler",
    },
  ];

  return (
    <Row>
      {cards.map((item, key) => (
        <Col xl={3} md={6} key={key} className="p-1">
          <Card className="card-animate border border-2">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    {item.label}
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span className="counter-value">
                      <CountUp
                        start={0}
                        prefix={item.prefix}
                        suffix={item.suffix}
                        separator={item.separator}
                        end={item.counter}
                        decimals={item.decimals}
                        duration={2}
                      />
                    </span>
                  </h4>
                  <span className="text-muted text-decoration-underline">{item.link}</span>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span className={"avatar-title rounded fs-3 bg-primary-subtle"}>
                    <i className={`text-primary ${item.icon}`}></i>
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Widgets;