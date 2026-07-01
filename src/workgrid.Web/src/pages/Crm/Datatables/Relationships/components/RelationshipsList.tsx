import { Accordion, AccordionBody, AccordionHeader, AccordionItem, ListGroup, ListGroupItem, Alert } from 'reactstrap';
import Loader from 'components/Common/Loader';  
import { useRelationshipList } from '../hooks/useRelationshipList';
import { useDataTable } from 'context/DatatableContext';
import { useMemo } from 'react';
import { isBlogControl, isLockControl, isProductControl } from 'common/data/constans';
import { useTenantContext } from 'context/TenantContext';

export const RelationshipList = () => {
    const { config: tenantConfig } = useTenantContext();
    const { setTableList, tableList, tablesRelationships, tablesRelationshipsError } = useDataTable();
    const { openFlush, toggleFlush, changeVisible } = useRelationshipList(setTableList);

    const { normalTables, lockedTables } = useMemo(() => {
        const allTables = Object.values(tableList);

        let filteredList = allTables;
        
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
        return {
            normalTables: filteredList.filter(t => !isLockControl(t.name)),
            lockedTables: filteredList.filter(t => isLockControl(t.name))
        };
    }, [tableList, tenantConfig]); 

    return (
        <>
            <Accordion flush open={openFlush} toggle={toggleFlush}> 
                <AccordionItem>
                    <AccordionHeader targetId="1">Veri Tabloları</AccordionHeader>
                    <AccordionBody accordionId="1">
                        <ListGroup className='max-h'>
                            {!!tablesRelationships?.succeeded ? (
                                // Tablo varsa listele, yoksa bilgi mesajı göster
                                normalTables.length > 0 ? (
                                    normalTables.map((table) => (
                                        <ListGroupItem className='mb-2 border rounded item-hover' tag="label" key={table.id} onClick={() => changeVisible(table?.id)}>
                                            {table?.isSeen ? <i className="fs-5 text-primary ri-eye-fill"></i> : <i className="fs-5 text-muted ri-eye-off-fill"></i>}
                                            {" "}{table.name}
                                        </ListGroupItem>
                                    ))
                                ) : (
                                    <Alert color="info" className="d-flex align-items-center gap-2 m-2">
                                        <i className="ri-information-line fs-5"></i>
                                        <span>Gösterilecek veri tablosu bulunamadı.</span>
                                    </Alert>
                                )
                            ) : (<Loader error={tablesRelationshipsError} />)}
                        </ListGroup>
                    </AccordionBody>
                </AccordionItem>
                            
                <AccordionItem>
                    <AccordionHeader targetId="2">
                        <i className={`ri-lock-fill fs-16 me-2`}></i>
                        Kilitli Tablolar 
                    </AccordionHeader>
                    <AccordionBody accordionId="2">
                        <ListGroup className='max-h'>
                            {/* Kilitli tablolar için boş kontrolü */}
                            {lockedTables.length > 0 ? (
                                lockedTables.map((table:any) => (
                                    <ListGroupItem className='mb-2 border rounded item-hover' tag="label" key={table.id} onClick={() => changeVisible(table?.id)}>
                                        {table?.isSeen ? <i className="fs-5 text-primary ri-eye-fill"></i> : <i className="fs-5 text-muted ri-eye-off-fill"></i>}
                                        {" "}{table.name}
                                    </ListGroupItem>
                                ))
                            ) : (
                                <Alert color="info" className="d-flex align-items-center gap-2 m-2">
                                    <i className="ri-information-line fs-5"></i>
                                    <span>Gösterilecek kilitli tablo bulunamadı.</span>
                                </Alert>
                            )}
                        </ListGroup>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>
            <style> {`
                .item-hover:hover {
                    cursor: pointer;
                    background-color: rgba(var(--vz-primary-rgb), 0.3);
                    box-shadow: 1px 1px #00000020;
                }
                .max-h {
                    margin: 4px -15px !important;
                    max-height: 50vh !important;
                    overflow: auto !important;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .max-h::-webkit-scrollbar {
                    display: none;
                }
            `}</style> 
        </>
    );
};