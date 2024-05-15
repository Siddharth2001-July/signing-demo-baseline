import { AnnotationTypeEnum, User } from "../utils/types";
//import { Instance } from "pspdfkit";

const renderConfigurations: any = {};

export const TOOLBAR_ITEMS = [
  { type: "sidebar-thumbnails" },
  { type: "sidebar-document-outline" },
  { type: "pager" },
  { type: "layout-config" },
  { type: "pan" },
  { type: "zoom-out" },
  { type: "zoom-in" },
  { type: "search" },
  { type: "spacer" },
  { type: "print" },
  { type: "export-pdf" },
];

function createCustomSignatureNode({ annotation, type }: any) {
  const container = document.createElement("div");

  if (type === AnnotationTypeEnum.SIGNATURE) {
    container.innerHTML = `<div class="custom-annotation-wrapper custom-signature-wrapper" style="background-color: ${annotation.customData?.signerColor}">
        <div class="custom-signature">
          <div class="custom-signature-label">
             Sign
          </div>
          <svg fill="#000000" width="25px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>down-round</title>
            <path d="M0 16q0-3.232 1.28-6.208t3.392-5.12 5.12-3.392 6.208-1.28q3.264 0 6.24 1.28t5.088 3.392 3.392 5.12 1.28 6.208q0 3.264-1.28 6.208t-3.392 5.12-5.12 3.424-6.208 1.248-6.208-1.248-5.12-3.424-3.392-5.12-1.28-6.208zM4 16q0 3.264 1.6 6.048t4.384 4.352 6.016 1.6 6.016-1.6 4.384-4.352 1.6-6.048-1.6-6.016-4.384-4.352-6.016-1.632-6.016 1.632-4.384 4.352-1.6 6.016zM10.048 18.4q-0.128-0.576 0.096-1.152t0.736-0.896 1.12-0.352h2.016v-5.984q0-0.832 0.576-1.408t1.408-0.608 1.408 0.608 0.608 1.408v5.984h1.984q0.608 0 1.12 0.352t0.736 0.896q0.224 0.576 0.096 1.152t-0.544 1.024l-4 4q-0.576 0.576-1.408 0.576t-1.408-0.576l-4-4q-0.448-0.416-0.544-1.024z"></path>
          </svg>
        </div>
      </div>`;
  } else if (type === AnnotationTypeEnum.INITIAL) {
    container.innerHTML = `<div class="custom-annotation-wrapper custom-signature-wrapper" style="background-color: ${annotation.customData?.signerColor}">
        <div class="custom-signature">
          <div class="custom-signature-label">
             Initial
          </div>
          <svg fill="#000000" width="25px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>down-round</title>
            <path d="M0 16q0-3.232 1.28-6.208t3.392-5.12 5.12-3.392 6.208-1.28q3.264 0 6.24 1.28t5.088 3.392 3.392 5.12 1.28 6.208q0 3.264-1.28 6.208t-3.392 5.12-5.12 3.424-6.208 1.248-6.208-1.248-5.12-3.424-3.392-5.12-1.28-6.208zM4 16q0 3.264 1.6 6.048t4.384 4.352 6.016 1.6 6.016-1.6 4.384-4.352 1.6-6.048-1.6-6.016-4.384-4.352-6.016-1.632-6.016 1.632-4.384 4.352-1.6 6.016zM10.048 18.4q-0.128-0.576 0.096-1.152t0.736-0.896 1.12-0.352h2.016v-5.984q0-0.832 0.576-1.408t1.408-0.608 1.408 0.608 0.608 1.408v5.984h1.984q0.608 0 1.12 0.352t0.736 0.896q0.224 0.576 0.096 1.152t-0.544 1.024l-4 4q-0.576 0.576-1.408 0.576t-1.408-0.576l-4-4q-0.448-0.416-0.544-1.024z"></path>
          </svg>
        </div>
      </div>`;
  }

  return container;
}

