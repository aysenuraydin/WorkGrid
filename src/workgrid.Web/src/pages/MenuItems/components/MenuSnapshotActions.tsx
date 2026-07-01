import React, { useState } from "react";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalFooter, ModalHeader, UncontrolledDropdown } from "reactstrap";
import {
    useGetMenuSnapshot,
    useSaveMenuSnapshot,
    useRestoreMenuSnapshot,
} from "hooks/useMenuSnapshot";

const MenuSnapshotActions = () => {
    const { data: snapshot } = useGetMenuSnapshot();
    const saveSnapshot = useSaveMenuSnapshot();
    const restoreSnapshot = useRestoreMenuSnapshot();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const hasBackup = snapshot?.exists;
    const savedAt = snapshot?.savedAt
        ? new Date(snapshot.savedAt).toLocaleString("tr-TR")
        : null;

    return (
        <div className="d-flex gap-2 align-items-center">
            <UncontrolledDropdown>
                <DropdownToggle tag="a" className={`btn btn-soft-light btn-sm`}>
                    <i className="ri-more-fill align-middle"></i>
                </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                        {savedAt && (
                            <li>
                                <DropdownItem className="edit-item-btn">
                                    <small className="text-muted">Son yedek: {savedAt}</small>
                                </DropdownItem>
                            </li>
                        )}
                        <li>
                            <DropdownItem className="edit-item-btn"  
                                disabled={saveSnapshot.isPending} 
                                onClick={() => saveSnapshot.mutate()}>
                                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i> 
                                {saveSnapshot.isPending ? "Kaydediliyor..." : "Ayarlari Kaydet"}
                            </DropdownItem>
                        </li>
                        <li>
                            <DropdownItem className="edit-item-btn"  
                                onClick={() => setConfirmOpen(true)}
                                disabled={!hasBackup || restoreSnapshot.isPending}>
                                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i> 
                                Yedekten Geri Yukle
                            </DropdownItem>
                        </li>
                    </DropdownMenu>
            </UncontrolledDropdown>
            <Modal isOpen={confirmOpen} toggle={() => setConfirmOpen(false)} centered>
                <ModalHeader toggle={() => setConfirmOpen(false)}>
                    Yedekten Geri Yukle
                </ModalHeader>
                <ModalBody>
                    Bu islem <strong>mevcut tum menu ogelerini silip</strong> son
                    kaydedilen yedekten yeniden olusturur. Devam etmek istiyor musunuz?
                    {savedAt && <div className="mt-2 text-muted">Yedek tarihi: {savedAt}</div>}
                </ModalBody>
                <ModalFooter>
                    <Button color="light" onClick={() => setConfirmOpen(false)}>
                        Vazgec
                    </Button>
                    <Button
                        color="danger"
                        disabled={restoreSnapshot.isPending}
                        onClick={() => {
                            restoreSnapshot.mutate(undefined, {
                                onSuccess: () => setConfirmOpen(false),
                            });
                        }}
                    >
                        {restoreSnapshot.isPending ? "Geri yukleniyor..." : "Evet, geri yukle"}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default MenuSnapshotActions;