

import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import { Link } from 'react-router-dom';
import { ModalType } from 'common/enums/ModalType';

interface GenericModalProps {
    type: ModalType;
    title?: string;
    message?: string;
    confirmText?: string;
    modal_backdrop: any;
    tog_backdrop: () => void;
    onConfirm?: () => void;
    onClose: () => void;
}

export const GenericModal: React.FC<GenericModalProps> = ({
    type,
    title,
    message,
    onConfirm,
    confirmText,
    onClose,
    modal_backdrop,
    tog_backdrop
}) => {

    // Modal ikon ve renkleri tipi göre belirle
    const modalConfig: Record<ModalType, { icon: string; color: string; }> = {
        [ModalType.Success]: { icon: "bx bx-party", color: "success" },
        [ModalType.Warning]: { icon: "ri-error-warning-line", color: "warning" },
        [ModalType.Confirm]: { icon: "ri-question-line", color: "primary" },
        [ModalType.Alert]: { icon: "ri-close-circle-line", color: "danger" },
        [ModalType.Error]: { icon: "ri-thumb-down-line", color: "danger" }
    };
    const { icon, color } = modalConfig[type];

    return (
        <Modal
            toggle={onClose}
            isOpen={modal_backdrop}
            backdrop={'static'}
            id="staticBackdrop"
            centered
        >
            <ModalHeader className="modal-title" id="staticBackdropLabel" toggle={() => { tog_backdrop();  }}></ModalHeader>
            <ModalBody className="text-center">
            <i className={`${icon} display-4 text-${color}`}></i>

                <div className="">
                    <h4 className="mb-3">{title}</h4>
                    <p className="text-muted mb-4">{message}</p>
                    <div className="hstack gap-2 justify-content-center">
                        <Link to="#" className={`btn btn-link fw-medium text-${color}`} onClick={()=>{
                        onClose?.()
                        tog_backdrop()
                        }}>
                        <i className="ri-close-line me-1 align-middle"></i> Close
                        </Link>
                        <Link to="#" className={`btn btn-success bg-${color} border border${color}`} onClick={()=>{
                        onConfirm?.();
                        tog_backdrop();
                        }}>
                            {confirmText?? "OK"}
                        </Link>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

