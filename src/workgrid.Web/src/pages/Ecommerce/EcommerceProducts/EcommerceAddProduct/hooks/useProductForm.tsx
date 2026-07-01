import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGridbaseById, useGridbaseAll, useCreateRow, useUpdateRow, useDeleteRow,
} from "hooks/useGridBase";
import {
  IProduct, IProductCategory, IProductFeature, IProductService,
  IVariantType, IVariantOption, IProductVariant,
} from "common/data/ecommerce";
import { useUploadFile } from "hooks/useFiles";
import {
  CATEGORY_ECOMMERCE_TABLE, ECOMMERCE_TABLE,
  PRODUCT_FEATURE_TABLE, PRODUCT_SERVICE_TABLE, PRODUCT_VARIANT_TABLE,
  VARIANT_TYPE_TABLE, VARIANT_OPTION_TABLE,
} from "common/data/constans";

export const newLocalId = () => Math.random().toString(36).slice(2);

export const slugify = (s: string) =>
  s.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export type ExtraRow = { localId: string; id?: number; value: string; icon: string; order: number; };
export type LocalOption = { localId: string; id?: number; value: string; colorHex: string | null; order: number; };
export type LocalType = { localId: string; id?: number; name: string; displayType: string; order: number; options: LocalOption[]; };
export type ComboRow = {
  key: string; combination: string; price: string; discountPercent: string;
  stock: string; sku: string; existingId?: number; isActive: boolean;
};

// ── Formik value tipi ──
export interface ProductFormValues {
  name: string;
  slug: string;
  shortDescription: string;
  brand: string;
  manufacturer: string;
  tags: string;
  wGProductCategoryId: string | number;
  status: string;
  visibility: string;
  publishedDate: string;
  // tekil ek alanlar (eskiden ayri state)
  description: string;
  mainImage: string;
  gallery: string[];
  hasVariants: boolean;
  simplePrice: string;
  simpleStock: string;
  simpleSku: string;
}

