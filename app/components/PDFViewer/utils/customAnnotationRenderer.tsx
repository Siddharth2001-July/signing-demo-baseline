import { AnnotationTypeEnum } from "@/utils/types";

const renderConfigurations: any = {};

const getAnnotationRenderers = ({ annotation }: any) => {
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

export default getAnnotationRenderers;

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
