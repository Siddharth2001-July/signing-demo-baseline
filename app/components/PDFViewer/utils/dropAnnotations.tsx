import { AnnotationTypeEnum } from "@/utils/types";

const handleDrop = async (
  e: any,
  inst: any,
  PSPDFKit: any,
  currSigneeRef: any,
  currUserRef: any,
  onPageIndexRef: any
) => {
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
  } else if (annotationType === AnnotationTypeEnum.DS) {
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
      name: "DigitalSignature",
      id: instantId,
      readOnly: signee.id != user.id,
    });
    const created = await inst.create([widget, formField]);
    console.log("Digital Signature created", created);
  } else if (annotationType === AnnotationTypeEnum.RadioButton) {
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
          value: "1",
        }),
        // new PSPDFKit.FormOption({
        //   label: "Option 2",
        //   value: "2"
        // })
      ]),
      defaultValue: "1",
    });
    await inst.create([
      radioWidget1,
      //radioWidget2,
      formField,
    ]);
  } else if (annotationType === AnnotationTypeEnum.CheckBox) {
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
          value: "1",
        }),
      ]),
    });
    await inst.create([checkBoxWidget, formField]);
  } else if (annotationType === AnnotationTypeEnum.TextField) {
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
  } else {
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

export default handleDrop;