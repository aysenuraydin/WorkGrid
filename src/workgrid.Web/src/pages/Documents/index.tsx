import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Spinner } from "reactstrap";
import Editor, { OnMount } from "@monaco-editor/react";
import { useGetDocument, useUpdateDocument } from "hooks/useDocument";
import useThemeMode from "hooks/useThemeMode";
import { useAuth } from "context/AuthContext";
import { useUserProfile } from "hooks/useUser";

interface DocumentDto { description: string; }

const extractHtml = (raw: any): string => {
  if (raw == null) return "";
  if (typeof raw === "string") return raw;
  const d = raw.data ?? raw;
  return d?.description ?? "";
};

const DocumentPage: React.FC = () => {
  const { isDark } = useThemeMode();
  const { data, isLoading, isError } = useGetDocument();
  const updateMut = useUpdateDocument();

  const { user: usr } = useAuth();
  const { data: user } = useUserProfile(usr?.id ?? "");
  const isEditor = user?.roles?.includes("WG");

  const html = useMemo(() => extractHtml(data), [data]);

  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(false);  
  const [draft, setDraft] = useState("");
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (!editing) setDraft(html);
  }, [html, editing]);

  const onEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  // Monaco'daki güncel değer (editör açıkken canlı), değilse draft
  const liveValue = () => editorRef.current?.getValue?.() ?? draft;

  const startEdit = () => { setDraft(html); setPreview(false); setEditing(true); };
  const cancelEdit = () => { setDraft(html); setPreview(false); setEditing(false); };

  // Önizlemeye geçerken Monaco'daki son değeri draft'a al (kaybolmasın)
  const togglePreview = () => {
    if (!preview) setDraft(liveValue());
    setPreview((p) => !p);
  };

  const save = async () => {
    const value = liveValue();
    try {
      await updateMut.mutateAsync({ description: value } as DocumentDto);
      setEditing(false);
      setPreview(false);
    } catch {
      /* hata toast'u hook içinde */
    }
  };

  return (
    <div className="page-content">
      <style>{`
        .gb-doc-wrap { position: relative; }
        .gb-doc-bar {
          position: sticky; top: 70px; z-index: 5;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap; margin-bottom: 16px;
          background: var(--vz-card-bg); border: 1px solid var(--vz-border-color);
          border-radius: 10px; padding: 10px 14px;
        }
        .gb-doc-bar .gb-doc-title { display: flex; align-items: center; gap: 10px; }
        .gb-doc-bar .gb-doc-ico {
          width: 36px; height: 36px; border-radius: 9px; flex: none;
          display: flex; align-items: center; justify-content: center;
          background: rgba(var(--vz-primary-rgb), .12); color: var(--vz-primary); font-size: 19px;
        }
        .gb-doc-render {
          border: 1px solid var(--vz-border-color); border-radius: 12px;
          overflow: hidden; background: #fff;
        }
        .gb-doc-editor {
          border: 1px solid var(--vz-border-color); border-radius: 12px; overflow: hidden;
        }
        .gb-doc-editor-head {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; border-bottom: 1px solid var(--vz-border-color);
          background: var(--vz-light); font-size: 12.5px; color: var(--vz-secondary-color, #878a99);
          font-family: var(--bs-font-monospace);
        }
        .gb-doc-dot { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
        .gb-doc-preview-tag {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 20px;
          background: rgba(var(--vz-warning-rgb), .15); color: var(--vz-warning);
        }
      `}</style>

      <div className="gb-doc-wrap">
        {/* ── ÜST BAR ── */}
        <div className="gb-doc-bar">
          <div className="gb-doc-title">
            <span className="gb-doc-ico"><i className="ri-file-text-line"></i></span>
            <div>
              <h6 className="mb-0 fw-semibold">Dokümantasyon</h6>
              <small className="">
                {!editing
                  ? "Geliştirici dokümanı"
                  : preview
                    ? "Önizleme — kaydedilmedi"
                    : "Düzenleme modu — HTML kaynağı"}
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            {editing ? (
              <>
                <Button color="light" onClick={cancelEdit} disabled={updateMut.isPending}>
                  <i className="ri-close-line me-1"></i> Vazgeç
                </Button>
                <Button
                  color={"warning"}
                  outline={!preview}
                  onClick={togglePreview}
                  disabled={updateMut.isPending}
                >
                  {preview
                    ? <><i className="ri-code-s-slash-line me-1"></i> Koda dön</>
                    : <><i className="ri-eye-line me-1"></i> Önizleme</>}
                </Button>
                <Button color="primary" onClick={save} disabled={updateMut.isPending}>
                  {updateMut.isPending
                    ? <><Spinner size="sm" className="me-1" /> Kaydediliyor</>
                    : <><i className="ri-save-3-line me-1"></i> Kaydet</>}
                </Button>
              </>
            ) : (
              isEditor && (
                <Button color="primary" outline onClick={startEdit}>
                  <i className="ri-edit-2-line me-1"></i> Düzenle
                </Button>
              )
            )}
          </div>
        </div>

        {/* ── İÇERİK ── */}
        {isLoading ? (
          <div className="text-center text-muted py-5">
            <Spinner className="me-2" /> Doküman yükleniyor
          </div>
        ) : isError ? (
          <div className="text-center text-muted py-5">
            <i className="ri-error-warning-line display-6 opacity-25 d-block mb-2"></i>
            Doküman yüklenemedi.
          </div>
        ) : editing ? (
          preview ? (
            // ── DÜZENLEME İÇİNDE ÖNİZLEME (kaydedilmemiş taslak) ──
            <>
              <div className="d-flex justify-content-center mb-2">
                <span className="gb-doc-preview-tag">
                  <i className="ri-eye-line"></i> Bu bir önizlemedir — değişiklikler henüz kaydedilmedi
                </span>
              </div>
              {draft.trim() ? (
                <div className="gb-doc-render" dangerouslySetInnerHTML={{ __html: draft }} />
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="ri-file-list-3-line display-6 opacity-25 d-block mb-2"></i>
                  İçerik boş — önizlenecek bir şey yok.
                </div>
              )}
            </>
          ) : (
            // ── DÜZENLEME (Monaco) ──
            <div className="gb-doc-editor">
              <div className="gb-doc-editor-head">
                <span className="gb-doc-dot" style={{ background: "#f85149" }}></span>
                <span className="gb-doc-dot" style={{ background: "#d29922" }}></span>
                <span className="gb-doc-dot" style={{ background: "#3fb950" }}></span>
                <span className="ms-2">document.html</span>
              </div>
              <Editor
                height="calc(100vh - 220px)"
                defaultLanguage="html"
                value={draft}
                onChange={(v) => setDraft(v ?? "")}
                onMount={onEditorMount}
                theme={isDark ? "vs-dark" : "light"}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  wordWrap: "on",
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  formatOnPaste: true,
                }}
              />
            </div>
          )
        ) : (
          // ── GÖRÜNTÜLEME (kayıtlı içerik) ──
          html.trim() ? (
            <div className="gb-doc-render" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div className="text-center text-muted py-5">
              <i className="ri-file-list-3-line display-6 opacity-25 d-block mb-2"></i>
              Henüz doküman içeriği yok.
              {isEditor && <div className="mt-2"><Button color="primary" size="sm" onClick={startEdit}>
                <i className="ri-add-line me-1"></i> İçerik ekle
              </Button></div>}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DocumentPage;