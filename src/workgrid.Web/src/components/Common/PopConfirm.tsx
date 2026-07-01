import { ModalType } from 'common/enums/ModalType';
import React, { useEffect, useState } from 'react';
import { Button, Popover } from 'reactstrap';

interface PopConfirmProps {
  type?: ModalType;
  message?: string;
  confirmText?: string;
  onConfirm: () => void;
  onClose: () => void;
  targetId: string | HTMLElement;
}

export const PopConfirm: React.FC<PopConfirmProps> = ({
  type = ModalType.Alert,
  message = "Are you sure?",
  confirmText = "OK",
  onConfirm,
  onClose,
  targetId
}) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(prev => !prev);

  // Tip bazlı ikon ve renk
  const typeConfig: Record<ModalType, { icon: string; color: string }> = {
    [ModalType.Success]: { icon: "mdi mdi-check-circle", color: "success" },
    [ModalType.Warning]: { icon: "mdi mdi-alert", color: "warning" },
    [ModalType.Confirm]: { icon: "mdi mdi-help-circle", color: "primary" },
    [ModalType.Alert]: { icon: "mdi mdi-alert-circle", color: "danger" },
    [ModalType.Error]: { icon: "ri-thumb-down-line", color: "danger" }
    //mdi mdi-exclamation
  };

  const { icon, color } = typeConfig[type];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      timer = setTimeout(() => setOpen(false), 2500);
    }
    return () => clearTimeout(timer);
  }, [open]);

  return (
        <Popover 
                isOpen={open}
                toggle={toggle}
                target={targetId}
                placement="bottom-end"
                // hideArrow={true}
                transition={{ timeout: 200 }}
            >
                <div className='row p-2'  style={{display:"flex", justifyContent:"start", alignItems:'stretch'}}>
                    <div className='col-3'>
                        <i className={`${icon} text-${color} opacity-75`}
                        style={{fontSize:"60px"}}></i>
                    </div>
                    <div className='col-9 p-3' 
                        style={{ padding: "10px", maxWidth: "400px" }}>
                        <p>{message}</p>
                        <div className="d-flex gap-2 justify-content-end">
                            <Button
                                onClick={() =>{ onClose(); setOpen(false); }}
                                color="light"
                                size="sm"
                            >
                                İptal
                            </Button>
                            <Button color={`soft-${color}`} size="sm"
                                onClick={() => { onConfirm(); setOpen(false); }}>
                                {confirmText}
                            </Button>
                        </div>
                    </div>
                </div>
            </Popover>
  );
};

