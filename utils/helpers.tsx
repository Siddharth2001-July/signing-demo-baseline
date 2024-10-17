import { AnnotationTypeEnum, User } from "@/utils/types";

const renderConfigurations: any = {};

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

export async function onPressDuplicate(annotation:any, PSPDFKit:any, instance:any){
  if(annotation instanceof PSPDFKit.Annotations.WidgetAnnotation &&
    annotation?.customData?.type === AnnotationTypeEnum.TextField){
    // For the new annotation, we will copy the current one but
    // translate the annotation for 50px so that our users see the
    // duplicated annotation.
    const allFormFields = await instance.getFormFields();
    const formField = allFormFields.find(
      (field: any) => field.name === annotation.formFieldName
    );
    const newInstantId = PSPDFKit.generateInstantId();
    const newBoundingBox = annotation.boundingBox
      .set("top", annotation.boundingBox.top + 50)
      .set("left", annotation.boundingBox.left + 50);
    // To make duplication work, we also need to remove the ID
    // of the annotation.
    const duplicatedAnnotation = annotation
      .set("id", newInstantId)
      .set("name", newInstantId)
      .set("boundingBox", newBoundingBox)
      .set("formFieldName", newInstantId);
    // Updating formField with new options
    const randNum = Math.floor(Math.random() * 100);
    const newFormField = formField
      .set("annotationIds", new PSPDFKit.Immutable.List([newInstantId]))
      .set("id", newInstantId)
      .set("name", newInstantId);
    // In the end, we just use `createAnnotation` on our
    // PSPDFKit instance.
    //debugger;
    instance.create([duplicatedAnnotation, newFormField]);
  }

}