export const useProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const productId = id ? Number(id) : null;
  const navigate = useNavigate();

  // ── Veri ──
  const { data: existing, isLoading: loadingProduct } =
    useGridbaseById<IProduct>(ECOMMERCE_TABLE, productId as number);
  const { data: categories } = useGridbaseAll<IProductCategory>(CATEGORY_ECOMMERCE_TABLE);
  const { data: existingFeatures } = useGridbaseAll<IProductFeature>(PRODUCT_FEATURE_TABLE);
  const { data: existingServices } = useGridbaseAll<IProductService>(PRODUCT_SERVICE_TABLE);
  const { data: allVariants } = useGridbaseAll<IProductVariant>(PRODUCT_VARIANT_TABLE);
  const { data: allTypes } = useGridbaseAll<IVariantType>(VARIANT_TYPE_TABLE);
  const { data: allOptions } = useGridbaseAll<IVariantOption>(VARIANT_OPTION_TABLE);

  const simpleVariant = (allVariants ?? []).find(
    (v: any) => Number(v.wGProductId) === Number(productId)
  );

  // ── Mutations ──
  const createRow = useCreateRow(ECOMMERCE_TABLE);
  const updateRow = useUpdateRow(ECOMMERCE_TABLE);
  const uploadFile = useUploadFile();
  const createVariant = useCreateRow(PRODUCT_VARIANT_TABLE);
  const updateVariant = useUpdateRow(PRODUCT_VARIANT_TABLE);
  const createType = useCreateRow(VARIANT_TYPE_TABLE);
  const deleteType = useDeleteRow(VARIANT_TYPE_TABLE);
  const createOption = useCreateRow(VARIANT_OPTION_TABLE);
  const deleteOption = useDeleteRow(VARIANT_OPTION_TABLE);
  const createFeature = useCreateRow(PRODUCT_FEATURE_TABLE);
  const updateFeature = useUpdateRow(PRODUCT_FEATURE_TABLE);
  const deleteFeature = useDeleteRow(PRODUCT_FEATURE_TABLE);
  const createService = useCreateRow(PRODUCT_SERVICE_TABLE);
  const updateService = useUpdateRow(PRODUCT_SERVICE_TABLE);
  const deleteService = useDeleteRow(PRODUCT_SERVICE_TABLE);

  // ── Dinamik diziler (ayri state) ──
  const [features, setFeatures] = useState<ExtraRow[]>([]);
  const [services, setServices] = useState<ExtraRow[]>([]);
  const [vTypes, setVTypes] = useState<LocalType[]>([]);
  const [combos, setCombos] = useState<ComboRow[]>([]);
  const [uploading, setUploading] = useState(false);

  // ── Formik ──
  const formik = useFormik<ProductFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: existing?.name ?? "",
      slug: existing?.slug ?? "",
      shortDescription: existing?.shortDescription ?? "",
      brand: existing?.brand ?? "",
      manufacturer: existing?.manufacturer ?? "",
      tags: existing?.tags ?? "",
      wGProductCategoryId: existing?.wGProductCategoryId ?? "",
      status: existing?.status ?? "draft",
      visibility: existing?.visibility ?? "public",
      publishedDate: existing?.publishedDate ?? "",
      description: existing?.description ?? "",
      mainImage: existing?.mainImage ?? "",
      gallery: existing?.gallery ? existing.gallery.split(",").map(s => s.trim()).filter(Boolean) : [],
      hasVariants: existing?.hasVariants ?? false,
      simplePrice: simpleVariant ? String(simpleVariant.price ?? "") : "",
      simpleStock: simpleVariant ? String(simpleVariant.stock ?? "") : "",
      simpleSku: simpleVariant?.sku ?? "",
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Ürün adı zorunlu").min(2, "Ürün adı çok kısa").max(200, "Ürün adı çok uzun"),
      wGProductCategoryId: Yup.number().transform((v) => (isNaN(v) ? undefined : v)).required("Kategori seçin"),
      brand: Yup.string().trim().required("Marka zorunlu"),
      shortDescription: Yup.string().trim().required("Kısa açıklama zorunlu").max(500, "Kısa açıklama çok uzun"),
      slug: Yup.string().matches(/^[a-z0-9-]*$/, "Slug küçük harf/rakam/tire").max(200),
      tags: Yup.string().max(500, "Etiketler çok uzun"),
      status: Yup.string().oneOf(["draft", "published", "scheduled"], "Geçersiz durum"),
      visibility: Yup.string().oneOf(["public", "hidden"], "Geçersiz görünürlük"),
      // ── tekil ek alanlar ──
      mainImage: Yup.string().required("Ana görsel zorunlu"),
      // fiyat/stok yalnizca hasVariants=false iken zorunlu
      simplePrice: Yup.string().when("hasVariants", {
        is: false,
        then: (s) => s.required("Fiyat zorunlu").test("num", "Geçerli fiyat girin", (v) => !!v && !isNaN(Number(v))),
        otherwise: (s) => s.notRequired(),
      }),
      simpleStock: Yup.string().when("hasVariants", {
        is: false,
        then: (s) => s.required("Stok zorunlu").test("num", "Geçerli stok girin", (v) => !!v && !isNaN(Number(v))),
        otherwise: (s) => s.notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      const finalSlug = values.slug?.trim() || slugify(values.name);
      const payload = {
        name: values.name, slug: finalSlug, shortDescription: values.shortDescription,
        brand: values.brand, manufacturer: values.manufacturer, tags: values.tags,
        wGProductCategoryId: Number(values.wGProductCategoryId),
        status: values.status, visibility: values.visibility, publishedDate: values.publishedDate,
        description: values.description, mainImage: values.mainImage || null,
        gallery: values.gallery.length ? values.gallery.join(",") : null,
        hasVariants: values.hasVariants,
      };

      if (isEdit && productId) {
        await updateRow.mutateAsync({ id: productId, payload });
        await saveExtras(productId);
        if (!values.hasVariants) {
          const vp = {
            combination: "Default", sku: values.simpleSku || null,
            price: Number(values.simplePrice), stock: Number(values.simpleStock),
            isActive: true, wGProductId: productId,
          };
          if (simpleVariant?.id) await updateVariant.mutateAsync({ id: simpleVariant.id, payload: vp });
          else await createVariant.mutateAsync(vp);
        } else {
          for (const c of combos) {
            if (!c.price || !c.stock) continue;
            const vp = {
              combination: c.combination, sku: c.sku?.trim() || null,
              price: Number(c.price), discountPercent: c.discountPercent ? Number(c.discountPercent) : null,
              stock: Number(c.stock), isActive: c.isActive, wGProductId: productId,
            };
            if (c.existingId) await updateVariant.mutateAsync({ id: c.existingId, payload: vp });
            else await createVariant.mutateAsync(vp);
          }
        }
        setTimeout(() => navigate("/products"), 600);
      } else {
        const created: any = await createRow.mutateAsync(payload);
        const newId = created?.id ?? created?.data?.id ?? created?.result?.id ?? null;
        if (!newId) { formik.setStatus("Ürün ID alınamadı."); return; }
        if (!values.hasVariants) {
          await createVariant.mutateAsync({
            combination: "Default", sku: values.simpleSku || null,
            price: Number(values.simplePrice), stock: Number(values.simpleStock),
            isActive: true, wGProductId: newId,
          });
        } else {
          await saveVariantsForProduct(newId);
        }
        await saveExtras(newId);
        setTimeout(() => navigate("/products"), 600);
      }
    },
  });

  // ── EDIT: dizileri yükle ──
  useEffect(() => {
    if (!productId || !existingFeatures) return;
    const rows = existingFeatures.filter((f) => Number(f.wGProductId) === Number(productId))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setFeatures(rows.map((f) => ({ localId: newLocalId(), id: f.id, value: f.value, icon: f.icon ?? "", order: f.order ?? 0 })));
  }, [existingFeatures, productId]);

  useEffect(() => {
    if (!productId || !existingServices) return;
    const rows = existingServices.filter((s) => Number(s.wGProductId) === Number(productId))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setServices(rows.map((s) => ({ localId: newLocalId(), id: s.id, value: s.value, icon: s.icon ?? "", order: s.order ?? 0 })));
  }, [existingServices, productId]);

  useEffect(() => {
    if (!isEdit || !productId || !allTypes) return;
    const myTypes = (allTypes ?? []).filter((t) => Number(t.wGProductId) === Number(productId))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setVTypes(myTypes.map((t) => ({
      localId: newLocalId(), id: t.id, name: t.name, displayType: t.displayType ?? "button", order: t.order ?? 0,
      options: (allOptions ?? []).filter((o) => Number(o.wGVariantTypeId) === Number(t.id))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((o) => ({ localId: newLocalId(), id: o.id, value: o.value, colorHex: o.colorHex ?? null, order: o.order ?? 0 })),
    })));
  }, [isEdit, productId, allTypes, allOptions]);

  // ── Kombinasyonlar ──
  const generatedCombos = useMemo(() => {
    if (vTypes.length === 0) return [];
    const axes = vTypes.map((t) => t.options.map((o) => o.value));
    if (axes.some((a) => a.length === 0)) return [];
    let result: string[][] = [[]];
    axes.forEach((vals) => {
      const next: string[][] = [];
      result.forEach((combo) => vals.forEach((v) => next.push([...combo, v])));
      result = next;
    });
    return result.map((parts) => ({ key: parts.join("|"), label: parts.join(" - ") }));
  }, [vTypes]);

  const productVariants = useMemo(
    () => (allVariants ?? []).filter((v) => Number(v.wGProductId) === Number(productId)),
    [allVariants, productId]
  );

  useEffect(() => {
    setCombos(generatedCombos.map((gc) => {
      const ex = productVariants.find((v) => v.combination === gc.label);
      return {
        key: gc.key, combination: gc.label,
        price: ex ? String(ex.price ?? "") : "", discountPercent: ex ? String(ex.discountPercent ?? "") : "",
        stock: ex ? String(ex.stock ?? "") : "", sku: ex?.sku ?? "",
        existingId: ex?.id, isActive: ex?.isActive ?? true,
      };
    }));
  }, [generatedCombos, productVariants]);

  // ── saveExtras / saveVariantsForProduct ──
  const saveExtras = async (pid: number) => {
    for (const f of features) {
      if (!f.value.trim()) continue;
      const payload = { value: f.value.trim(), icon: f.icon?.trim() || null, order: Number(f.order), wGProductId: pid };
      if (f.id) await updateFeature.mutateAsync({ id: f.id, payload });
      else await createFeature.mutateAsync(payload);
    }
    for (const s of services) {
      if (!s.value.trim()) continue;
      const payload = { value: s.value.trim(), icon: s.icon?.trim() || null, order: Number(s.order), wGProductId: pid };
      if (s.id) await updateService.mutateAsync({ id: s.id, payload });
      else await createService.mutateAsync(payload);
    }
  };

  const saveVariantsForProduct = async (pid: number) => {
    for (const t of vTypes) {
      const ct: any = await createType.mutateAsync({ name: t.name, displayType: t.displayType, order: t.order, wGProductId: pid });
      const typeId = ct?.id ?? ct?.data?.id ?? ct?.result?.id;
      for (const o of t.options) {
        await createOption.mutateAsync({ value: o.value, colorHex: o.colorHex, order: o.order, wGVariantTypeId: typeId });
      }
    }
    for (const c of combos) {
      if (c.price && c.stock) {
        await createVariant.mutateAsync({
          combination: c.combination, sku: c.sku?.trim() || null,
          price: Number(c.price), discountPercent: c.discountPercent ? Number(c.discountPercent) : null,
          stock: Number(c.stock), isActive: c.isActive, wGProductId: pid,
        });
      }
    }
  };

  // ── Görsel yükleme (formik'e yazar) ──
  const handleMainImage = (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    uploadFile.mutate(file, {
      onSuccess: (returned: any) => {
        const name = typeof returned === "string" ? returned : (returned?.fileName ?? returned?.data ?? "");
        formik.setFieldValue("mainImage", name);
        formik.setFieldTouched("mainImage", true, false);
        setUploading(false);
      },
      onError: () => { setUploading(false); formik.setFieldError("mainImage", "Görsel yüklenemedi."); },
    });
  };

  const handleGallery = (files: File[]) => {
    files.forEach((file) => {
      uploadFile.mutate(file, {
        onSuccess: (returned: any) => {
          const name = typeof returned === "string" ? returned : (returned?.fileName ?? returned?.data ?? "");
          if (name) formik.setFieldValue("gallery", [...formik.values.gallery, name]);
        },
      });
    });
  };

  // ── Dizi işlemleri (inline hata için setError döndürmüyoruz; component kontrol eder) ──
  const addFeatureRow = () => setFeatures((p) => [...p, { localId: newLocalId(), value: "", icon: "", order: p.length + 1 }]);
  const updateFeatureRow = (lid: string, field: keyof ExtraRow, val: any) =>
    setFeatures((p) => p.map((r) => r.localId === lid ? { ...r, [field]: val } : r));
  const removeFeatureRow = async (lid: string, dbId?: number) => {
    if (dbId) { try { await deleteFeature.mutateAsync(dbId); } catch { return; } }
    setFeatures((p) => p.filter((r) => r.localId !== lid));
  };

  const addServiceRow = () => setServices((p) => [...p, { localId: newLocalId(), value: "", icon: "", order: p.length + 1 }]);
  const updateServiceRow = (lid: string, field: keyof ExtraRow, val: any) =>
    setServices((p) => p.map((r) => r.localId === lid ? { ...r, [field]: val } : r));
  const removeServiceRow = async (lid: string, dbId?: number) => {
    if (dbId) { try { await deleteService.mutateAsync(dbId); } catch { return; } }
    setServices((p) => p.filter((r) => r.localId !== lid));
  };

  // ── Eksen / seçenek ──
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDisplay, setNewTypeDisplay] = useState("button");
  const [optionInputs, setOptionInputs] = useState<Record<string, { value: string; colorHex: string }>>({});
  const [variantError, setVariantError] = useState<string>("");

  const addType = async () => {
    if (!newTypeName.trim()) { setVariantError("Eksen adı girin."); return; }
    setVariantError("");
    const order = vTypes.length + 1;
    if (isEdit && productId) {
      try {
        const ct: any = await createType.mutateAsync({ name: newTypeName.trim(), displayType: newTypeDisplay, order, wGProductId: productId });
        const newId = ct?.id ?? ct?.data?.id ?? ct?.result?.id;
        setVTypes((p) => [...p, { localId: newLocalId(), id: newId, name: newTypeName.trim(), displayType: newTypeDisplay, order, options: [] }]);
      } catch { setVariantError("Eksen eklenemedi."); return; }
    } else {
      setVTypes((p) => [...p, { localId: newLocalId(), name: newTypeName.trim(), displayType: newTypeDisplay, order, options: [] }]);
    }
    setNewTypeName("");
  };

  const removeType = async (t: LocalType) => {
    if (isEdit && t.id) {
      try { for (const o of t.options) if (o.id) await deleteOption.mutateAsync(o.id); await deleteType.mutateAsync(t.id); }
      catch { setVariantError("Eksen silinemedi."); return; }
    }
    setVTypes((p) => p.filter((x) => x.localId !== t.localId));
  };

  const addOption = async (t: LocalType) => {
    const isColor = (t.displayType ?? "").toLowerCase().includes("color");
    const inp = optionInputs[t.localId] ?? { value: "", colorHex: "#000000" };
    if (!inp.value.trim()) { setVariantError("Seçenek değeri girin."); return; }
    setVariantError("");
    const order = t.options.length + 1;
    const colorHex = isColor ? inp.colorHex : null;
    if (isEdit && t.id) {
      try {
        const co: any = await createOption.mutateAsync({ value: inp.value.trim(), colorHex, order, wGVariantTypeId: t.id });
        const newId = co?.id ?? co?.data?.id ?? co?.result?.id;
        setVTypes((p) => p.map((x) => x.localId === t.localId
          ? { ...x, options: [...x.options, { localId: newLocalId(), id: newId, value: inp.value.trim(), colorHex, order }] } : x));
      } catch { setVariantError("Seçenek eklenemedi."); return; }
    } else {
      setVTypes((p) => p.map((x) => x.localId === t.localId
        ? { ...x, options: [...x.options, { localId: newLocalId(), value: inp.value.trim(), colorHex, order }] } : x));
    }
    setOptionInputs((p) => ({ ...p, [t.localId]: { value: "", colorHex: "#000000" } }));
  };

  const removeOption = async (t: LocalType, o: LocalOption) => {
    if (isEdit && o.id) { try { await deleteOption.mutateAsync(o.id); } catch { setVariantError("Silinemedi."); return; } }
    setVTypes((p) => p.map((x) => x.localId === t.localId ? { ...x, options: x.options.filter((y) => y.localId !== o.localId) } : x));
  };

  const updateCombo = (key: string, field: keyof ComboRow, val: any) =>
    setCombos((p) => p.map((c) => c.key === key ? { ...c, [field]: val } : c));

  const saveCombo = async (c: ComboRow) => {
    if (!productId) { setVariantError("Önce ürünü kaydedin."); return; }
    if (!c.price || isNaN(Number(c.price))) { setVariantError("Geçerli fiyat girin."); return; }
    if (!c.stock || isNaN(Number(c.stock))) { setVariantError("Geçerli stok girin."); return; }
    setVariantError("");
    const payload = {
      combination: c.combination, sku: c.sku?.trim() || null,
      price: Number(c.price), discountPercent: c.discountPercent ? Number(c.discountPercent) : null,
      stock: Number(c.stock), isActive: c.isActive, wGProductId: productId,
    };
    try {
      if (c.existingId) await updateVariant.mutateAsync({ id: c.existingId, payload });
      else await createVariant.mutateAsync(payload);
    } catch { setVariantError("Kaydedilemedi."); }
  };

  const saving = createRow.isPending || updateRow.isPending || createVariant.isPending
    || createFeature.isPending || updateFeature.isPending
    || createService.isPending || updateService.isPending
    || createType.isPending || createOption.isPending;

  return {
    isEdit, productId, loadingProduct, navigate,
    categories, formik, uploading, saving,
    handleMainImage, handleGallery,
    // diziler
    features, addFeatureRow, updateFeatureRow, removeFeatureRow,
    services, addServiceRow, updateServiceRow, removeServiceRow,
    vTypes, newTypeName, setNewTypeName, newTypeDisplay, setNewTypeDisplay,
    optionInputs, setOptionInputs, addType, removeType, addOption, removeOption,
    combos, updateCombo, saveCombo, variantError,
  };
};