export const getAnnotationRenderers = ({ annotation }: any) => {
  if (annotation.isSignature) {
    return;
  }

  if (annotation.name) {
    if (renderConfigurations[annotation.id]) {
      return renderConfigurations[annotation.id];
    }

    renderConfigurations[annotation.id] = {
      node: createCustomSignatureNode({
        annotation,
        type: annotation.customData?.type,
      }),
      append: true,
    };

    return renderConfigurations[annotation.id] || null;
  }
};

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

        // if (
        //   maybeCorrectAnnotation.customData?.type === AnnotationTypeEnum.DATE &&
        //   maybeCorrectAnnotation?.customData?.signerEmail === myEmail
        // ) {
        //   // save the signDate in the customData of the annotation
        //   // @ts-ignore
        //   //const instance = document.pspdfkitInstance;
        //   const date = formatDateString(Date.now(), "2-digit");
        //   const annotation = maybeCorrectAnnotation.set("text", {
        //     format: "plain",
        //     value: date,
        //   });
        //   const dateAnnotationRender = getAnnotationRenderers({
        //     annotation: maybeCorrectAnnotation,
        //   });
        //   if (dateAnnotationRender?.node) {
        //     const dateAnnotation = dateAnnotationRender.node.querySelector(
        //       ".custom-annotation-name"
        //     );
        //     dateAnnotation.innerHTML = date;
        //     dateAnnotationRender.node.className =
        //       dateAnnotationRender.node.className + " signed";
        //   }
        //   await instance.update(annotation);
        //   await instance.save();
        // } else if (
        //   maybeCorrectAnnotation.customData?.type === AnnotationTypeEnum.NAME &&
        //   maybeCorrectAnnotation?.customData?.signerEmail === myEmail
        // ) {
        //   //@ts-ignore
        //   const instance = document.pspdfkitInstance;
        //   const nameAnnotationRender = getAnnotationRenderers({
        //     annotation: maybeCorrectAnnotation,
        //   });

        //   nameAnnotationRender.node.className =
        //     nameAnnotationRender.node.className + " signed";

        //   await instance.update(maybeCorrectAnnotation);
        //   await instance.save();
        // }
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

        // if (
        //   maybeCorrectAnnotation.customData?.type === AnnotationTypeEnum.DATE &&
        //   maybeCorrectAnnotation?.customData?.signerEmail === myEmail
        // ) {
        //   // save the signDate in the customData of the annotation
        //   //@ts-ignore
        //   //const instance = document.pspdfkitInstance;
        //   const annotation = maybeCorrectAnnotation.set("text", {
        //     format: "plain",
        //     value: "Date Signed",
        //   });
        //   const dateAnnotationRender = getAnnotationRenderers({
        //     annotation: maybeCorrectAnnotation,
        //   });
        //   if (dateAnnotationRender?.node) {
        //     dateAnnotationRender.node.querySelector(
        //       ".custom-annotation-name"
        //     ).innerHTML = "Date Signed";
        //   }
        //   dateAnnotationRender.node.className = "";
        //   await instance.update(annotation);
        //   await instance.save();
        // } else if (
        //   maybeCorrectAnnotation.customData?.type === AnnotationTypeEnum.NAME &&
        //   maybeCorrectAnnotation?.customData?.signerEmail === myEmail
        // ) {
        //   //@ts-ignore
        //   const instance = document.pspdfkitInstance;
        //   const nameAnnotationRender = getAnnotationRenderers({
        //     annotation: maybeCorrectAnnotation,
        //   });

        //   nameAnnotationRender.node.className = "";

        //   await instance.update(maybeCorrectAnnotation);
        //   await instance.save();
        // }
      }
    }
  }
};
export const downArrowSVG = (
  `<svg
    fill="currentColor"
    role="presentation"
    size="20"
    height="20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
  >
    <path
      d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
	c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
	s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
    />
  </svg>`
);
export const upArrowSVG = (
  <svg
    fill="#000000"
    height="20px"
    width="20px"
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 20 20"
    xmlSpace="preserve"
  >
    <path
      id="XMLID_224_"
      d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394
	l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393
	C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
    />
  </svg>
);
export const initialsSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="12"
    height="12"
    aria-hidden="true"
    focusable="false"
    data-qa="tab-palette-item-icon"
  >
    <path d="M0 14h16v2H0v-2zM3.72.74c.79 0 1.42.13 1.91.39s.86.62 1.13 1.1c.26.48.44 1.05.54 1.73.09.67.14 1.42.14 2.25 0 .99-.06 1.85-.18 2.58s-.33 1.33-.62 1.81c-.29.47-.69.83-1.18 1.06-.5.22-1.13.34-1.88.34H0V.74h3.72zm-.44 9.59c.4 0 .72-.07.96-.21.24-.14.43-.36.58-.68.14-.31.23-.73.28-1.24.05-.51.07-1.16.07-1.92 0-.64-.02-1.2-.06-1.69-.04-.49-.13-.89-.26-1.21-.13-.32-.33-.56-.59-.72-.26-.16-.6-.24-1.03-.24h-.96v7.91h1.01zm7.5-1.52c0 .26.02.5.06.72.04.22.12.4.24.54.12.15.27.26.46.35.19.08.44.13.73.13.35 0 .66-.11.94-.34.28-.23.42-.58.42-1.05 0-.25-.03-.47-.1-.65a1.35 1.35 0 0 0-.34-.5c-.16-.15-.37-.28-.62-.4a7.91 7.91 0 0 0-.95-.37c-.5-.17-.94-.35-1.31-.55-.37-.2-.68-.43-.92-.7-.25-.28-.43-.59-.55-.94-.11-.35-.17-.76-.17-1.22 0-1.11.31-1.94.93-2.49.62-.55 1.47-.82 2.55-.82.5 0 .97.05 1.39.17.42.12.79.29 1.1.54.31.25.55.56.73.95.17.38.26.84.26 1.38v.32h-2.17c0-.54-.09-.95-.28-1.24-.19-.29-.5-.43-.95-.43-.25 0-.46.04-.63.11a1.011 1.011 0 0 0-.61.71c-.04.16-.06.32-.06.49 0 .35.07.64.22.87.15.24.46.45.95.65l1.75.76c.43.19.78.39 1.06.59.27.21.49.43.65.66.16.24.28.5.34.78.07.27.1.59.1.93 0 1.19-.34 2.05-1.03 2.59s-1.65.81-2.88.81c-1.28 0-2.2-.28-2.75-.84-.55-.56-.83-1.36-.83-2.4v-.44h2.27v.33z"></path>
  </svg>
);
export const signSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="12"
    height="12"
    aria-hidden="true"
    focusable="false"
    data-qa="tab-palette-item-icon"
  >
    <path d="M22 21v1H3v-1zM20.7 4.72a3 3 0 0 1-.58 3.4L8.66 19.59 3 21l1.41-5.66L15.88 3.88A3 3 0 0 1 18 3a3 3 0 0 1 1.28.3L20.59 2 22 3.41zM10.46 15.1 8.9 13.54l-2.77 2.77-.52 2.08 2.08-.52zM19.1 6a1.1 1.1 0 0 0-1.88-.78L9.54 12.9l1.56 1.56 7.68-7.68A1.1 1.1 0 0 0 19.1 6z"></path>
  </svg>
);

