import { Color } from "pspdfkit";

export enum AnnotationTypeEnum {
  NAME = "name",
  SIGNATURE = "signature",
  DATE = "date",
  INITIAL = "initial"
}

export interface User {
  id: number;
  name: string;
  email: string;
  color: Color;
  role: string;
}