export const duplicateAnnotationTooltipCallback = (
  annotation: any,
  PSPDFKit: any,
  instance: any
) => {
  // Check if the annotation is a text annotation.
  if (
    annotation instanceof PSPDFKit.Annotations.WidgetAnnotation &&
    annotation?.customData?.type === AnnotationTypeEnum.TextField
  ) {
    // This is the tooltip item that will be used.
    const duplicateItem = {
      type: "custom",
      title: "Duplicate",
      id: "tooltip-duplicate-annotation",
      className: "TooltipItem-Duplication",
      onPress: async () => {
        await onPressDuplicate(annotation, PSPDFKit, instance);
      },
    };
    const requiredItem = {
      type: "custom",
      title: "Required/NotRequired",
      id: "tooltip-duplicate-annotation",
      className: "TooltipItem-Duplication",
      onPress: async () => {
        // Updating formField
        const allFormFields = await instance.getFormFields();
        const formField = allFormFields.find(
          (field: any) => field.name === annotation.formFieldName
        );
        const isRequired = formField.required;
        const updatedFormField = formField.set("required", !isRequired);
        // In the end, we just use `createAnnotation` on our
        // PSPDFKit instance.
        await instance.update(updatedFormField);
        alert("Field is now " + (isRequired ? "Not Required" : "Required"));
      },
    };
    return [duplicateItem, requiredItem];
  } else if (
    annotation instanceof PSPDFKit.Annotations.WidgetAnnotation &&
    annotation?.customData?.type === AnnotationTypeEnum.RadioButton
  ) {
    const duplicateItem = {
      type: "custom",
      title: "Add Option",
      id: "tooltip-duplicate-annotation",
      className: "TooltipItem-Duplication",
      onPress: async () => {
        // For the new annotation, we will copy the current one but
        // translate the annotation for 50px so that our users see the
        // duplicated annotation.
        const allFormFields = await instance.getFormFields();
        const formField = allFormFields.find(
          (field: any) => field.name === annotation.formFieldName
        );
        const newInstantId = PSPDFKit.generateInstantId();
        const newBoundingBox = annotation.boundingBox
          .set("top", annotation.boundingBox.top + 50)
          .set("left", annotation.boundingBox.left + 50);
        // To make duplication work, we also need to remove the ID
        // of the annotation.
        const duplicatedAnnotation = annotation
          .set("id", newInstantId)
          .set("name", newInstantId)
          .set("boundingBox", newBoundingBox);

        // Updating formField with new options
        const randNum = Math.floor(Math.random() * 100);
        const updatedFormField = formField
          .set(
            "annotationIds",
            new PSPDFKit.Immutable.List([
              ...formField.annotationIds,
              newInstantId,
            ])
          )
          .set(
            "options",
            new PSPDFKit.Immutable.List([
              ...formField.options,
              new PSPDFKit.FormOption({
                label: `Option ${randNum}`,
                value: `${randNum}`,
              }),
            ])
          );
        // In the end, we just use `createAnnotation` on our
        // PSPDFKit instance.
        await instance.create(duplicatedAnnotation);
        await instance.update(updatedFormField);
      },
    };
    const requiredItem = {
      type: "custom",
      title: "Required/NotRequired",
      id: "tooltip-duplicate-annotation",
      className: "TooltipItem-Duplication",
      onPress: async () => {
        // Updating formField
        const allFormFields = await instance.getFormFields();
        const formField = allFormFields.find(
          (field: any) => field.name === annotation.formFieldName
        );
        const isRequired = formField.required;
        const updatedFormField = formField.set("required", !isRequired);
        // In the end, we just use `createAnnotation` on our
        // PSPDFKit instance.
        await instance.update(updatedFormField);
        alert("Field is now " + (isRequired ? "Not Required" : "Required"));
      },
    };
    return [duplicateItem, requiredItem];
  } else if (
    annotation instanceof PSPDFKit.Annotations.WidgetAnnotation &&
    annotation?.customData?.type === AnnotationTypeEnum.CheckBox
  ) {
    const duplicateItem = {
      type: "custom",
      title: "Add Option",
      id: "tooltip-duplicate-annotation",
      className: "TooltipItem-Duplication",
      onPress: async () => {
        // For the new annotation, we will copy the current one but
        // translate the annotation for 50px so that our users see the
        // duplicated annotation.
        const allFormFields = await instance.getFormFields();
        const formField = allFormFields.find(
          (field: any) => field.name === annotation.formFieldName
        );
        const newInstantId = PSPDFKit.generateInstantId();
        const newBoundingBox = annotation.boundingBox
          .set("top", annotation.boundingBox.top + 50)
          .set("left", annotation.boundingBox.left + 50);
        // To make duplication work, we also need to remove the ID
        // of the annotation.
        const duplicatedAnnotation = annotation
          .set("id", newInstantId)
          .set("name", newInstantId)
          .set("boundingBox", newBoundingBox);

        // Updating formField with new options
        const randNum = Math.floor(Math.random() * 100);
        const updatedFormField = formField
          .set(
            "annotationIds",
            new PSPDFKit.Immutable.List([
              ...formField.annotationIds,
              newInstantId,
            ])
          )
          .set(
            "options",
            new PSPDFKit.Immutable.List([
              ...formField.options,
              new PSPDFKit.FormOption({
                label: `Option ${randNum}`,
                value: `${randNum}`,
              }),
            ])
          );
        // In the end, we just use `createAnnotation` on our
        // PSPDFKit instance.
        await instance.create(duplicatedAnnotation);
        await instance.update(updatedFormField);
      },
    };
    const requiredItem = {
      type: "custom",
      title: "Required/NotRequired",
      id: "tooltip-duplicate-annotation",
      className: "TooltipItem-Duplication",
      onPress: async () => {
        // Updating formField
        const allFormFields = await instance.getFormFields();
        const formField = allFormFields.find(
          (field: any) => field.name === annotation.formFieldName
        );
        const isRequired = formField.required;
        const updatedFormField = formField.set("required", !isRequired);
        // In the end, we just use `createAnnotation` on our
        // PSPDFKit instance.
        await instance.update(updatedFormField);
        alert("Field is now " + (isRequired ? "Not Required" : "Required"));
      },
    };
    return [duplicateItem, requiredItem];
  } else {
    return [];
  }
};

