import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

interface Props {
  isOpen: boolean;
  toggle: () => void;
  newChannelName: string;
  setNewChannelName: (v: string) => void;
  onSubmit: () => Promise<void>;
}

const CreateChannelModal: React.FC<Props> = ({
  isOpen, toggle,
  newChannelName, setNewChannelName,
  onSubmit,
}) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>Kanal Oluştur</ModalHeader>
    <ModalBody>
      <input
        type="text"
        className="form-control"
        placeholder="Channel name"
        value={newChannelName}
        onChange={e => setNewChannelName(e.target.value)}
      />
    </ModalBody>
    <ModalFooter>
      <button className="btn btn-secondary" onClick={toggle}>İptal</button>
      <button
        className="btn btn-primary"
        onClick={async () => { await onSubmit(); toggle(); }}
      >
        Oluştur
      </button>
    </ModalFooter>
  </Modal>
);

export default CreateChannelModal;
