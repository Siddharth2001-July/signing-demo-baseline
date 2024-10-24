import { AnnotationTypeEnum } from "@/utils/types";

// Function to handle user change
export const userChange = async (user: any, PSPDFKit: any, instance:any, setIsVisible:any, onChangeReadyToSign:any, setCurrUser:any) => {
    setCurrUser(user);
    if (instance) {
      const formFields = await instance.getFormFields();
      const signatureFormFields = formFields.filter(
        (field: any) => field instanceof PSPDFKit.FormFields.SignatureFormField
      );
      const signatureAnnotations = async () => {
        let annotations: any[] = [];
        for (let i = 0; i < instance.totalPageCount; i++) {
          let ann = await instance.getAnnotations(i);
          ann.forEach((annotation: any) => {
            if (
              annotation.customData &&
              annotation.customData.signerID == user.id
            ) {
              annotations.push(annotation.id);
            }
          });
        }
        return annotations;
      };
      const userFieldIds = await signatureAnnotations();
      const readOnlyFormFields = signatureFormFields
        .map((it: any) => {
          if (userFieldIds.includes(it.id)) {
            return it.set("readOnly", false);
          } else {
            return it.set("readOnly", true);
          }
        })
        .filter(Boolean); // Filter out undefined values
      await instance.update(readOnlyFormFields);
      // User with role Editor can edit the document
      if (user.role == "Editor") {
        instance.setViewState((viewState: any) =>
          viewState.set("showToolbar", true)
        );
        setIsVisible(true);
        onChangeReadyToSign(false, user, PSPDFKit);
      } else {
        instance.setViewState((viewState: any) =>
          viewState.set("showToolbar", false)
        );
        setIsVisible(false);
        onChangeReadyToSign(true, user, PSPDFKit);
      }
    }
};

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