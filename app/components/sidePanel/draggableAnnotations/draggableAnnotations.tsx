import { AnnotationTypeEnum} from "@/utils/types";
import { signSVG, initialsSVG, personSVG, dateSVG } from "@/utils/icons";
import "./draggableAnnotations.css";

export const DraggableAnnotation = ({
  className,
  type,
  label,
  onDragStart,
  onDragEnd,
  userColor,
}: {
  className: string;
  type: string;
  label: string;
  onDragStart: any;
  onDragEnd: any;
  userColor: any;
}) => {
  const id = `${type}-icon`;
  let icon = signSVG;
  switch (type) {
    case AnnotationTypeEnum.NAME:
      icon = personSVG;
      break;
    case AnnotationTypeEnum.SIGNATURE:
      icon = signSVG;
      break;
    case AnnotationTypeEnum.DATE:
      icon = dateSVG;
      break;
    case AnnotationTypeEnum.INITIAL:
      icon = initialsSVG;
      break;
    default:
      icon = personSVG;
      break;
  }

  const iconStyle = {
    backgroundColor: userColor
      ? `rgb(${userColor.r},${userColor.g},${userColor.b})`
      : `white`,
  };

  return (
    <div
      className="draggable-annotation"
      draggable={true}
      onDragStart={async (e) => await onDragStart(e, type)}
      onDragEnd={(e) => onDragEnd(e, type)}
    >
      <div className="heading-custom-style">
        <span className="icon-wrapper" style={iconStyle}>
          {icon}
        </span>
        <span className="label">{label}</span>
      </div>
    </div>
  );
};

export function createDragImage(type: any, color: any): HTMLElement {
  const dragImage = document.createElement('div');
  dragImage.style.width = '100px';
  dragImage.style.padding = '8px 12px';
  dragImage.style.background = `rgb(${color.r},${color.g},${color.b})`;
  dragImage.style.borderRadius = '4px';
  dragImage.style.color = '#ffffff';
  dragImage.style.fontFamily = 'Arial, sans-serif';
  dragImage.style.fontSize = '14px';
  dragImage.style.fontWeight = 'bold';
  dragImage.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  
  switch (type) {
      case AnnotationTypeEnum.SIGNATURE:
          dragImage.textContent = 'Signature';
          break;
      case AnnotationTypeEnum.INITIAL:
          dragImage.textContent = 'Initial';
          break;
      case AnnotationTypeEnum.RadioButton:
          dragImage.textContent = 'Radio';
          dragImage.style.background = '#ffffff';
          dragImage.style.color = '#000000';
          dragImage.style.border = '2px solid ' + color;
          break;
      case AnnotationTypeEnum.CheckBox:
          dragImage.textContent = 'Checkbox';
          dragImage.style.background = '#ffffff';
          dragImage.style.color = '#000000';
          dragImage.style.border = '2px solid ' + color;
          break;
      case AnnotationTypeEnum.TextField:
          dragImage.textContent = 'Text';
          dragImage.style.background = '#ffffff';
          dragImage.style.color = '#000000';
          dragImage.style.border = '2px solid ' + color;
          break;
      default:
          dragImage.textContent = type.charAt(0).toUpperCase() + type.slice(1);
  }
  
  return dragImage;
}