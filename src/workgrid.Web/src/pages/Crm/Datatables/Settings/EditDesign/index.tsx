import Editor from "@monaco-editor/react";
import { AutoComplete } from "antd"; 
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Alert, Form, Label } from 'reactstrap';
import { useEditDesigns } from './hooks/useEditDesigns';
import './EditDesign.css';
import { useDataTable } from "context/DatatableContext";
import { DARK_COLOR } from "context/Tenantbootstrap";
import useThemeMode from "hooks/useThemeMode";
    
export const EditDesign = ({ }) => { 
    const { modal } = useDataTable();  
    const { isDark } = useThemeMode(); 
    const {
        columns, 
        formik, 
        openDefault, 
        toggleDefault, 
        setOpenDefault, 
        options, 
        changedMap, 
        handleSearch, 
        handleSelect, 
        setChangedMap, 
        colWith, 
        editorRefs, 
        handleMouseDown
    } = useEditDesigns(modal.table?.id);

    return (
        <div>
            <Label htmlFor="foreignTablesId" className="form-label">
                Tasarımlar
            </Label>
            {columns?.length === 0 && (
                <Alert color="danger" isOpen={true} className="p-3">
                    Sütun bulunamadı! Tasarımları görmek için sütun ekleyin.
                </Alert>
            )} 
            <Form className="tablelist-form" 
                style={{ height: "29.5rem" }}
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    formik.handleSubmit();
                }}> 
                <div className='hide-scrollbar h-100' style={{ overflow: "scroll", height: "29.5rem" }}>
                    <Accordion id="default-accordion-example" open={openDefault} toggle={toggleDefault}>
                        {(columns ?? []).map((col, index) => {
                            return (
                                <AccordionItem key={col.id} className={openDefault == col?.id.toString() ? "border border-primary" : ""}>
                                    <AccordionHeader targetId={String(col.id)} onDoubleClick={() => setOpenDefault('')}>
                                        {col?.name} - 
                                        ({" "}<span className="text-muted">{col?.type}</span> )
                                    </AccordionHeader>
                                    <AccordionBody accordionId={String(col.id)}>
                                        <div className="col-12 p-3 py-0" style={{ maxHeight: "22rem" }}>
                                            <div className="h-100 w-100" style={{ maxHeight: "16rem", width: "100%", overflow: "scroll" }}>
                                                <Label htmlFor={`field-${col?.id ?? 0}`} className="form-label pe-2">
                                                    <i className='mdi mdi-language-css3 me-1'></i>
                                                    Class
                                                </Label>
                                                <div className='code-view'>
                                                    <AutoComplete
                                                        options={options}
                                                        placeholder="border border-danger..."
                                                        style={{ width: "100%" }}
                                                        className={`p-2 no-focus-ring ${isDark ? 'bg-dark text-light' : ''} ${changedMap[`class.${col?.id}`] ? "bg-primary bg-opacity-10" : ""}`} 
                                                        value={formik.values.columns[index]?.class || ""}
                                                        onSearch={(text) => handleSearch(text, index)}
                                                        onSelect={(selected) => handleSelect(selected, index)}
                                                        onChange={(value) => {
                                                            formik.setFieldValue(`columns[${index}].class`, value);
                                                            setChangedMap(prev => ({ ...prev, [`class.${col.id}`]: true }));
                                                        }}
                                                    /> 
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='d-flex'>
                                                <div className={`p-3 pt-2 pb-0 col-${12 - colWith} position-relative`} style={{ maxHeight: "22rem" }}>
                                                    <div className="h-100 w-100" style={{ height: "14rem", width: "100%" }}>
                                                        <Label htmlFor={`field-${col?.id ?? 0}`} className="form-label pe-2">
                                                            <i className='mdi mdi-language-css3 me-1'></i>
                                                            Style
                                                        </Label>
                                                        <div className="code-view rounded" style={{ height: "230px" }}>
                                                            <div className="rounded py-3" style={{ backgroundColor: "#1E1E1E" }}> 
                                                                <Editor
                                                                    height="200px"
                                                                    language="css"
                                                                    theme="vs-dark"
                                                                    value={formik.values.columns[index]?.styles || ""}
                                                                    onMount={(editor) => { editorRefs.current[col.id] = editor; }} 
                                                                    options={{
                                                                        minimap: { enabled: false },
                                                                        fontSize: 14,
                                                                        automaticLayout: true,
                                                                        wordWrap: "on",
                                                                        tabSize: 2,
                                                                        lineNumbers: "on",
                                                                    }}
                                                                    onChange={(value) => {
                                                                        formik.setFieldValue(`columns[${index}].styles`, value);
                                                                        setChangedMap(prev => ({ ...prev, [`class.${col.id}`]: true }));
                                                                    }}
                                                                />
                                                            </div> 
                                                        </div>
                                                    </div> 
                                                </div>
                                                <div className={`p-3 pt-2 pb-0 col-${colWith} position-relative`} style={{ maxHeight: "22rem" }}>
                                                    <div className="h-100 w-100" style={{ height: "14rem", width: "100%" }}>
                                                        <Label htmlFor={`field-${col?.id ?? 0}`} className="form-label pe-2">
                                                            <i className='mdi mdi-language-javascript me-1'></i>
                                                            Js
                                                        </Label>
                                                        <div className="code-view rounded" style={{ height: "230px" }}>
                                                            <div className="rounded py-3" style={{ backgroundColor: "#1E1E1E" }}> 
                                                                <Editor
                                                                    height="200px"
                                                                    language="javascript"
                                                                    theme="vs-dark"
                                                                    value={formik.values.columns[index]?.js || ""}
                                                                    onMount={(editor) => { editorRefs.current[col.id] = editor; }}
                                                                    options={{
                                                                        minimap: { enabled: false },
                                                                        fontSize: 14,
                                                                        automaticLayout: true,
                                                                        wordWrap: "on",
                                                                        tabSize: 2,
                                                                        lineNumbers: "on",
                                                                    }}
                                                                    onChange={(value) => {
                                                                        formik.setFieldValue(`columns[${index}].js`, value);
                                                                        setChangedMap(prev => ({ ...prev, [`class.${col.id}`]: true }));
                                                                    }}
                                                                />
                                                            </div> 
                                                        </div>
                                                    </div>
                                                    <i onMouseDown={handleMouseDown}
                                                        className="bx bx-code position-absolute top-50 translate-middle start-0 mt-3 cursor-pointer fs-4"></i>
                                                </div>
                                            </div> 
                                        </div>
                                    </AccordionBody>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </div>
                <div className={`hstack gap-2 pt-2 pe-2 position-absolute end-0 start-0 bottom-0 justify-content-end border-top`}
                    style={{ backgroundColor: isDark ? DARK_COLOR : "white" }}>
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => modal.setEditSettingModal(false)}
                    >
                        <i className="ri-close-line fs-16 me-2"></i>
                        İptal
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-success"
                    >
                        <i className="ri-save-3-fill fs-16 me-2"></i>
                        Tasarımları Kaydet
                    </button>
                </div>
            </Form>
        </div>
    );
};

// eleements Senin TableContainer içinde document.querySelectorAll(selector) ile o kolona özel olarak seçtiğin bütün hücrelerin (DOM düğümlerinin) bir listesidir.

// elements.forEach(el => {
//     el.style.cursor = "pointer";
//     el.onmouseover = () => { el.style.opacity = "0.7"; };
//     el.onmouseout = () => { el.style.opacity = "1"; };
// });

// elements.forEach(el => {
//     const text = el.innerText.toLowerCase();
//     if (text.includes("iptal") || text.includes("danger")) {
//         el.style.color = "white";
//         el.style.backgroundColor = "#f06548";  
//         el.style.borderRadius = "4px";
//         el.style.padding = "2px 5px";
//     }
// }); 

// elements.forEach(el => {
//   const value = parseInt(el.innerText);
//   if (!isNaN(value)) {
//     el.innerHTML = `
//       <div style="width: 100%; background: #eee; border-radius: 10px; height: 10px;">
//         <div style="width: ${value}%; background: ${value > 80 ? '#0ab39c' : '#f7b84b'}; height: 10px; border-radius: 10px;"></div>
//       </div>
//       <small>${value}%</small>
//     `;
//   }
// });

// elements.forEach(el => {
//     el.onclick = () => {
//         // 1. İçeriği kopyala
//         navigator.clipboard.writeText(el.innerText);
        
//         // 2. En yakın satırı (tr) bul ve rengini değiştir
//         const row = el.closest("tr") || el.closest(".card");
//         if(row) row.style.backgroundColor = "#e1f5fe";
        
//         // 3. Kullanıcıya ufak bir bildirim (HTML enjekte etme)
//         el.innerHTML += ' <span style="font-size:10px; color:green;">(Kopyalandı!)</span>';
//     };
// });


//! 1. İçerik ve Metin Özellikleri
// Hücrenin içindeki veriyi okumak veya değiştirmek için kullanılır.

// el.innerText: Hücrenin içindeki görünen metni verir.
// el.innerHTML: Hücrenin içine HTML (ikon, div, button) koymanı sağlar.
// el.textContent: Gizli metinler dahil tüm saf metni verir.

//! 2. Stil ve Görünüm (el.style)
// CSS'de yapabildiğin her şeyi burada yapabilirsin. Yazım kuralı CSS'den biraz farklıdır (kebab-case yerine camelCase kullanılır):

// el.style.backgroundColor: Arka plan rengi.
// el.style.fontSize: Yazı boyutu.
// el.style.display: none yaparak gizleyebilir, block yaparak gösterebilirsin.
// el.style.border: Çerçeve ekler.
// el.style.visibility: hidden yaparak yerini tutarak gizler.

//! 3. Sınıf (Class) Yönetimi
// Stilleri tek tek vermek yerine CSS sınıflarıyla toplu işlem yapmanı sağlar:

// el.classList.add("yeni-sinif"): Bir CSS sınıfı ekler.
// el.classList.remove("eski-sinif"): Bir sınıfı siler.
// el.classList.toggle("aktif"): Sınıf varsa siler, yoksa ekler.
// el.className: Mevcut tüm sınıfları bir metin olarak verir/değiştirir.

//! 4. Olaylar (Events)
// Hücreyi interaktif hale getiren tetikleyicilerdir:

// el.onclick: Tıklandığında çalışır.
// el.onmouseenter / el.onmouseleave: Mouse girince/çıkınca.
// el.oncontextmenu: Sağ tıklandığında.
// el.ondblclick: Çift tıklandığında.

//! 5. Konum ve Boyut (Read-only)
// Hücrenin sayfadaki fiziksel durumunu anlamanı sağlar:

// el.offsetWidth: Hücrenin o anki genişliği (piksel).
// el.offsetHeight: Hücrenin o anki yüksekliği.
// el.getBoundingClientRect(): Hücrenin ekrandaki tam koordinatlarını (top, left, right, bottom) verir.

//! 6. Hiyerarşi (Komşulara Ulaşma)
// Hücreden yola çıkarak satıra veya başka bir hücreye gitmeni sağlar:

// el.parentElement: Hücrenin üstündeki etiketi (genelde td veya div) verir.
// el.closest("tr"): Hücrenin içinde bulunduğu en yakın satırı bulur (Çok kullanışlıdır!).
// el.children: Hücrenin içindeki alt elementleri verir.



//? Küçük Bir İpucu: Hepsini Nasıl Görebilirsin?
// Eğer tarayıcıda F12 basıp Console kısmına şu kodu yazarsan, bir elementin sahip olduğu tüm özellikleri liste halinde görebilirsin:

//! console.dir(document.querySelector('[data-col-id]'));