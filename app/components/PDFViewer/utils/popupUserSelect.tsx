function createDynamicSelect(
  instance: any,
  annotation: any,
  options: any,
  selectedID = "none"
) {

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
  select.addEventListener("change", async (event: any) => {
    const newSelectedID = event.target.value;
    // Update the annotation with the new signer

    const customData = annotation.customData;
    customData.signerID = newSelectedID;
    const selectedObj = options.find(
      (option: any) => option.id == newSelectedID
    );
    const updatedAnnotation = annotation
      .set("customData", customData)
      .set("backgroundColor", selectedObj.color);

    instance.update(updatedAnnotation).then((updated: any) => {
      console.log("Updated annotation", updated);
    });
  });

  // Create options dynamically
  options.forEach((thisOption: any) => {
    const option = document.createElement("option");
    option.value = thisOption.id;
    option.textContent = thisOption.name;
    option.selected = selectedID == thisOption.id;
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
export default createDynamicSelect;
