import React, { useEffect, useMemo, useState } from "react";
import {
  Modal, ModalBody, Form,
  Row, Col, Label, Input, FormFeedback,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Flatpickr from "react-flatpickr";
import moment from "moment";

import { useKanbanContext } from "../../../context/KanbanContext";
import { useCreateCard, useUpdateCard } from "../../../hooks/useKanban";
import { toast } from "react-toastify";
import SimpleBar from "simplebar-react";
import { getAvatarColor } from "common/utils/getAvatarColor";
import config from "config";
import { getInitials, getInitialsName } from "common/utils/getInitials";
import { useProjectById } from "hooks/useProjects";
import { Priority } from "common/enums/Priority";
import { KanbanStatus } from "common/enums/KanbanStatus";
import { KANBAN_STATUS_META } from "common/config/KANBAN_STATUS_META";
import { ProjectMemberDto } from "common/data/project";
import useThemeMode from "hooks/useThemeMode";

interface Props { projectId: string; }

const CardModal: React.FC<Props> = ({ projectId }) => {
  const { isDark } = useThemeMode();  
  const { data: project, isLoading: isLoading } = useProjectById(projectId ?? "");
  const {
    cardModal, isEditCard, activeCard, activeStatus, closeCardModal,
  } = useKanbanContext();

  const createCard = useCreateCard(projectId);
  const updateCard = useUpdateCard(projectId);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedTags, setSelectedTags]       = useState<string[]>([]);
  const [searchTerm, setSearchTerm]           = useState(""); 
  const [tagInput, setTagInput]               = useState<string>("");

  useEffect(() => {
    if (cardModal) {
      if (isEditCard && activeCard) {
        const memberIds = activeCard.members?.map((m: any) => m.userId) || [];
        setSelectedMembers(memberIds);
        setSelectedTags(activeCard.badges || []);
      } else {
        setSelectedMembers([]);
        setSelectedTags([]);
      }
      setSearchTerm("");
      setTagInput("");
    }
  }, [isEditCard, activeCard, cardModal]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title:                 activeCard?.title                 ?? "",
      text:                  activeCard?.text                  ?? "",
      priority:              activeCard?.priority              ?? Priority.Medium,
      status:                 activeStatus                     ?? KanbanStatus.New,
      dueDate:               activeCard?.dueDate               ?? "",
      progressPercent:       activeCard?.progressPercent       ?? 0,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Task adını girin"),
      text:  Yup.string().optional(),
    }),
    onSubmit: (values, helpers) => {
      const payload = {
        projectId,
        title:                 values.title,
        text:                  values.text || undefined,
        priority:              values.priority ?? Priority.Medium,
        dueDate:               values.dueDate  || undefined,
        status:                values.status ?? KanbanStatus.New,
        badges:                selectedTags, 
        memberUserIds:         selectedMembers, 
        pictureUrl:            activeCard?.pictureUrl ?? undefined,
        progressPercent:       Number(values.progressPercent),
      };

      if (isEditCard && activeCard) {
        const { projectId, ...updatePayload } = payload; 
        updateCard.mutate(
          { id: activeCard.id, payload: updatePayload },
          {
            onSuccess: () => { 
              toast.success("Kart güncellendi."); 
              helpers.resetForm(); 
              closeCardModal(); 
            },
            onError: (error: any) => {
              toast.error("Güncellenemedi. Lütfen alanları kontrol edin.");
            },
          }
        );
      } else {
        createCard.mutate(payload, {
          onSuccess: () => { toast.success("Kart oluşturuldu."); helpers.resetForm(); closeCardModal(); },
          onError:   () => toast.error("Kart oluşturulamadı."),
        });
      }
    },
  });

  const filteredUsers = useMemo(() => {
    if (!project?.members) return [];
    if (!searchTerm.trim()) return project?.members;

    const lowerSearch = searchTerm.toLowerCase();
    return project?.members.filter((user: ProjectMemberDto) => {
      const fullName = `${user.fullName ?? ""}`.toLowerCase();
      return fullName.includes(lowerSearch);
    });
  }, [project?.members, searchTerm]);

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const isPending = createCard.isPending || updateCard.isPending;
  const statusMeta = KANBAN_STATUS_META[activeStatus as KanbanStatus ?? KanbanStatus.New];

  return (
    <Modal 
      id="cardModal" 
      isOpen={cardModal} 
      toggle={closeCardModal} 
      centered 
      size="lg"
      contentClassName="border-0 shadow-lg rounded-3"
    >
      {/* Modal Başlığı */}
      <div className={`d-flex align-items-center justify-content-between px-4 pt-4 pb-2 bg-${isDark?"dark":"light"} rounded-top-3`}>
        <h5 className={`m-0 text-${isDark?"":""}`} style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
          {isEditCard ? "Kartı Düzenle" : "Yeni Kart Ekle"}
          {statusMeta && (
            <span 
              className="ms-2" 
              style={{ 
                fontSize: 11, 
                fontWeight: 600, 
                padding: "3px 10px", 
                borderRadius: "20px", 
                background: statusMeta.hexBg, 
                color: statusMeta.hexText 
              }}
            >
              {statusMeta.label}
            </span>
          )}
        </h5>
        <button type="button" className="btn-close" onClick={closeCardModal} style={{ boxShadow: "none", fontSize: 13 }} />
      </div>

      <ModalBody className="px-4 pb-4 pt-2">
        <Form onSubmit={e => { e.preventDefault(); formik.handleSubmit(); }}>

          {/* Task Adı */}
          <div className="mb-3">
            <Label htmlFor="taskname" className="form-label">
              Task Adı <span className="text-danger">*</span>
            </Label>
            <Input
              id="taskname" name="title" type="text"
              className="form-control"
              style={{ borderRadius: 10, padding: "10px 14px", border: "1px solid #D0D5DD" }}
              placeholder="Pano listeleme optimizasyonu..."
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              value={formik.values.title}
              invalid={!!(formik.touched.title && formik.errors.title)}
            />
            {formik.touched.title && formik.errors.title && (
              <FormFeedback>{formik.errors.title}</FormFeedback>
            )}
          </div>

          {/* Açıklama */}
          <div className="mb-3">
            <Label htmlFor="taskdesc" className="form-label">
              Açıklama
            </Label>
            <textarea
              id="taskdesc"
              className={`form-control ${formik.touched.text && formik.errors.text ? "is-invalid" : ""}`}
              style={{ borderRadius: 10, padding: "10px 14px", border: "1px solid #D0D5DD" }}
              name="text" rows={3}
              placeholder="Task detaylarını ve teknik notları buraya yazabilirsiniz..."
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              value={formik.values.text}
            />
          </div>

          <Row className="mb-3 align-items-end">
            
            <Col md={4}>
              <Label htmlFor="status" className="form-label fw-medium fs-13 text-muted">Durum</Label>
              <Input
                id="cardStatus" 
                name="status" 
                type="select"
                className="form-select form-select-md" 
                style={{ 
                  borderRadius: 10, 
                  height: "44px", 
                  padding: "10px 14px", 
                  border: "1px solid #D0D5DD", 
                  cursor: "pointer",
                  fontSize: "14px"
                }}
                onChange={formik.handleChange}
                value={formik.values.status}
              >
                {Object.keys(KANBAN_STATUS_META).map((key) => {
                  const statusKey = key as KanbanStatus;
                  return (
                    <option key={statusKey} value={statusKey}>
                      {KANBAN_STATUS_META[statusKey]?.label || statusKey}
                    </option>
                  );
                })}
              </Input>
            </Col>

            {/* ÖNCELİK ALANI */}
            <Col md={4}>
              <Label htmlFor="priority" className="form-label fw-medium fs-13 text-muted">Öncelik</Label>
              <Input
                id="priority" 
                name="priority" 
                type="select"
                className="form-select form-select-md"
                style={{ 
                  borderRadius: 10, 
                  height: "44px", 
                  padding: "10px 14px", 
                  border: "1px solid #D0D5DD", 
                  cursor: "pointer",
                  fontSize: "14px"
                }}
                onChange={formik.handleChange}
                value={formik.values.priority}
              >
                <option value="Low">Düşük (Low)</option>
                <option value="Medium">Orta (Medium)</option>
                <option value="High">Yüksek (High)</option>
              </Input>
            </Col>

            {/* BİTİŞ TARİHİ ALANI */}
            <Col md={4}>
              <Label className="form-label fw-medium fs-13 text-muted">Bitiş Tarihi</Label>
              <Flatpickr
                className="form-control"
                style={{ 
                  borderRadius: 10, 
                  height: "44px", // 🚀 Yüksekliği eşitledik
                  padding: "10px 14px", 
                  border: "1px solid #D0D5DD",
                  backgroundColor: "#fff",
                  fontSize: "14px"
                }}
                placeholder="Tarih seçin"
                options={{ altInput: true, altFormat: "d M, Y", dateFormat: "Y-m-d" }}
                onChange={(dates: any) =>
                  formik.setFieldValue("dueDate", dates[0] ? moment(dates[0]).toISOString() : "")
                }
                value={formik.values.dueDate || ""}
              />
            </Col>
          </Row>
          
          <div className={`mb-3 p-3 rounded-3 border bg-${isDark?'soft-':''}light`}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Label className="form-label mb-0">
                Görev İlerleme Oranı
              </Label>
              <span 
                style={{ 
                  fontSize: 11, 
                  fontWeight: 700, 
                  padding: "2px 8px", 
                  borderRadius: 6, 
                  background: "#F1F5F9", 
                  color: "#475569"
                }}
              >
                %{formik.values.progressPercent}
              </span>
            </div>
            <input
              name="progressPercent" 
              type="range" 
              min="0" 
              max="100"
              className="form-range"
              style={{ cursor: "pointer", accentColor: "#7f56d9" }} 
              onChange={formik.handleChange} 
              value={formik.values.progressPercent}
            />
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Label className="form-label mb-0">Görevli Üyeler</Label>
              {selectedMembers.length > 0 && (
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 12, background: "#E0E7FF", color: "var(--vz-primary)" }}>
                  {selectedMembers.length} Üye Seçildi
                </span>
              )}
            </div>
            
            <div className="search-box mb-2 position-relative">
              <Input
                type="text"
                className="form-control pe-5 bg-${isDark?'soft-':''}light"  
                style={{ borderRadius: 10, padding: "9px 14px" }}
                placeholder="İsim ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                  onClick={() => setSearchTerm("")}
                  style={{ padding: "0.5rem 0.75rem", zIndex: 4, boxShadow: "none" }}
                >
                  <i className="ri-close-fill fs-16"></i>
                </button>
              )}
            </div>

            <div className={`bg-${isDark?'soft-':''}light`} style={{ borderRadius: 10, border: "1px solid #EAECF0", overflow: "hidden" }}>
              <SimpleBar style={{ maxHeight: 150, padding: "8px" }}>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((member: ProjectMemberDto, i: number) => {
                      const checked = selectedMembers.includes(member.userId);
                      const ac = getAvatarColor(member.fullName ?? "User", i);
                      return (
                        <li key={member.userId}>
                          <div 
                            className="d-flex align-items-center gap-2 px-2 py-1.5 rounded-2 cursor-pointer transition-all"
                            style={{ 
                              background: checked ? "#F4F3FF" : "transparent",
                              transition: "background 0.15s"
                            }}
                            onClick={() => toggleMember(member.userId)}
                          >
                            <input
                              className="form-check-input m-0 cursor-pointer" 
                              type="checkbox"
                              checked={checked}
                              readOnly
                              style={{ width: 16, height: 16, borderRadius: 4, accentColor: "var(--vz-primary)" }}
                            />
                            {member.profilePictureUrl ? (
                              <img
                                src={`${config.api.FILE_API_URL}/File/${member.profilePictureUrl}`}
                                className="rounded-circle"
                                style={{ width: 24, height: 24, objectFit: "cover" }}
                              />
                            ) : (
                              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24, background: ac.bg, color: ac.color, fontSize: 10, fontWeight: 600 }}>
                                {getInitials(member.fullName)} 
                              </div>
                            )}
                            <span style={{ fontSize: 13, fontWeight: checked ? 600 : 500, color: checked ? "var(--vz-primary)" : "#344054" }}>
                              {member.fullName} 
                            </span>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <div className="text-center text-muted py-3 fs-13">
                      Aranan kriterlere uygun üye bulunamadı.
                    </div>
                  )}
                </ul>
              </SimpleBar>
            </div>
          </div>

          <div className="mb-4">
            <Label className="form-label">
              Etiketler
            </Label>

            {selectedTags && selectedTags.length > 0 && (
              <div className="d-flex gap-1 flex-wrap mb-2" style={{ minHeight: 26 }}>
                {selectedTags.map((tag: string, index: number) => {

                  return (
                    <span
                      key={index}
                      className="btn btn-primary"
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "3px 8px",
                        borderRadius: 6,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "all 0.15s ease"
                      }}
                    >
                      {tag}
                      <i
                        className="ri-close-line"
                        style={{ cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: 0.7 }}
                        onClick={() => {
                          setSelectedTags(selectedTags.filter((_, i) => i !== index));
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
                      />
                    </span>
                  );
                })}
              </div>
            )}

            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Yeni bir etiket yazın... (Örn: Tasarım)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); 
                    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
                      setSelectedTags([...selectedTags, tagInput.trim()]);
                      setTagInput("");
                    }
                  }
                }}
                style={{
                  borderRadius: 6,
                  border: "1px solid #d0d5dd",
                  fontSize: 13,
                  padding: "6px 12px",
                  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                }}
              />
              <button
                type="button"
                className="btn btn-sm text-light btn-primary"
                onClick={() => {
                  if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
                    setSelectedTags([...selectedTags, tagInput.trim()]);
                    setTagInput("");  
                  }
                }} 
              >
                Ekle
              </button>
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-end pt-3 border-top">
            <button 
              type="button" 
              className="btn btn-light" 
              onClick={closeCardModal}
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="btn text-light btn-primary" 
              disabled={isPending}
            >
              {isPending ? "Kaydediliyor..." : isEditCard ? "Değişiklikleri Kaydet" : "Kartı Oluştur"}
            </button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CardModal;