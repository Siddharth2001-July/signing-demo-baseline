import { createDragImage } from "./draggableAnnotations/draggableAnnotations";

export function onDragStart(event: React.DragEvent<HTMLDivElement>, type: string, currSignee:any, instance:any) {
    const instantId = "PSPDFKit.generateInstantId()";
    let data =
      currSignee.name + // value from select, name of signer
      "%" + // % is an invalid email character so we can use it as a delimiter
      currSignee.email + // value from select, email of signer
      "%" +
      instantId +
      "%" +
      type;


    // Create custom drag image
    const dragImage = createDragImage(type, currSignee.color);
    instance.contentDocument.appendChild(dragImage);

    // Set the custom drag image
    event.dataTransfer.setDragImage(dragImage, dragImage.offsetWidth / 2, dragImage.offsetHeight / 2);

    // Remove the drag image element after the drag ends
    event.currentTarget.addEventListener('dragend', () => {
      if(instance.contentDocument.contains(dragImage))
        instance.contentDocument.removeChild(dragImage);
    });

    (event.target as HTMLDivElement).style.opacity = "0.8";
    
    event.dataTransfer.setData("text/plain", data);
    event.dataTransfer.dropEffect = "move";
}