<<<<<<< Updated upstream
//import { Color } from "pspdfkit";
=======

>>>>>>> Stashed changes

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
  color: any;
  role: string;
}

