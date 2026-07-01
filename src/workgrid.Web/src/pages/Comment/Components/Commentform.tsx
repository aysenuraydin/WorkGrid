import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; 
import { useUploadFile } from "hooks/useFiles";
import config from "config";
import { toast } from "react-toastify";
import { useCommentContext } from "context/Commentcontext";

interface CommentFormProps {
  parentId?: number | null;  
  onDone?: () => void;       
}

const RatingPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="d-inline-flex gap-1 fs-4">
    {[1, 2, 3, 4, 5].map(i => (
      <i
        key={i}
        role="button"
        className={(i <= value ? "mdi mdi-star text-warning" : "mdi mdi-star-outline text-muted")}
        onClick={() => onChange(i)}
      />
    ))}
  </div>
);

export const CommentForm: React.FC<CommentFormProps> = ({ parentId = null, onDone }) => {
  const { itemType, itemId, isRating, create } = useCommentContext();
  const { mutateAsync: uploadFile } = useUploadFile();
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const formik = useFormik({
    initialValues: { content: "", rating: 0 },
    validationSchema: Yup.object({
      content: Yup.string().trim().required("Yorum boş olamaz.").max(2000, "Yorum çok uzun."),
      rating: isRating &&  parentId == null
        ? Yup.number().min(1, "Puan verin.").max(5).required("Puan verin.")
        : Yup.number().notRequired(),
    }),
    onSubmit: (values, { resetForm }) => {
      create.mutate(
        {
          itemId,
          itemType,
          content: values.content.trim(),
          rating: isRating  &&  parentId == null ? values.rating : null,
          parentId,
          images: images.join(","),
        },
        {
          onSuccess: () => {
            toast.success("Yorum eklendi.");
            resetForm();
            setImages([]);
            onDone?.();
          },
          onError: () => toast.error("Yorum eklenemedi."),
        }
      );
    },
  });

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const names = await Promise.all(files.map(f => uploadFile(f)));
      setImages(prev => [...prev, ...names]);
    } catch {
      toast.error("Resim yüklenemedi.");
    } finally {
      setUploading(false);
      e.target.value = ""; 
    }
  };

  const removeImage = (idx: number) =>
    setImages(prev => prev.filter((_, i) => i !== idx));

  return (
    <form className="mt-3" onSubmit={formik.handleSubmit}>
      {(isRating && parentId == null) && (
        <div className="mb-2">
          <RatingPicker value={formik.values.rating} onChange={v => formik.setFieldValue("rating", v)} />
          {formik.touched.rating && formik.errors.rating && (
            <div className="text-danger fs-12">{String(formik.errors.rating)}</div>
          )}
        </div>
      )}

      <textarea
        className={"form-control border-light border border-2 " + (formik.touched.content && formik.errors.content ? "is-invalid" : "")}
        rows={3}
        placeholder={parentId ? "Yanıt yaz..." : "Yorumunuzu yazın..."}
        name="content"
        value={formik.values.content}
        onChange={formik.handleChange} 
        onBlur={formik.handleBlur}
      />
      {formik.touched.content && formik.errors.content && (
        <div className="text-danger fs-12 mt-1">{String(formik.errors.content)}</div>
      )}

      {images.length > 0 && (
        <div className="d-flex gap-2 flex-wrap mt-2">
          {images.map((img, i) => (
            <div key={i} className="position-relative">
              <img
                src={img.startsWith("http") ? img : `${config.api.FILE_API_URL}/File/${img}`}
                alt=""
                className="avatar-sm rounded object-fit-cover"
              />
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0 px-1"
                style={{ transform: "translate(30%,-30%)" }}
                onClick={() => removeImage(i)}
              >
                <i className="ri-close-line" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-2">
        <label className="btn btn-ghost-secondary btn-icon mb-0" role="button">
          <i className="ri-attachment-line fs-16" />
          <input type="file" hidden multiple accept="image/*" onChange={handleFiles} />
        </label>

        <div className="d-flex gap-2">
          {parentId && (
            <button type="button" className="btn btn-light" onClick={onDone}>İptal</button>
          )}
          <button type="submit" className="btn btn-primary" disabled={create.isPending || uploading}>
            {uploading ? "Yükleniyor…" : create.isPending ? "Gönderiliyor…" : parentId ? "Yanıtla" : "Gönder"}
          </button>
        </div>
      </div>
    </form>
  );
};