import { useMemo } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, UncontrolledDropdown } from 'reactstrap'; 
import "../MenuItems.css";
import { DataType } from 'common/enums/DataType'; 
import { useGetMenuItems } from 'hooks/useMenuItems';
import { useGetDataTables } from 'hooks/useDatatables';
import { useMenuItemForm } from '../hooks/useMenuItemForm';
import { useFormUIEffects } from '../hooks/useFormUIEffects';
import { useMenu } from 'context/MenuContext';
import { IconPicker } from 'components/Common/Iconpicker';
import useThemeMode from 'hooks/useThemeMode';
import { useGetTenantConfig } from 'hooks/useTenant';

export const CreateMenuItem = () => {  
    const { data: tenantConfig } = useGetTenantConfig(); 
    const { isDark } = useThemeMode(); 
    const { data: menuItems, isLoading: isMenuItemsLoading } = useGetMenuItems(); 
    const { data: tables, isLoading: isTablesLoading } = useGetDataTables();

    const { actions, state } = useMenu();

    const formik = useMenuItemForm(
      state.menuItem, 
      state.modalType!, 
      actions.toggleItemModal, 
      actions.setMenuItem
    );
    
    const { focusMap, changedMap, handleFocus, handleBlur, handleChange } = useFormUIEffects(formik);

    const menuItemList = useMemo(() => menuItems?.data || [], [menuItems]);
    const tableList = useMemo(() => tables?.data || [], [tables]);

    const sectionLabelStyle: React.CSSProperties = {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".05em",
        textTransform: "uppercase",
        color: "var(--vz-secondary-color)",
        marginBottom: 10,
        display: "block",
    };

    return (
      <Modal 
        id="showModal" 
        isOpen={state.itemModal} 
        toggle={actions.toggleItemModal} 
        centered 
        size="lg"
        style={{ userSelect: "none" }}
        contentClassName="border-0 shadow-lg"
      >
          <ModalHeader 
            className={`bg-${isDark ? "dark" : "light"} px-4 py-3`} 
            toggle={actions.toggleItemModal}
          >
              <span className="d-flex align-items-center gap-2">
                  <i className="ri-menu-add-line text-primary fs-18"></i>
                  <span>
                      <span className="text-capitalize">{state.modalType}</span> Menü Öğesi
                  </span>
              </span>
          </ModalHeader>

          <Form className="tablelist-form" onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  formik.handleSubmit();
                  return false;
              }}>
                <ModalBody className="px-4 py-4">
                    <input type="hidden" id="id" />

                    {/* ── Temel Bilgiler ──────────────────────────────────── */}
                    <span style={sectionLabelStyle}>Temel Bilgiler</span>
                    <div className="d-flex gap-3 mb-4 align-items-start">
                      {/* İkon */}
                      <div style={{ width: "120px", flexShrink: 0 }}>
                        <Label htmlFor="icon" className="form-label">İkon</Label>
                        <IconPicker
                            value={formik.values.icon || "ri-circle-line"}
                            onChange={(icon) => formik.setFieldValue("icon", icon)}
                            disabled={!!formik.values.parentId}
                        />
                      </div>

                      {/* Etiket */}
                      <div className="w-100" style={{ position: "relative" }}>
                        <Label htmlFor="label" className="form-label">Öğe Adı</Label>
                        <div className="d-flex">
                          <Input
                            name="label"
                            id="label"
                            className={`form-control ps-4 ${focusMap["label"] ? "border-primary shadow-sm" : ""} ${changedMap["label"] ? "bg-primary bg-opacity-10" : ""}`}
                            placeholder="Ad giriniz veya seçiniz"
                            type="text" 
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            value={formik.values.label || ""}
                            invalid={!!(formik.touched.label && formik.errors.label)}
                          />
                          <UncontrolledDropdown style={{ position: "absolute", left: "8px", top: "37px" }} className="card-header-dropdown">
                              <DropdownToggle className="text-reset dropdown-btn" tag="a" role="button">
                                  <span className="text-muted"><i className="mdi mdi-format-list-bulleted"></i></span>
                              </DropdownToggle>
                              <DropdownMenu className="dropdown-menu-center border" style={{ maxHeight: "150px", overflow: "scroll" }}>
                                {!isMenuItemsLoading && menuItems?.succeeded && menuItemList?.length
                                ? (<>
                                    {tableList.map((dItem) => (
                                      <DropdownItem 
                                      onClick={() => {
                                        formik.setFieldValue("label", dItem.name)
                                        formik.setFieldValue("link", `/datatable/${dItem.id}`)
                                      }} 
                                      key={dItem.id} value={dItem.name}>
                                          {dItem.name}
                                      </DropdownItem>
                                    ))}
                                </>) : null}
                                <DropdownItem 
                                      onClick={() => {
                                        formik.setFieldValue("label", "Menü Öğeleri")
                                        formik.setFieldValue("link", `/menuItems`)
                                      }} 
                                      value="/menuItems">
                                        Menü Öğeleri
                                      </DropdownItem>
                              </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                        {formik.touched.label && formik.errors.label && (
                            <FormFeedback className="d-block">{String(formik.errors.label)}</FormFeedback>
                        )}
                      </div>

                      {/* Link */}
                      <div className="w-100" style={{ position: "relative" }}>
                        <Label htmlFor="link" className="form-label">Link</Label>
                        <Input
                          name="link"
                          id="link"
                          className={`form-control ${focusMap["link"] ? "border-primary shadow-sm" : ""} ${changedMap["link"] ? "bg-primary bg-opacity-10" : ""}`}
                          placeholder="Link adresi..."
                          type="text" 
                          onChange={handleChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          value={formik.values.link || ""}
                        />
                        {formik.values.link &&
                          <i onClick={() => formik.setFieldValue("link", "")}
                          className='btn fs-4 ri-close-fill'
                          style={{ color: "gray", position: "absolute", right: "-13px", top: "25px" }}></i>
                        }
                      </div>
                    </div>

                    {/* ── Görünürlük Ayarları ─────────────────────────────── */}
                    <span style={sectionLabelStyle}>Görünürlük</span>
                    <div 
                        className="d-flex gap-3 mb-4"
                        style={{ 
                            background: isDark ? "rgba(255,255,255,0.03)" : "#F8F9FA",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E9EBEC"}`,
                            borderRadius: 10,
                            padding: "14px 16px",
                        }}
                    >
                        {/* Görünür */}
                        <label 
                            htmlFor="visible" 
                            className="d-flex align-items-center justify-content-between flex-grow-1 gap-2 mb-0"
                            style={{ cursor: "pointer" }}
                        >
                            <span className="d-flex align-items-center gap-2">
                                <i className={`fs-16 ${formik.values.visible ? "ri-eye-line text-success" : "ri-eye-off-line text-muted"}`}></i>
                                <span className="fw-medium fs-14">Görünürlük</span>
                            </span>
                            <div className="form-check form-switch m-0">
                                <Input
                                    name="visible"
                                    id="visible"
                                    type="checkbox"
                                    role="switch"
                                    className="form-check-input"
                                    style={{ width: 38, height: 20, cursor: 'pointer' }}
                                    onChange={handleChange}
                                    checked={formik.values.visible} 
                                />
                            </div>
                        </label>

                        <div style={{ width: 1, background: isDark ? "rgba(255,255,255,0.08)" : "#E9EBEC" }} />

                        {/* Sadece Admin */}
                        <label 
                            htmlFor="isAdmin" 
                            className="d-flex align-items-center justify-content-between flex-grow-1 gap-2 mb-0"
                            style={{ cursor: "pointer" }}
                        >
                            <span className="d-flex align-items-center gap-2">
                                <i className={`fs-16 ${formik.values.isAdmin ? "ri-shield-user-line text-warning" : "ri-shield-line text-muted"}`}></i>
                                <span className="fw-medium fs-14">Sadece Admin</span>
                            </span>
                            <div className="form-check form-switch m-0">
                                <Input
                                    name="isAdmin"
                                    id="isAdmin"
                                    type="checkbox"
                                    role="switch"
                                    className="form-check-input"
                                    style={{ width: 38, height: 20, cursor: 'pointer' }}
                                    onChange={handleChange}
                                    checked={formik.values.isAdmin} 
                                />
                            </div>
                        </label>
                    </div>

                    {/* ── Hiyerarşi & Rozet ───────────────────────────────── */}
                    <span style={sectionLabelStyle}>Hiyerarşi & Rozet</span>
                    <div className="d-flex gap-3">
                      {/* Üst Öğe */}
                      <div className="w-100" style={{ position: "relative" }}>
                        <Label htmlFor="parentId" className="form-label">Üst Öğe</Label>
                        <Input 
                            name="parentId"
                            id="parentId"
                            type="select"
                            className={`w-100 form-control ${focusMap["parentId"] ? "border-primary shadow-sm" : ""} ${state.modalType === DataType.View ? "text-primary" : ""}`}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            value={formik.values.parentId || ""}
                            invalid={!!(formik.touched.parentId && formik.errors.parentId)}
                            disabled={state.modalType === DataType.View} 
                        >
                            <option value="">Seçiniz...</option>
                            {(menuItemList ?? []).filter(x => {
                                if (x.isHeader) return false;        
                                const parent = menuItemList.find(p => p.id === x.parentId);
                                const low = menuItemList.find(p => p.id === parent?.parentId);
                                return x?.parentId == null || parent?.parentId == null || low?.parentId == null;     
                            }).map((opt: any) => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </Input>
                        {formik.touched.parentId && formik.errors.parentId && (
                            <FormFeedback className="d-block">{String(formik.errors.parentId)}</FormFeedback>
                        )}
                      </div>

                      {/* Rozet Adı */}
                      <div className="w-100">
                        <Label htmlFor="badgeName" className="form-label">Rozet Adı</Label>
                        <Input
                          name="badgeName"
                          id="badgeName"
                          className={`form-control ${focusMap["badgeName"] ? "border-primary shadow-sm" : ""}`}
                          placeholder="Rozet adını girin"
                          type="text"
                          disabled={!!formik.values.parentId} 
                          onChange={handleChange}
                          value={formik.values.badgeName || ""}
                        />
                      </div>

                      {/* Rozet Rengi */}
                      <div style={{ width: "100px", flexShrink: 0 }}>
                        <Label htmlFor="badgeColor" className="form-label">Renk</Label>
                        <Input
                          name="badgeColor"
                          id="badgeColor"
                          className="form-control p-0 m-0"
                          style={{ height: "38px", borderRadius: 8, cursor: "pointer" }}
                          type="color"
                          disabled={!!formik.values.parentId || !!formik.values.badgeName} 
                          onChange={handleChange}
                          value={formik.values.badgeColor || "#ffffff"}
                        />
                      </div>
                    </div>
                </ModalBody>
                <ModalFooter className="modal-footer px-4 py-3">
                    <div className="hstack gap-2 justify-content-end w-100">
                    <button type="button" className="btn btn-light" style={{ borderRadius: 8 }} onClick={() => actions.setItemModal(false)}>Kapat</button>
                    {state.modalType !== DataType.View && (
                        <button type="submit" className="btn btn-success" style={{ borderRadius: 8 }}>
                            <i className="ri-check-line align-bottom me-1"></i>
                            <span className="text-capitalize">{state.modalType}</span> Menü Öğesi
                        </button>
                    )}
                    </div>
                </ModalFooter>
            </Form>
      </Modal>
    ) 
}