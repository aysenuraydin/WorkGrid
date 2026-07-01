import React, { useEffect, useMemo } from 'react' 
import { RelationshipTablesItem } from './RelationshipTablesItem';
import { Datatable } from 'common/data/Datatable';
import { useRelationshipTables } from '../hooks/useRelationshipTables';
import { useDataTable } from 'context/DatatableContext';
import { useTenantContext } from 'context/TenantContext';
import { isBlogControl, isLockControl, isProductControl } from 'common/data/constans';

export const  RelationshipTables= ({  }) => {  
    const { tableList } =  useDataTable();   
    const { config: tenantConfig } = useTenantContext();
    const {
      showZoomControls, 
      containerRef,  
      fitToView,
      contentRef, 
      scale, 
      origin
    } = useRelationshipTables(Object.values(tableList))

    useEffect(() => {
        const timer = setTimeout(() => fitToView(), 100); 
        return () => clearTimeout(timer);
    }, []);

    const tables = useMemo(() => {
        let filteredList = Object.values(tableList);
        
        if (!tenantConfig.showECommerce) {
            filteredList = filteredList.filter(t => !isProductControl(t.name));
        }
        if (!tenantConfig.showBLog) {
            filteredList = filteredList.filter(t => !isBlogControl(t.name));
        } 
        if (!tenantConfig.showCrm) {
          filteredList = filteredList.filter(t => isLockControl(t.name));
        }
        
        filteredList = filteredList.filter(t => t.deletedAt == null);
        
        return filteredList
    }, [tableList, tenantConfig]);

    return (
        <div className="h-100 border rounded"
        style={{ position: "relative" }}>
            {showZoomControls && (
              <div
                className="p-2 border bg-soft-primary z-1 rounded"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "0 10px 0 10px",
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "center",
                  color: "white",
                  pointerEvents: "none",
                }}
              >
                {showZoomControls == "zoom-in" &&  <i className="fs-3 ri-zoom-in-line" />}
                {showZoomControls == "zoom-out" && <i className="fs-3 ri-zoom-out-line" />}
                {showZoomControls == "pan" &&      <i className="fs-3 mdi mdi-hand-back-right" />}
              </div>
            )}
              <div
                  ref={containerRef}
                  className="h-100"
                  style={{ overflow: "auto" }}
              >
                  <div style={{
                      width: `${1500 * scale}px`,
                      height: `${1200 * scale}px`,
                      position: "relative",
                  }}>
                      <div
                          ref={contentRef}
                          className="p-3"
                          style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              transform: `scale(${scale})`,
                              transformOrigin: `0 0`,  
                              width: "1500px",
                              height: "1200px",
                          }}
                      >
                        <svg
                          width={1500}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: "10000px",
                            height: "10000px",
                            pointerEvents: 'none',
                            zIndex: 999999,
                          }}
                        >

                          {(() => {
                            type T = Datatable & { isSeen: boolean; isOpen: boolean; zIndex: number; x: number; y: number };
                            const visible = (Object.values(tables) as T[]).filter(t => t.isSeen);
                            const byId = new Map<number, T>(visible.map(t => [t.id, t]));

                            const reverseIsMany = (fromId: number, toId: number): boolean => {
                              const target = byId.get(toId);
                              if (!target) return false;
                              const back = (target.foreignTablesFk ?? []).find(r => r.foreignTableId === fromId);
                              return back?.isMultiSelect === true;
                            };

                            const linkColumnName = (src: T, targetId: number): string | null => {
                              const col = src.columnsFk.find(c => c.realTableId === targetId);
                              return col?.name ?? null;
                            };

                            const drawn = new Set<string>();
                            const out: any[] = [];

                            visible.forEach(table => {
                              (table.foreignTablesFk ?? []).forEach((rel) => {
                                const toTable = byId.get(rel.foreignTableId);
                                if (!toTable) return;

                                const pairKey = [table.id, toTable.id].sort((a, b) => a - b).join("-");
                                if (drawn.has(pairKey)) return;
                                drawn.add(pairKey);

                                const targetMany = rel.isMultiSelect === true;
                                const sourceMany = reverseIsMany(table.id, toTable.id);

                                const card =
                                  targetMany && sourceMany ? "N—N" :
                                  targetMany || sourceMany ? "1—N" : "1—1";
                                const isNN = targetMany && sourceMany;
                                const color = "#94a3b8";

                                // Baglanan kolon adi (iki yonden hangisi varsa)
                                const colName =
                                  linkColumnName(table, toTable.id) ||
                                  linkColumnName(toTable, table.id) ||
                                  null;

                                const orderFirst = table.columnsFk.findIndex(c => c.realTableId === rel.foreignTableId) + 1;
                                const orderLast = toTable.columnsFk.findIndex(c => c.id);

                                const fromRight = table.x <= toTable.x;
                                const x1 = fromRight ? table.x + 301 : table.x;
                                const x2 = fromRight ? toTable.x : toTable.x + 301;
                                const y1 = table.isOpen ? table.y + 105 + 50 * orderFirst : table.y + 33;
                                const y2 = toTable.isOpen ? toTable.y + 105 + 50 * orderLast : toTable.y + 33;

                                const dx = Math.abs(x2 - x1);
                                const cOff = Math.max(60, dx * 0.4);
                                const c1x = fromRight ? x1 + cOff : x1 - cOff;
                                const c2x = fromRight ? x2 - cOff : x2 + cOff;
                                const path = `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;

                                const startMarker = sourceMany ? "url(#er-many-start)" : "url(#er-one-start)";
                                const endMarker   = targetMany ? "url(#er-many-end)"   : "url(#er-one-end)";

                                const midX = (x1 + x2) / 2;
                                const midY = (y1 + y2) / 2;

                                // Etiket metni: kardinalite + (varsa) kolon
                                const labelText = colName ? `${card}  ·  ${colName}` : card;
                                const labelW = Math.max(40, labelText.length * 7 + 16);

                                out.push(
                                  <g key={`rel-${pairKey}`} className="er-rel" style={{ pointerEvents: "stroke" }}>
                                    <path d={path} fill="none" stroke="transparent" strokeWidth={14}
                                          style={{ pointerEvents: "stroke", cursor: "pointer" }} />
                                    <path d={path} fill="none" stroke={color} strokeWidth={1.5}
                                          markerStart={startMarker} markerEnd={endMarker} className="er-line" />
                                    <g className="er-badge">
                                      <rect
                                        x={midX - labelW / 2} y={midY - 24}
                                        width={labelW} height={18} rx={9}
                                        fill="#fff" stroke={color} strokeWidth={1}
                                      />
                                      <text
                                        x={midX} y={midY - 11}
                                        textAnchor="middle" fontSize="11" fontWeight="700"
                                        fill={color} style={{ pointerEvents: "none" }}
                                      >
                                        {labelText}
                                      </text>
                                    </g>
                                  </g>
                                );
                              });
                            });

                            return out;
                          })()} 

                          <defs>
                            <marker id="er-one-end" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto">
                              <line x1="5" y1="1" x2="5" y2="9" stroke="#94a3b8" strokeWidth="1.5" />
                            </marker>

                            <marker id="er-one-start" markerWidth="10" markerHeight="10" refX="4" refY="5" orient="auto">
                              <line x1="5" y1="1" x2="5" y2="9" stroke="#94a3b8" strokeWidth="1.5" />
                            </marker>

                            <marker id="er-many-end" markerWidth="12" markerHeight="12" refX="2" refY="6" orient="auto">
                              <line x1="10" y1="6" x2="2" y2="2"  stroke="#94a3b8" strokeWidth="1.5" />
                              <line x1="10" y1="6" x2="2" y2="6"  stroke="#94a3b8" strokeWidth="1.5" />
                              <line x1="10" y1="6" x2="2" y2="10" stroke="#94a3b8" strokeWidth="1.5" />
                            </marker>

                            <marker id="er-many-start" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                              <line x1="2" y1="6" x2="10" y2="2"  stroke="#94a3b8" strokeWidth="1.5" />
                              <line x1="2" y1="6" x2="10" y2="6"  stroke="#94a3b8" strokeWidth="1.5" />
                              <line x1="2" y1="6" x2="10" y2="10" stroke="#94a3b8" strokeWidth="1.5" />
                            </marker>
                          </defs>

                          <style>{`
                            .er-rel .er-line  { transition: stroke-width .15s ease; }
                            .er-rel .er-badge { opacity: 0; transition: opacity .15s ease; }
                            .er-rel:hover .er-line  { stroke-width: 3; }
                            .er-rel:hover .er-badge { opacity: 1; }
                          `}</style>

                      <defs>
                        {/* "bir" — tek dik cizgi */}
                        <marker id="er-one-end" markerWidth="18" markerHeight="18" refX="12" refY="9" orient="auto">
                          <line x1="9" y1="3" x2="9" y2="15" stroke="#94a3b8" strokeWidth="1.5" />
                        </marker>
                        <marker id="er-one-start" markerWidth="18" markerHeight="18" refX="6" refY="9" orient="auto">
                          <line x1="9" y1="3" x2="9" y2="15" stroke="#94a3b8" strokeWidth="1.5" />
                        </marker>

                        {/* "cok" — catal ayak (crow's foot). Acik uc cizgiye dogru bakar. */}
                        <marker id="er-many-end" markerWidth="24" markerHeight="22" refX="2" refY="11" orient="auto">
                          <line x1="20" y1="11" x2="2" y2="3"  stroke="#4f46e5" strokeWidth="1.5" />
                          <line x1="20" y1="11" x2="2" y2="11" stroke="#4f46e5" strokeWidth="1.5" />
                          <line x1="20" y1="11" x2="2" y2="19" stroke="#4f46e5" strokeWidth="1.5" />
                        </marker>
                        <marker id="er-many-start" markerWidth="24" markerHeight="22" refX="22" refY="11" orient="auto">
                          <line x1="4" y1="11" x2="22" y2="3"  stroke="#4f46e5" strokeWidth="1.5" />
                          <line x1="4" y1="11" x2="22" y2="11" stroke="#4f46e5" strokeWidth="1.5" />
                          <line x1="4" y1="11" x2="22" y2="19" stroke="#4f46e5" strokeWidth="1.5" />
                        </marker>
                      </defs>

                      <style>{`
                        .er-rel .er-line  { transition: stroke-width .15s ease; }
                        .er-rel .er-badge { opacity: 0; transition: opacity .15s ease; }
                        .er-rel:hover .er-line  { stroke-width: 3; }
                        .er-rel:hover .er-badge { opacity: 1; }
                      `}</style>

                      <defs>
                        {/* "bir" tarafi: tek dik cizgi */}
                        <marker id="er-one" markerWidth="16" markerHeight="16" refX="10" refY="8" orient="auto">
                          <line x1="8" y1="3" x2="8" y2="13" stroke="#94a3b8" strokeWidth="1.5" />
                        </marker>

                        {/* "cok" tarafi: catal ayak (crow's foot) */}
                        <marker id="er-many" markerWidth="22" markerHeight="22" refX="2" refY="11" orient="auto">
                          <line x1="18" y1="11" x2="2" y2="4"  stroke="#4f46e5" strokeWidth="1.5" />
                          <line x1="18" y1="11" x2="2" y2="11" stroke="#4f46e5" strokeWidth="1.5" />
                          <line x1="18" y1="11" x2="2" y2="18" stroke="#4f46e5" strokeWidth="1.5" />
                        </marker>
                      </defs>

                      <style>{`
                        .er-rel .er-line { transition: stroke-width .15s ease, opacity .15s ease; }
                        .er-rel .er-label {
                          opacity: 0;
                          transition: opacity .15s ease;
                        }
                        .er-rel:hover .er-line {
                          stroke-width: 3;
                        }
                        .er-rel:hover .er-label {
                          opacity: 1;
                        }
                      `}</style>

                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="10"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 3.5, 0 7" fill="gray" />
                        </marker>
                      </defs>
                          <defs>
                            <marker
                              id="arrowhead"
                              markerWidth="10"
                              markerHeight="7"
                              refX="10"
                              refY="3.5"
                              orient="auto"
                            >
                              <polygon points="0 0, 10 3.5, 0 7" fill="gray" />
                            </marker>
                          </defs>
                        </svg>

                      {((Object.values(tables)) as ( Datatable & { isSeen: boolean, isOpen: boolean, zIndex: number, x:number, y:number  })[])
                        .filter(table => table?.isSeen)
                        .map(table => (
                          <RelationshipTablesItem
                            key={table?.id}         
                            table={table} 
                          />
                      ))}
                  </div>
                </div>
            </div>
        </div>
    )
}
