const customizeUIForInitials = (ui:any) => {
    ui.getBlockById("title").children = "Create Initial";
    ui.getBlockById("save-signature-checkbox")._props.label = "Save Initial";
  
    const textInput = ui.getBlockById("signature-text-input");
    textInput._props.placeholder = "Initial";
    textInput._props.label = "Initial here";
    textInput._props.clearLabel = "Clear initial";
  
    const freehand = ui.getBlockById("freehand-canvas");
    freehand._props.placeholder = "Initial here";
    freehand._props.clearLabel = "Clear initial";
  
    const fontselect = ui.getBlockById("font-selector");
    if (fontselect._props.items[0].label == "Signature") {
      fontselect._props.items = fontselect._props.items.map((item: any) => {
        return { id: item.id, label: "Initial" };
      });
    }
    return ui;
};

export default customizeUIForInitials;