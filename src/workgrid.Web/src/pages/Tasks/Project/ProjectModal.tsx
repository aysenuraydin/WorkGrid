import React, { useEffect, useState, useMemo } from "react";
import {
  Modal, ModalHeader, ModalBody, Form,
  Label, Input, FormFeedback, Row, Col
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import SimpleBar from "simplebar-react";
import { toast } from "react-toastify";

import { useProjectContext } from "context/ProjectContext";
import { useCreateProject, useUpdateProject } from "hooks/useProjects";
import config from "config";
import { useGetRoleUsersAll } from "hooks/useRole";
import { AuthUser } from "context/AuthContext";
import { getAvatarColor } from "common/utils/getAvatarColor";
import { getInitialsName } from "common/utils/getInitials";
import { ProjectStatus } from "common/enums/ProjectStatus";
import { Priority } from "common/enums/Priority";
import { PROJECT_STATUS_META } from "common/config/PROJECT_STATUS_META";
import { PRIORITY_STATUS_META } from "common/config/PRIORITY_STATUS_META";
import useThemeMode from "hooks/useThemeMode";

const ProjectModal: React.FC = () => {
  const { projectModal, isEditProject, activeProject, closeProjectModal } = useProjectContext();
  const { isDark } = useThemeMode(); 
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const { data: users, isLoading, isError } = useGetRoleUsersAll(); 
  const [userList, setUserlist] = useState<AuthUser[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => { 
    setUserlist(users); 
  }, [users]); 

  useEffect(() => {
    if (activeProject && isEditProject) {
      const memberIds = activeProject.members?.map((m) => m.userId) || [];
      setSelectedMembers(memberIds);
    } else {
      setSelectedMembers([]);
    }
    setSearchTerm(""); 
  }, [activeProject, isEditProject, projectModal]);  

  const filteredUsers = useMemo(() => {
    if (!userList) return [];
    if (!searchTerm.trim()) return userList;

    const lowerSearch = searchTerm.toLowerCase();
    return userList.filter((user) => {
      const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.toLowerCase();
      const username = (user.username ?? "").toLowerCase();
      return fullName.includes(lowerSearch) || username.includes(lowerSearch);
    });
  }, [userList, searchTerm]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name:        activeProject?.name        ?? "",
      description: activeProject?.description ?? "",
      status:      activeProject?.status      ?? ProjectStatus.Planning,  
      priority:    activeProject?.priority    ?? Priority.Medium,       
    },
    validationSchema: Yup.object({
      name:     Yup.string().required("Proje adı zorunludur"),
      status:   Yup.string().required("Proje durumu zorunludur"),
      priority: Yup.string().required("Proje önceliği zorunludur"),
    }),
    onSubmit: (values, helpers) => {
      const payload = {
        name:          values.name,
        description:   values.description || undefined,
        status:        values.status as ProjectStatus, 
        priority:      values.priority as Priority,   
        memberUserIds: selectedMembers,
      };
      console.log("payload",{ 
        id: activeProject?.id,  
        name:          values.name,
        description:   values.description || undefined,
        status:        values.status as ProjectStatus, 
        priority:      values.priority as Priority,   
        memberUserIds: selectedMembers, });

      if (isEditProject && activeProject) { 

        updateProject.mutate(
          { id: activeProject.id, payload },
          {
            onSuccess: () => {
              toast.success("Proje güncellendi.");
              helpers.resetForm();
              closeProjectModal();
            },
            onError: (error: any) => {
              console.error("❌ Güncelleme Başarısız! Backend'den dönen detay:", error);
              toast.error(`Güncellenemedi! Hata: ${error?.response?.data?.message || "Sunucu Hatası (500)"}`);
            },
          }
        )
      }else {
        createProject.mutate(payload, {
          onSuccess: () => {
            toast.success("Proje oluşturuldu.");
            helpers.resetForm();
            closeProjectModal();
          },
          onError: () => toast.error("Proje oluşturulamadı."),
        });
      }
    },
  });

  const toggleMember = (uid: string) =>
    setSelectedMembers(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );

  const isPending = createProject.isPending || updateProject.isPending;

  return (
    <Modal isOpen={projectModal} toggle={closeProjectModal} centered size="md">
      <ModalHeader className={`p-3 bg-${isDark?"soft-":""}light`} toggle={closeProjectModal}>
        {isEditProject ? "Projeyi Düzenle" : "Yeni Proje Oluştur"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={e => { e.preventDefault(); formik.handleSubmit(); }}>

          <div className="mb-3">
            <Label htmlFor="projectName" className="form-label">
              Proje Adı <span className="text-danger">*</span>
            </Label>
            <Input
              id="projectName" name="name" type="text"
              placeholder="Proje adını girin..."
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              value={formik.values.name}
              invalid={!!(formik.touched.name && formik.errors.name)}
            />
            {formik.touched.name && formik.errors.name && (
              <FormFeedback>{formik.errors.name}</FormFeedback>
            )}
          </div>

          <Row className="mb-3">
            <Col md={6}>
              <Label htmlFor="projectStatus" className="form-label">
                Proje Durumu <span className="text-danger">*</span>
              </Label>
              <Input
                id="projectStatus" name="status" type="select"
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                value={formik.values.status}
                invalid={!!(formik.touched.status && formik.errors.status)}
              >
                {Object.values(ProjectStatus).map((status) => (
                  <option key={status as string} value={status as string}>
                    {PROJECT_STATUS_META[status]?.label || status}
                  </option>
                ))}
              </Input>
              {formik.touched.status && formik.errors.status && (
                <FormFeedback>{formik.errors.status}</FormFeedback>
              )}
            </Col>

            <Col md={6}>
              <Label htmlFor="projectPriority" className="form-label">
                Öncelik <span className="text-danger">*</span>
              </Label>
              <Input
                id="projectPriority" name="priority" type="select"
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                value={formik.values.priority}
                invalid={!!(formik.touched.priority && formik.errors.priority)}
              >
                {Object.values(Priority).map((prio) => (
                  <option key={prio as string} value={prio as string}>
                    {PRIORITY_STATUS_META[prio]?.label || prio}
                  </option>
                ))}
              </Input>
              {formik.touched.priority && formik.errors.priority && (
                <FormFeedback>{formik.errors.priority}</FormFeedback>
              )}
            </Col>
          </Row>

          <div className="mb-3">
            <Label htmlFor="projectDesc" className="form-label">Açıklama</Label>
            <textarea
              id="projectDesc" name="description"
              className="form-control" rows={3}
              placeholder="Proje açıklaması (isteğe bağlı)..."
              onChange={formik.handleChange}
              value={formik.values.description}
            />
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Label className="form-label mb-0">Üyeler</Label>
              {selectedMembers.length > 0 && (
                <span className="badge bg-primary-subtle text-primary">{selectedMembers.length} üye seçildi</span>
              )}
            </div>
            <div className="search-box mb-2 position-relative">
                <Input
                  type="text"
                  className="form-control pe-5"  
                  placeholder="Üye ara (Ad, soyad veya kullanıcı adı)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                    onClick={() => setSearchTerm("")}
                    style={{
                      padding: "0.5rem 0.75rem",
                      zIndex: 4,
                      boxShadow: "none"
                    }}
                    title="Aramayı Temizle"
                  >
                    <i className="ri-close-fill fs-16"></i>  
                  </button>
                )}
              </div>

            <SimpleBar style={{ maxHeight: 200, paddingRight: "5px" }}>
              <ul className="list-unstyled mb-0">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((member, i) => {
                    const checked = selectedMembers.includes(member.id);
                    const ac = getAvatarColor(member.firstName ?? "", i);
                    return (
                      <li key={i} className="py-1">
                        <div className="form-check form-check-primary d-flex align-items-center gap-2 m-0 cursor-pointer">
                          <input
                            className="form-check-input" type="checkbox"
                            id={`pm-${member.id}`} checked={checked}
                            onChange={() => toggleMember(member.id)}
                            style={{ cursor: "pointer" }}
                          />
                          {member.profilePictureUrl ? (
                            <img
                              src={`${config.api.FILE_API_URL}/File/${member.profilePictureUrl}`}
                              alt={member.username}
                              className="rounded-circle avatar-xs"
                              style={{ border: "2px solid #fff", objectFit: "cover" }}
                            />
                          ) : (
                            <div className="avatar-xs rounded-circle d-inline-block" style={{ border: "2px solid #fff" }}>
                              <div
                                className="avatar-title rounded-circle fs-11 fw-semibold text-uppercase"
                                style={{ background: ac.bg, color: ac.color }}
                              >
                                {getInitialsName(member.firstName ?? "", member.lastName ?? "")}
                              </div>
                            </div>
                          )}
                          <label className="form-check-label mb-0 flex-grow-1 cursor-pointer" htmlFor={`pm-${member.id}`}>
                            {member.firstName} {member.lastName} 
                            <span className="text-muted fs-12 ms-1">({member.username})</span>
                          </label>
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
          <div className="d-flex gap-2 justify-content-end">
            <button type="button" className="btn btn-light" onClick={closeProjectModal}>
              İptal
            </button>
            <button type="submit" className="btn btn-success" disabled={isPending}>
              {isPending ? "Kaydediliyor..." : isEditProject ? "Güncelle" : "Oluştur"}
            </button>
          </div>

        </Form>
      </ModalBody>
    </Modal>
  );
};

export default ProjectModal;