export const getAnnotationRenderers = ({ annotation }: any) => {
  if (
    annotation.isSignature &&
    annotation.customData?.type !== AnnotationTypeEnum.DS
  ) {
    // Create a new div element
    const box = document.createElement("div");

    // Apply box styles
    box.className = "signature-box-demo";
    box.innerHTML = `<span class="signature-label-demo">By PSPDFKit</span><span class="signature-id-demo">${
      annotation.id.substring(0, 15) + (annotation.id.length > 15 ? "..." : "")
    }</span>`;
    box.style.height = annotation.boundingBox.height / 16 + "rem";
    box.style.width = annotation.boundingBox.width / 16 + "rem";
    box.style.setProperty(
      "--box-height",
      annotation.boundingBox.height / 16 + "rem"
    );
    //box.style.margin = '0px';
    box.id = annotation.id;

    // Append the annotation to the box
    //box.appendChild(annotation.node);
    let ele = { node: box, append: true };
    // Replace the annotation with the box
    //annotation.node = box;
    return ele;
  } else {
    // return null;
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

export async function imageToBlob(imageUrl: string): Promise<Blob> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}

// *

export const handleDrop = async (e: any, inst: any, PSPDFKit: any, currSigneeRef:any, currUserRef:any, onPageIndexRef:any) => {
  e.preventDefault();
  e.stopPropagation();
  const dataArray = e.dataTransfer.getData("text").split("%");
  let [name, email, instantId, annotationType] = dataArray;
  instantId = PSPDFKit.generateInstantId();
  const signee = currSigneeRef.current;
  const user = currUserRef.current;
  const pageIndex = onPageIndexRef.current;
  let rectWidth = 120;
  let rectHeight = 40;
  switch (annotationType) {
    case AnnotationTypeEnum.INITIAL:
      rectWidth = 70;
      rectHeight = 40;
      break;

    case AnnotationTypeEnum.SIGNATURE:
      rectWidth = 120;
      rectHeight = 60;
      break;
    
    case AnnotationTypeEnum.DS:
      rectWidth = 250;
      rectHeight = 100;
      break;

    case AnnotationTypeEnum.RadioButton:
      rectWidth = 25;
      rectHeight = 25;
      break;

    case AnnotationTypeEnum.CheckBox:
      rectWidth = 25;
      rectHeight = 25;
      break;

    case AnnotationTypeEnum.TextField:
      rectWidth = 120;
      rectHeight = 40;
      break;
  
    default:
      break;
    }
  const clientRect = new PSPDFKit.Geometry.Rect({
    left: e.clientX - rectWidth / 2,
    top: e.clientY - rectHeight / 2,
    height: rectHeight,
    width: rectWidth,
  });
  const pageRect = inst.transformContentClientToPageSpace(
    clientRect,
    pageIndex
  ) as any;
  if (
    annotationType === AnnotationTypeEnum.SIGNATURE ||
    annotationType === AnnotationTypeEnum.INITIAL
  ) {
    const widget = new PSPDFKit.Annotations.WidgetAnnotation({
      boundingBox: pageRect,
      formFieldName: instantId,
      id: instantId,
      pageIndex,
      name: instantId,
      customData: {
        createdBy: user.id,
        signerID: signee.id,
        signerEmail: email,
        type: annotationType,
        signerColor: signee.color,
        isInitial: annotationType === AnnotationTypeEnum.INITIAL,
      },
      //backgroundColor: signee.color,
    });
    const formField = new PSPDFKit.FormFields.SignatureFormField({
      annotationIds: PSPDFKit.Immutable.List([widget.id]),
      name: instantId,
      id: instantId,
      readOnly: signee.id != user.id,
    });
    await inst.create([widget, formField]);
  }
  else if(annotationType === AnnotationTypeEnum.DS){
    const widget = new PSPDFKit.Annotations.WidgetAnnotation({
      boundingBox: pageRect,
      formFieldName: "DigitalSignature",
      id: instantId,
      pageIndex,
      name: instantId,
      customData: {
        createdBy: user.id,
        signerID: user.id,
        signerEmail: email,
        type: annotationType,
        signerColor: PSPDFKit.Color.WHITE,
        isInitial: false,
      },
      //backgroundColor: signee.color,
    });
    const formField = new PSPDFKit.FormFields.SignatureFormField({
      annotationIds: PSPDFKit.Immutable.List([widget.id]),
      name: 'DigitalSignature',
      id: instantId,
      readOnly: signee.id != user.id,
    });
    const created = await inst.create([widget, formField]);
    console.log("Digital Signature created", created);
  } 
  else if (annotationType === AnnotationTypeEnum.RadioButton){
    const radioWidget1 = new PSPDFKit.Annotations.WidgetAnnotation({
      id: instantId,
      pageIndex: pageIndex,
      formFieldName: instantId,
      boundingBox: pageRect,
      customData: {
        createdBy: user.id,
        signerID: signee.id,
        signerEmail: email,
        type: annotationType,
        signerColor: signee.color,
      },
    });
    // const radioWidget2 = new PSPDFKit.Annotations.WidgetAnnotation({
    //   id: PSPDFKit.generateInstantId(),
    //   pageIndex: pageIndex,
    //   formFieldName: "MyFormField",
    //   boundingBox: new PSPDFKit.Geometry.Rect({
    //     left: pageRect.left + 30,
    //     top: pageRect.top,
    //     width: pageRect.width,
    //     height: pageRect.height,
    //   }),
    //   customData: {
    //     createdBy: user.id,
    //     signerID: signee.id,
    //     signerEmail: email,
    //     type: annotationType,
    //     signerColor: signee.color,
    //   },
    // });
    const formField = new PSPDFKit.FormFields.RadioButtonFormField({
      name: instantId,
      annotationIds: new PSPDFKit.Immutable.List([
        radioWidget1.id,
        // radioWidget2.id
      ]),
      options: new PSPDFKit.Immutable.List([
        new PSPDFKit.FormOption({
          label: "Option 1",
          value: "1"
        }),
        // new PSPDFKit.FormOption({
        //   label: "Option 2",
        //   value: "2"
        // })
      ]),
      defaultValue: "1"
    });
    await inst.create([radioWidget1,
       //radioWidget2,
        formField]);
  }
  else if (annotationType === AnnotationTypeEnum.CheckBox){
    const checkBoxWidget = new PSPDFKit.Annotations.WidgetAnnotation({
      id: instantId,
      pageIndex: pageIndex,
      formFieldName: instantId,
      boundingBox: pageRect,
      customData: {
        createdBy: user.id,
        signerID: signee.id,
        signerEmail: email,
        type: annotationType,
        signerColor: signee.color,
      },
    });
    const formField = new PSPDFKit.FormFields.CheckBoxFormField({
      id: instantId,
      name: instantId,
      annotationIds: new PSPDFKit.Immutable.List([checkBoxWidget.id]),
      defaultValue: false,
      options: new PSPDFKit.Immutable.List([
        new PSPDFKit.FormOption({
          label: "Option 1",
          value: "1"
        }),
      ])
    });
    await inst.create([checkBoxWidget, formField]);
  }
  else if (annotationType === AnnotationTypeEnum.TextField){
    const textBoxWidget = new PSPDFKit.Annotations.WidgetAnnotation({
      id: instantId,
      pageIndex: pageIndex,
      name: instantId,
      formFieldName: instantId,
      boundingBox: pageRect,
      customData: {
        createdBy: user.id,
        signerID: signee.id,
        signerEmail: email,
        type: annotationType,
        signerColor: signee.color,
      },
      backgroundColor: signee.color,
    });
    const textField = new PSPDFKit.FormFields.TextFormField({
      annotationIds: new PSPDFKit.Immutable.List([textBoxWidget.id]),
      id: instantId,
      name: instantId,
      label: "Text Field",
      maxLength: 100,
      multiLine: false,
    });
    console.log(signee.id);
    
    await inst.create([textBoxWidget, textField]);
  }
  else {
    const text = new PSPDFKit.Annotations.TextAnnotation({
      pageIndex,
      boundingBox: pageRect,
      text: {
        format: "plain",
        value: annotationType === "name" ? name : new Date().toDateString(),
      },
      name: name,
      customData: {
        signerEmail: email,
        type: annotationType,
        signerColor: signee.color,
      },
      font: "Helvetica",
      fontSize: rectHeight * 0.6,
      horizontalAlign: "left",
      verticalAlign: "top",
      isEditable: false,
      //backgroundColor: signee.color,
    });
    await inst.create(text);
  }
  // set the viewer to form creator mode so that the user can place the field
  // inst.setViewState((viewState) =>
  //   viewState.set("interactionMode", PSPDFKit.InteractionMode.FORM_CREATOR)
  // );

  // @ts-ignore
  // inst.setOnAnnotationResizeStart((eve) => {
  //   if (eve.annotation instanceof PSPDFKit.Annotations.WidgetAnnotation) {
  //     return {
  //       //maintainAspectRatio: true,
  //       //responsive: false,
  //       maxWidth: 250,
  //       maxHeight: 100,
  //       minWidth: 70,
  //       minHeight: 30,
  //     };
  //   } else if (
  //     eve.annotation instanceof PSPDFKit.Annotations.TextAnnotation
  //   ) {
  //     return {
  //       //maintainAspectRatio: true,
  //       //responsive: false,
  //       maxWidth: 250,
  //       maxHeight: 100,
  //       minWidth: 70,
  //       minHeight: 30,
  //     };
  //   }
  // });
};

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
// *

// *
export const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

function createCustomSignatureNode({ annotation, type }: any) {
  const container = document.createElement("div");

  if (type === AnnotationTypeEnum.SIGNATURE) {
    container.innerHTML = `<div class="custom-annotation-wrapper custom-signature-wrapper" style="background-color: rgb(${annotation.customData?.signerColor.r},${annotation.customData?.signerColor.g},${annotation.customData?.signerColor.b})">
        <div class="custom-signature">
          <div class="custom-signature-label">
             Sign
          </div>
          <svg fill="#000000" width="1.5625rem" height="1.25rem" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>down-round</title>
            <path d="M0 16q0-3.232 1.28-6.208t3.392-5.12 5.12-3.392 6.208-1.28q3.264 0 6.24 1.28t5.088 3.392 3.392 5.12 1.28 6.208q0 3.264-1.28 6.208t-3.392 5.12-5.12 3.424-6.208 1.248-6.208-1.248-5.12-3.424-3.392-5.12-1.28-6.208zM4 16q0 3.264 1.6 6.048t4.384 4.352 6.016 1.6 6.016-1.6 4.384-4.352 1.6-6.048-1.6-6.016-4.384-4.352-6.016-1.632-6.016 1.632-4.384 4.352-1.6 6.016zM10.048 18.4q-0.128-0.576 0.096-1.152t0.736-0.896 1.12-0.352h2.016v-5.984q0-0.832 0.576-1.408t1.408-0.608 1.408 0.608 0.608 1.408v5.984h1.984q0.608 0 1.12 0.352t0.736 0.896q0.224 0.576 0.096 1.152t-0.544 1.024l-4 4q-0.576 0.576-1.408 0.576t-1.408-0.576l-4-4q-0.448-0.416-0.544-1.024z"></path>
          </svg>
        </div>
      </div>`;
  } else if (type === AnnotationTypeEnum.INITIAL) {
    container.innerHTML = `<div class="custom-annotation-wrapper custom-signature-wrapper" style="height:3rem; background-color: rgb(${annotation.customData?.signerColor.r},${annotation.customData?.signerColor.g},${annotation.customData?.signerColor.b})">
        <div class="custom-signature">
          <div class="custom-signature-label">
             Initial
          </div>
          <svg fill="#000000" width="1.5625rem" height="1.25rem" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>down-round</title>
            <path d="M0 16q0-3.232 1.28-6.208t3.392-5.12 5.12-3.392 6.208-1.28q3.264 0 6.24 1.28t5.088 3.392 3.392 5.12 1.28 6.208q0 3.264-1.28 6.208t-3.392 5.12-5.12 3.424-6.208 1.248-6.208-1.248-5.12-3.424-3.392-5.12-1.28-6.208zM4 16q0 3.264 1.6 6.048t4.384 4.352 6.016 1.6 6.016-1.6 4.384-4.352 1.6-6.048-1.6-6.016-4.384-4.352-6.016-1.632-6.016 1.632-4.384 4.352-1.6 6.016zM10.048 18.4q-0.128-0.576 0.096-1.152t0.736-0.896 1.12-0.352h2.016v-5.984q0-0.832 0.576-1.408t1.408-0.608 1.408 0.608 0.608 1.408v5.984h1.984q0.608 0 1.12 0.352t0.736 0.896q0.224 0.576 0.096 1.152t-0.544 1.024l-4 4q-0.576 0.576-1.408 0.576t-1.408-0.576l-4-4q-0.448-0.416-0.544-1.024z"></path>
          </svg>
        </div>
      </div>`;
  } else if (type === AnnotationTypeEnum.DS) {
    container.innerHTML = `<div class="custom-annotation-wrapper custom-signature-wrapper" style="height: 6rem; background-color: rgb(${annotation.customData?.signerColor.r},${annotation.customData?.signerColor.g},${annotation.customData?.signerColor.b})">
        <div class="custom-signature">
          <div class="custom-signature-label">
             Digital Signature
          </div>
          <svg fill="#000000" width="1.5625rem" height="1.25rem" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>down-round</title>
            <path d="M0 16q0-3.232 1.28-6.208t3.392-5.12 5.12-3.392 6.208-1.28q3.264 0 6.24 1.28t5.088 3.392 3.392 5.12 1.28 6.208q0 3.264-1.28 6.208t-3.392 5.12-5.12 3.424-6.208 1.248-6.208-1.248-5.12-3.424-3.392-5.12-1.28-6.208zM4 16q0 3.264 1.6 6.048t4.384 4.352 6.016 1.6 6.016-1.6 4.384-4.352 1.6-6.048-1.6-6.016-4.384-4.352-6.016-1.632-6.016 1.632-4.384 4.352-1.6 6.016zM10.048 18.4q-0.128-0.576 0.096-1.152t0.736-0.896 1.12-0.352h2.016v-5.984q0-0.832 0.576-1.408t1.408-0.608 1.408 0.608 0.608 1.408v5.984h1.984q0.608 0 1.12 0.352t0.736 0.896q0.224 0.576 0.096 1.152t-0.544 1.024l-4 4q-0.576 0.576-1.408 0.576t-1.408-0.576l-4-4q-0.448-0.416-0.544-1.024z"></path>
          </svg>
        </div>
      </div>`;
  }

  return container;
}

export const applyDSign = async (instance:any, containerRef:any, setIsLoading:any, setPdfUrl:any) => {
  setIsLoading(true);
  try {
    console.log("Start signing");
    const doc = await instance.exportPDF();
    console.log("PDF exported and sending for signing ", doc instanceof ArrayBuffer);
    const pdfBlob = new Blob([doc], { type: "application/pdf" });
    const imageBlob = await imageToBlob(`${window.location.protocol}//${window.location.host}/signed/watermark.jpg`);
    const formData = new FormData();
    formData.append('file', pdfBlob);
    formData.append('image', imageBlob);
    //formData.append('graphicImage', imageBlob)
    //res = await applyDigitalSignature(formData);
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
    console.log("Response from signing", res);
  } catch (error) {
    console.error('Error caught in catch block:', error);
  } finally{
    setIsLoading(false);
  }
}

export function createDynamicSelect(
  instance:any,
  annotation:any,
  options:any,
  selectedID = "none"
) {
  console.log(`instance : ${instance}`);
  console.log(`annotation : ${annotation}`);
  console.log(`options : ${options}`);
  console.log(`selectedID : ${selectedID}`);
  
  
  // Create main container div
  const mainDiv = document.createElement("div");
  mainDiv.className = "PSPDFKit-71h65asx9k85mdns4n8j2kt3ag";

  // Create inner divs
  const innerDiv1 = document.createElement("div");
  const innerDiv2 = document.createElement("div");
  innerDiv2.className = "PSPDFKit-4q6rf47rhqhrpm9gdfefxt7qxa";

  // Create label
  const label = document.createElement("label");
  label.className = "PSPDFKit-nt12adttbyb52awsgj2pvucxy";
  label.textContent = "Assign To User: ";

  // Create select element
  const select = document.createElement("select");
  select.id = "userRoles";
  select.className =
    "PSPDFKit-38cjpvxsadupm25h2qyxa7n5gd PSPDFKit-3yju2u277834cy3gahr2r5pxwa PSPDFKit-Form-Creator-Editor-Form-Field-Name";

  // Add event listener to update the annotation when the select value changes
  select.addEventListener("change", async (event:any) => {
    const newSelectedID = event.target.value;
    // Update the annotation with the new signer
    
    const customData = annotation.customData
    customData.signerID = newSelectedID;
    const selectedObj = options.find((option:any) => option.id == newSelectedID)
    const updatedAnnotation = annotation.set("customData", customData)
          .set("backgroundColor", selectedObj.color);

    instance.update(updatedAnnotation).then((updated:any) => {
      console.log("Updated annotation", updated);
    });
  });

  // Create options dynamically
  options.forEach((thisOption:any) => {
    const option = document.createElement("option");
    option.value = thisOption.id;
    option.textContent = thisOption.name;
    option.selected = selectedID == thisOption.id
    select.appendChild(option);
  });

  // Assemble the elements
  label.appendChild(select);
  innerDiv2.appendChild(label);
  innerDiv1.appendChild(innerDiv2);
  mainDiv.appendChild(innerDiv1);

  // Return the main container
  return mainDiv;
}