export const personSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="12"
    height="12"
    aria-hidden="true"
    focusable="false"
    data-qa="tab-palette-item-icon"
  >
    <path d="M15.31 11.72A4.94 4.94 0 0 0 17 8 5 5 0 0 0 7 8a4.94 4.94 0 0 0 1.69 3.72A8 8 0 0 0 4 19v2h16v-2a8 8 0 0 0-4.69-7.28zM12 4.9A3.1 3.1 0 1 1 8.9 8 3.1 3.1 0 0 1 12 4.9zM6 19a6 6 0 0 1 12 0z"></path>
  </svg>
);
export const dateSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="12"
    height="12"
    aria-hidden="true"
    focusable="false"
    data-qa="tab-palette-item-icon"
  >
    <path d="M20 3h-3V2h-1v1H8V2H7v1H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 16H5V5h2v1h1V5h8v1h1V5h2zM13 8v9h-2v-7H9V9l2-1z"></path>
  </svg>
);

// export const signHereWidget = document.createElement("div");
// (signHereWidget.innerHTML =
//   '\n<svg viewBox="193.583 215.541 113.747 40.714" width="113.747" height="40.714">\n  <path d="M 193.709 216.256 H 287.206 L 287.206 216.256 L 307.206 236.256 L 287.206 256.256 L 287.206 256.256 H 193.709 V 216.256 Z" data-bx-shape="arrow 193.709 216.256 113.497 40 40 20 0 1@f3ec9ecd" style="fill: rgb(90, 120, 255); stroke: rgb(255, 255, 255); stroke-opacity: 0;" transform="matrix(0.99998, -0.0063, 0.0063, 0.99998, -1.484668, 1.225137)"></path>\n  <text style="fill: rgb(254, 254, 254); font-family: Arial, sans-serif; font-size: 19.1px; stroke-opacity: 0; white-space: pre;" x="201.663" y="242.006">Sign Here</text>\n</svg>\n'),
//   (signHereWidget.style.position = "absolute"),
//   document.body.appendChild(signHereWidget);
// // Define a helper function to check if one box is within another.
// export const updateSignHereWidget = async (instance : Instance) => {
//   const widgetAnnotations = (
//       await Promise.all(
//         Array.from({ length: instance.totalPageCount }).map((_, pageIndex) =>
//           instance
//             .getAnnotations(pageIndex)
//             .then((annotations) =>
//               annotations.filter(
//                 (annotation) =>
//                   annotation instanceof PSPDFKit.Annotations.WidgetAnnotation
//               )
//             )
//         )
//       )
//     )
//       .flat()
//       .flatMap((annotation) =>
//         // @ts-ignore
//         annotation._tail ? annotation._tail.array : []
//       ),
//     signatures = (
//       await Promise.all(
//         Array.from({ length: instance.totalPageCount }).map((_, pageIndex) =>
//           instance
//             .getAnnotations(pageIndex)
//             .then((annotations) =>
//               annotations.filter(
//                 (annotation) => void 0 !== annotation.isSignature
//               )
//             )
//         )
//       )
//     )
//       .flat()
//       // @ts-ignore
//       .flatMap((signature) => (signature._tail ? signature._tail.array : []));
//   // Flatten widgetAnnotationsUnFlattened to a single dimensional array
//   // Move the "Sign Here" widget.
//   let firstWidget = widgetAnnotations.filter((annotation) => {
//     let signatureSet = !1;
//     return (
//       signatures.length > 0 &&
//         (signatureSet = signatures.some((signature) => {
//           return (
//             (box1 = signature.boundingBox),
//             (box2 = annotation.boundingBox),
//             box1.left >= box2.left &&
//               box1.top >= box2.top &&
//               box1.left + box1.width <= box2.left + box2.width &&
//               box1.top + box1.height <= box2.top + box2.height
//           );
//           var box1, box2;
//           // This function updates the position of the "Sign Here" widget.
//         })),
//       !signatureSet
//     );
//   })[0];
//   if (firstWidget) {
//     const element = instance.contentDocument.querySelector(
//         `.PSPDFKit-Annotation[data-annotation-id="${firstWidget.id}"]`
//       ),
//       state = instance.viewState;
//     // Switch to the page of the current signature widget.
//     instance.setViewState(state.set("currentPageIndex", firstWidget.pageIndex));
//     if(element === null) return;
//     const position = element.getBoundingClientRect();
//     (signHereWidget.style.top = position.top - window.scrollY + "px"),
//       (signHereWidget.style.display = "block");
//   } else
//     "block" === signHereWidget.style.display &&
//       alert("Thank you for signing the document, you are now a PDF Expert!"),
//       (signHereWidget.style.display = "none");
// };
