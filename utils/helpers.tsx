import { AnnotationTypeEnum, User } from "@/utils/types";
import getAnnotationRenderers from "@/app/components/PDFViewer/utils/customAnnotationRenderer";

export const TOOLBAR_ITEMS = [
  { type: "sidebar-thumbnails" },
  { type: "sidebar-document-outline" },
  { type: "sidebar-annotations" },
  { type: "sidebar-signatures" },
  { type: "pager" },
  { type: "layout-config" },
  { type: "pan" },
  { type: "zoom-out" },
  { type: "zoom-in" },
  { type: "search" },
  { type: "spacer" },
  { type: "print" },
  { type: "export-pdf" },
  { type: "form-creator" },
];

export const handleAnnotatitonCreation = async (
  instance: any,
  annotation: any,
  mySignatureIdsRef: any,
  setSignatureAnnotationIds: any,
  myEmail: string
) => {
  if (annotation.isSignature) {
    for (let i = 0; i < instance.totalPageCount; i++) {
      const annotations = await instance.getAnnotations(i);
      for await (const maybeCorrectAnnotation of annotations) {
        if (
          annotation.boundingBox.isRectOverlapping(
            maybeCorrectAnnotation.boundingBox
          )
        ) {
          const newAnnotation = getAnnotationRenderers({
            annotation: maybeCorrectAnnotation,
          });
          if (newAnnotation?.node) {
            newAnnotation.node.className = "signed";
          }
        }
      }
    }
    const signatures = [...mySignatureIdsRef.current, annotation.id];
    setSignatureAnnotationIds(signatures);
    mySignatureIdsRef.current = signatures;
  }
};

export const handleAnnotatitonDelete = async (
  instance: any,
  annotation: any,
  myEmail: string
) => {
  if (annotation.isSignature) {
    for (let i = 0; i < instance.totalPageCount; i++) {
      const annotations = await instance.getAnnotations(i);
      for await (const maybeCorrectAnnotation of annotations) {
        if (
          annotation.boundingBox.isRectOverlapping(
            maybeCorrectAnnotation.boundingBox
          )
        ) {
          const newAnnotation = getAnnotationRenderers({
            annotation: maybeCorrectAnnotation,
          });
          if (newAnnotation?.node) {
            newAnnotation.node.className = "";
          }
        }
      }
    }
  }
};

export async function imageToBlob(imageUrl: string): Promise<Blob> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    throw error;
  }
}

 // Function to get random color for the signee
export const randomColor = (PSPDFKit: any, users:User[]) => {
  const colors: any = [
    PSPDFKit.Color.LIGHT_GREY,
    PSPDFKit.Color.LIGHT_GREEN,
    PSPDFKit.Color.LIGHT_YELLOW,
    PSPDFKit.Color.LIGHT_ORANGE,
    PSPDFKit.Color.LIGHT_RED,
    PSPDFKit.Color.LIGHT_BLUE,
    PSPDFKit.Color.fromHex("#0ffcf1"),
  ];
  const usedColors = users.map((signee) => signee.color);
  const availableColors = colors.filter(
    (color: any) => !usedColors.includes(color as any)
  );
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors[randomIndex];
};

export const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

export const applyDSign = async (instance:any, containerRef:any, setIsLoading:any, setPdfUrl:any) => {
  setIsLoading(true);
  try {
    const doc = await instance.exportPDF();
    const pdfBlob = new Blob([doc], { type: "application/pdf" });
    const imageBlob = await imageToBlob(`${window.location.protocol}//${window.location.host}/signed/watermark.jpg`);
    const formData = new FormData();
    formData.append('file', pdfBlob);
    formData.append('image', imageBlob);
    const res = await fetch('./api/digitalSigningLite', {
      method:'POST',
      body: formData
    })
    const container = containerRef.current; // This `useRef` instance will render the PDF.
    if(container && res.ok){
      const pdfBlob = await res.blob();
      const newPdfUrl = URL.createObjectURL(pdfBlob);
      // Load the new PDF into the viewer
      setPdfUrl(newPdfUrl);
    }
    else{
      alert("Error in signing");
    }
  } catch (error) {
    console.error('Error caught in catch block:', error);
  } finally{
    setIsLoading(false);
  }
}