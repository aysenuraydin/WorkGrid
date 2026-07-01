import { AccessLevel } from "common/data/Datatable";
import { useGetRoles } from "hooks/useRole";
import { useDataTable } from "context/DatatableContext";
import { isBlogControl, isProductControl } from "common/data/constans"; // yolunu kendine göre düzelt
import { Input, Label } from "reactstrap";
import Select from "react-select";

interface IRoleOption { value: string; label: string; isFixed?: boolean; }

const FIXED_ROLE = "Admin";

const selectStyles = (changed?: boolean) => ({
    control: (base: any, state: any) => ({
        ...base,
        boxShadow: 'none',
        borderColor: state.isFocused ? "var(--vz-primary)" : base.borderColor,
        backgroundColor: changed ? '#F3F0FA' : base.backgroundColor,
        '&:hover': { borderColor: "var(--vz-primary)" },
    }),
    multiValue: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.data?.isFixed ? "#6c757d" : "var(--vz-primary)",
        color: 'white',
    }),
    multiValueLabel: (base: any) => ({ ...base, color: 'white', fontWeight: 'bold' }),
    multiValueRemove: (base: any, state: any) =>
        state.data?.isFixed
            ? { ...base, display: 'none' }
            : {
                ...base, color: 'white',
                ':hover': { backgroundColor: "var(--vz-primary)", color: 'white', cursor: 'pointer' },
            },
});

export const AccessForm = ({ formik, handleChange, handleBlur, handleFocus, changedMap }: any) => {
    const { data: roles, isLoading, isError } = useGetRoles();
    const { modal } = useDataTable();

    // Bu tablo herkese açık olabilen bir tablo mu? (blog veya ürün)
    const tableName = modal?.table?.name ?? "";
    const isPublicEligible = isBlogControl(tableName) || isProductControl(tableName);

    // Erişim seviyeleri: Public sadece blog/ürün tablolarında görünür
    const ACCESS_OPTIONS = [
        ...(isPublicEligible ? [{ value: AccessLevel.Public, label: "Herkese Açık" }] : []),
        { value: AccessLevel.Authenticated, label: "Giriş Yapanlar" },
        { value: AccessLevel.RoleBased, label: "Role Dayalı" },
    ];

    const showReadRole = formik.values.readAccess === AccessLevel.RoleBased;
    const showWriteRole = formik.values.writeAccess === AccessLevel.RoleBased;

    const roleOptions: IRoleOption[] = (roles ?? [])
        ?.filter((r: any) => {
            // WG her zaman gizli (sistem rolü)
            if (r.name === "WG") return false;
            // Admin ayrı fixed eklenecek, listeden çıkar
            if (r.name === FIXED_ROLE) return false;
            // EndUser sadece blog/ürün tablolarında görünür
            if (r.name === "EndUser" && !isPublicEligible) return false;
            return true;
        })
        ?.map((r: any) => ({ value: r.name, label: r.name }));

    const toOptions = (values: any): IRoleOption[] => {
        const arr: string[] = Array.isArray(values)
            ? values
            : (values ? String(values).split(",").map((s: string) => s.trim()).filter(Boolean) : []);

        const others = arr
            .filter(v => v !== FIXED_ROLE)
            .map(v => roleOptions.find(o => o.value === v) ?? { value: v, label: v });

        return [{ value: FIXED_ROLE, label: FIXED_ROLE, isFixed: true }, ...others];
    };

    const handleRoleChange = (field: string) => (selected: any) => {
        const values = (selected ?? []).map((s: any) => s.value);
        const withAdmin = values.includes(FIXED_ROLE) ? values : [FIXED_ROLE, ...values];
        formik.setFieldValue(field, withAdmin);
    };

    return (
        <div className="d-flex flex-column gap-3">
            <div>
                <Label className="form-label">Okuma Erişimi</Label>
                <Input
                    type="select"
                    name="readAccess"
                    value={formik.values.readAccess}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(formik.touched.readAccess && formik.errors.readAccess)}
                >
                    {ACCESS_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </Input>
                {formik.touched.readAccess && formik.errors.readAccess && (
                    <div className="text-danger small mt-1">{formik.errors.readAccess}</div>
                )}
            </div>

            {showReadRole && (
                <div>
                    <Label className="form-label">
                        Okuma için Roller
                        <span className="text-muted small ms-2">Admin her zaman erişebilir</span>
                    </Label>
                    <Select
                        isMulti
                        value={toOptions(formik.values.readRequiredRole)}
                        options={roleOptions}
                        isLoading={isLoading}
                        isDisabled={isError}
                        isClearable={false}
                        placeholder={isError ? "Roller alınamadı" : "Rol seçiniz..."}
                        onChange={handleRoleChange("readRequiredRole")}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        styles={selectStyles(changedMap?.["readRequiredRole"])}
                    />
                    {formik.touched.readRequiredRole && formik.errors.readRequiredRole && (
                        <div className="text-danger small mt-1">{formik.errors.readRequiredRole as string}</div>
                    )}
                </div>
            )}

            <div>
                <Label className="form-label">Yazma Erişimi</Label>
                <Input
                    type="select"
                    name="writeAccess"
                    value={formik.values.writeAccess}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(formik.touched.writeAccess && formik.errors.writeAccess)}
                >
                    {ACCESS_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </Input>
                {formik.touched.writeAccess && formik.errors.writeAccess && (
                    <div className="text-danger small mt-1">{formik.errors.writeAccess}</div>
                )}
            </div>

            {showWriteRole && (
                <div>
                    <Label className="form-label">
                        Yazma için Roller
                        <span className="text-muted small ms-2">Admin her zaman erişebilir</span>
                    </Label>
                    <Select
                        isMulti
                        value={toOptions(formik.values.writeRequiredRole)}
                        options={roleOptions}
                        isLoading={isLoading}
                        isDisabled={isError}
                        isClearable={false}
                        placeholder={isError ? "Roller alınamadı" : "Rol seçiniz..."}
                        onChange={handleRoleChange("writeRequiredRole")}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        styles={selectStyles(changedMap?.["writeRequiredRole"])}
                    />
                    {formik.touched.writeRequiredRole && formik.errors.writeRequiredRole && (
                        <div className="text-danger small mt-1">{formik.errors.writeRequiredRole as string}</div>
                    )}
                </div>
            )}
        </div>
    );
};