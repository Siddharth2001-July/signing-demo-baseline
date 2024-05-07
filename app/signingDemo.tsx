"use client";
import PSPDFKit, { Color, Instance, Rect, ToolbarItem } from "pspdfkit";
import { useEffect, useRef, useState } from "react";
import { AnnotationTypeEnum, User } from "../utils/types";
import iconSignature from "@/public/pen.png";
import iconName from "@/public/user.png";
import iconDate from "@/public/icon-date.svg";
import ImageComponent from "next/image";
import iconPlusGray from "@/public/icon-plus-gray.png";
import {
  ActionButton,
  ListOption,
  Select,
  Checkbox,
  Separator,
} from "@baseline-ui/core";

import {
  handleAnnotatitonCreation,
  handleAnnotatitonDelete,
  TOOLBAR_ITEMS,
  getAnnotationRenderers,
  //updateSignHereWidget,
  initialsSVG,
  signSVG,
  personSVG,
  dateSVG,
} from "../utils/helpers";

/**
 * SignDemo component.
 *
 * @param allUsers - An array of User objects representing all the users.
 * @param user - The currently logged-in user.
 * @returns The rendered SignDemo component.
 */
export const SignDemo: React.FC<{ allUsers: User[]; user: User }> = ({
  allUsers,
  user,
}) => {
  //export const SignDemo: any = ({ allUsers, user }: { allUsers: User[], user: User }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [instance, setInstance] = useState<Instance | null>(null);

  // State to store the users. Master is the default user for now who can add fields in the doc.
  const [users, setUsers] = useState<User[]>(allUsers);

  const [isVisible, setIsVisible] = useState(
    user.role == "Editor" ? true : false
  );

  // State to store the current signee i.e the user who is currently selected for which the field will be added
  const [currSignee, setCurrSignee] = useState<User>(user);
  const currSigneeRef = useRef(currSignee);
  currSigneeRef.current = currSignee;

  // State to store the current user i.e the user who is currently selected / Loggedin
  const [currUser, setCurrUser] = useState<User>(user);
  const currUserRef = useRef(currUser);
  currUserRef.current = currUser;
  useEffect(() => {
    setUsers(allUsers);
    setCurrUser(user);
    userChange(user);
  }, [user]);

  // State to store the current page index
  const [onPageIndex, setOnPageIndex] = useState<number>(0);
  const onPageIndexRef = useRef(onPageIndex);
  onPageIndexRef.current = onPageIndex;

  const [readyToSign, setReadyToSign] = useState<boolean>(true);

  // For Custom signature / initial field appearance
  const mySignatureIdsRef = useRef([]);
  const [signatureAnnotationIds, setSignatureAnnotationIds] = useState<
    string[]
  >([]);

  // For Custom Add Signature / Intitial field appearance
  const [sessionSignatures, setSessionSignatures] = useState<any>([]);
  const [sessionInitials, setSessionInitials] = useState<any>([]);

  function onDragStart(event: React.DragEvent<HTMLDivElement>, type: string) {
    const instantId = PSPDFKit.generateInstantId();
    let data =
      currSignee.name + // value from select, name of signer
      "%" + // % is an invalid email character so we can use it as a delimiter
      currSignee.email + // value from select, email of signer
      "%" +
      instantId +
      "%" +
      type;

    (event.target as HTMLDivElement).style.opacity = "0.8";
    const img = document.getElementById(`${type}-icon`);
    if (img) {
      event.dataTransfer.setDragImage(img, 10, 10);
    }
    event.dataTransfer.setData("text/plain", data);
    event.dataTransfer.dropEffect = "move";
  }

  function onDragEnd(event: React.DragEvent<HTMLDivElement>) {
    (event.target as HTMLDivElement).style.opacity = "1";
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: any, inst: Instance) => {
    e.preventDefault();
    e.stopPropagation();
    const dataArray = e.dataTransfer.getData("text").split("%");
    let [name, email, instantId, annotationType] = dataArray;
    const signee = currSigneeRef.current;
    const user = currUserRef.current;
    const pageIndex = onPageIndexRef.current;
    const clientRect = new PSPDFKit.Geometry.Rect({
      left: e.clientX,
      top: e.clientY,
      height:
        annotationType === AnnotationTypeEnum.SIGNATURE ||
        annotationType === AnnotationTypeEnum.INITIAL
          ? 60
          : 40,
      width: annotationType === AnnotationTypeEnum.INITIAL ? 70 : 120,
    });
    const pageRect = inst.transformContentClientToPageSpace(
      clientRect,
      pageIndex
    ) as Rect;
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
        backgroundColor: signee.color,
      });
      const formField = new PSPDFKit.FormFields.SignatureFormField({
        annotationIds: PSPDFKit.Immutable.List([widget.id]),
        name: instantId,
        id: instantId,
        readOnly: signee.id != user.id,
      });
      await inst.create([widget, formField]);
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
        fontSize: 14,
        horizontalAlign: "center",
        verticalAlign: "center",
        isEditable: false,
        backgroundColor: signee.color,
      });
      await inst.create(text);
    }
    // set the viewer to form creator mode so that the user can place the field
    // inst.setViewState((viewState) =>
    //   viewState.set("interactionMode", PSPDFKit.InteractionMode.FORM_CREATOR)
    // );

    // @ts-ignore
    inst.setOnAnnotationResizeStart((eve) => {
      if (eve.annotation instanceof PSPDFKit.Annotations.WidgetAnnotation) {
        return {
          //maintainAspectRatio: true,
          //responsive: false,
          maxWidth: 250,
          maxHeight: 100,
          minWidth: 70,
          minHeight: 30,
        };
      } else if (
        eve.annotation instanceof PSPDFKit.Annotations.TextAnnotation
      ) {
        return {
          //maintainAspectRatio: true,
          //responsive: false,
          maxWidth: 250,
          maxHeight: 100,
          minWidth: 70,
          minHeight: 30,
        };
      }
    });
  };

  const [isTextAnnotationMovable, setIsTextAnnotationMovable] = useState(false);
  const isTextAnnotationMovableRef = useRef(isTextAnnotationMovable);
  isTextAnnotationMovableRef.current = isTextAnnotationMovable;

  const onChangeReadyToSign = async (value: boolean) => {
    if (instance) {
      if (currUser.role == "Editor") {
        setReadyToSign(value);
        if (value) {
          instance.setViewState((viewState) =>
            viewState.set("interactionMode", PSPDFKit.InteractionMode.PAN)
          );
          setIsTextAnnotationMovable(false);
        } else {
          instance.setViewState((viewState) =>
            viewState.set(
              "interactionMode",
              PSPDFKit.InteractionMode.FORM_CREATOR
            )
          );
          setIsTextAnnotationMovable(true);
        }
      } else {
        instance.setViewState((viewState) =>
          viewState.set("interactionMode", PSPDFKit.InteractionMode.PAN)
        );
        setIsTextAnnotationMovable(false);
      }
    }
  };

  const addSignee = () => {
    const name = window.prompt("Enter signee's name:");
    const email = window.prompt("Enter signee's email:");

    let id = Math.floor(Math.random() * 1000000);
    while (id && users.find((user) => user.id === id)) {
      console.log("Non unique" + id);
      id = Math.floor(Math.random() * 1000000);
    }
    console.log("Unique id" + id);

    if (name && email) {
      setUsers((prevState) => [
        ...prevState,
        {
          // You can use your own logic to generate the id
          id: id,
          name: name,
          email: email,
          color: randomColor(),
          role: "signee",
        } as User,
      ]);
    } else {
      alert("Please enter both name and email.");
    }
  };

  // Function to get random color for the signee
  const randomColor = () => {
    const colors: Color[] = [
      PSPDFKit.Color.LIGHT_GREY,
      PSPDFKit.Color.LIGHT_GREEN,
      PSPDFKit.Color.LIGHT_YELLOW,
      PSPDFKit.Color.LIGHT_ORANGE,
      PSPDFKit.Color.LIGHT_RED,
      PSPDFKit.Color.LIGHT_BLUE,
    ];
    const usedColors = users.map((signee) => signee.color);
    const availableColors = colors.filter(
      (color) => !usedColors.includes(color as Color)
    );
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
  };

  // Function to handle user change
  const userChange = async (user: User) => {
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
        instance.setViewState((viewState) =>
          viewState.set("showToolbar", true)
        );
        setIsVisible(true);
        onChangeReadyToSign(false);
      } else {
        instance.setViewState((viewState) =>
          viewState.set("showToolbar", false)
        );
        setIsVisible(false);
        onChangeReadyToSign(true);
      }
    }
  };

  // Tracking whether add Signature/Initial UI
  let isCreateInitial: boolean = false;

  // Load PSPDFKit
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      if (PSPDFKit) {
        PSPDFKit.unload(container);
      }
      const {
        UI: { createBlock, Recipes, Interfaces, Core },
      } = PSPDFKit;
      PSPDFKit.load({
        // @ts-ignore
        ui: {
          [Interfaces.CreateSignature]: ({ props }: any) => {
            return {
              content: createBlock(
                Recipes.CreateSignature,
                props,
                ({ ui }: any) => {
                  if (isCreateInitial) {
                    ui.getBlockById("title").children = "Create Initial";
                    ui.getBlockById("save-signature-checkbox")._props.label =
                      "Save Initial";

                    const textInput = ui.getBlockById("signature-text-input");
                    textInput._props.placeholder = "Initial";
                    textInput._props.label = "Intial here";
                    textInput._props.clearLabel = "Clear initial";

                    const freehand = ui.getBlockById("freehand-canvas");
                    freehand._props.placeholder = "Intial here";
                    freehand._props.clearLabel = "Clear initial";

                    const fontselect = ui.getBlockById("font-selector");
                    if (fontselect._props.items[0].label == "Signature") {
                      fontselect._props.items = fontselect._props.items.map(
                        (item: any) => {
                          return { id: item.id, label: "Initial" };
                        }
                      );
                    }
                  }
                  return ui.createComponent();
                }
              ).createComponent(),
            };
          },
        },
        container,
        document: "/document.pdf",
        baseUrl: `${window.location.protocol}//${window.location.host}/`,
        toolbarItems: TOOLBAR_ITEMS as ToolbarItem[],
        disableTextSelection: true,
        customRenderers: {
          Annotation: ({ annotation }: any) =>
            getAnnotationRenderers({
              annotation,
            }),
        },
        styleSheets: [`/viewer.css`],
      }).then(async function (inst: Instance) {
        setInstance(inst);

        // **** Setting Page Index ****

        inst.addEventListener(
          "viewState.currentPageIndex.change",
          (page: any) => {
            setOnPageIndex(page);
          }
        );

        // **** Handle Drop event ****

        //@ts-ignore
        const cont = inst.contentDocument.host;
        cont.ondrop = async function (e: any) {
          await handleDrop(e, inst);
        };

        // **** Handling Add Signature / Initial UI ****

        // Track which signature form field was clicked on
        // and wether it was an initial field or not.
        inst.addEventListener("annotations.press", (event) => {
          let lastFormFieldClicked = event.annotation;

          let annotationsToLoad;
          if (
            lastFormFieldClicked.customData &&
            lastFormFieldClicked.customData.isInitial === true
          ) {
            annotationsToLoad = sessionInitials;

            isCreateInitial = true;
          } else {
            annotationsToLoad = sessionSignatures;

            isCreateInitial = false;
          }
          inst.setStoredSignatures(PSPDFKit.Immutable.List(annotationsToLoad));

          if (
            !isTextAnnotationMovableRef.current &&
            event.annotation instanceof PSPDFKit.Annotations.TextAnnotation
          ) {
            //@ts-ignore
            event.preventDefault();
          }
        });
        let formDesignMode = !1;

        inst.setToolbarItems((items) => [...items, { type: "form-creator" }]);
        inst.addEventListener("viewState.change", (viewState) => {
          formDesignMode = viewState.formDesignMode === true;
        });

        inst.addEventListener("storedSignatures.create", async (annotation) => {
          // Logic for showing signatures and intials in the UI
          if (isCreateInitial) {
            setSessionInitials([...sessionInitials, annotation]);
          } else {
            setSessionSignatures([...sessionSignatures, annotation]);
          }
        });

        // **** Handling Signature / Initial fields appearance after signature ****

        inst.addEventListener(
          "annotations.load",
          async function (loadedAnnotations: any) {
            for await (const annotation of loadedAnnotations) {
              await handleAnnotatitonCreation(
                inst,
                annotation,
                mySignatureIdsRef,
                setSignatureAnnotationIds,
                currUser.email
              );
            }
          }
        );

        inst.addEventListener(
          "annotations.create",
          async function (createdAnnotations: any) {
            const annotation = createdAnnotations.get(0);
            await handleAnnotatitonCreation(
              inst,
              annotation,
              mySignatureIdsRef,
              setSignatureAnnotationIds,
              currUser.email
            );
          }
        );

        inst.addEventListener(
          "annotations.delete",
          async (deletedAnnotations: any) => {
            const annotation = deletedAnnotations.get(0);
            await handleAnnotatitonDelete(inst, annotation, currUser?.email);
            const updatedAnnotationIds = mySignatureIdsRef.current.filter(
              (id) => id !== annotation.id
            );
            setSignatureAnnotationIds(updatedAnnotationIds);
            mySignatureIdsRef.current = updatedAnnotationIds;
          }
        );

        // const scrollElement =
        //   inst.contentDocument.querySelector(".PSPDFKit-Scroll");

        // if (scrollElement === null) console.log("Scroll element not found");

        // //@ts-ignore
        // scrollElement.addEventListener("scroll", updateSignHereWidget(inst));
        // // Update the "Sign Here" widget when someone signs
        // inst.addEventListener("annotations.change", () => {
        //   updateSignHereWidget(inst);
        // });
        // // Update widget with delay to make it visually pop
        // window.setTimeout(updateSignHereWidget, 1e3);

        // inst.exportInstantJSON().then((data) => {
        //   localStorage.setItem("document", JSON.stringify(data));
        // });
      });
    }
  }, []);

  const signeeChanged = (signee: User) => {
    setCurrSignee(signee);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "top",
        }}
      >
        <div
          style={{
            margin: "10px",
            width: "20%",
            background: "#f8f8f8",
            padding: "10px",
            borderRadius: "25px",
          }}
        >
          <div style={{ margin: "25px 0px" }}>
            <h3 style={{ margin: "10px 0" }}>Current user</h3>
            <Select
              items={users.map((user) => {
                return {
                  id: user.id.toString(),
                  label: user.name,
                  icon: () => <RedCircleIcon color={user.color.toString()} />,
                } as ListOption;
              })}
              aria-label="Choose Stroke Style"
              selectedKey={currUser.id.toString()}
              onSelectionChange={
                ((selected: any) => {
                  userChange(users.find((user) => user.id == selected) as User);
                }) as any
              }
            />
          </div>
          {/* Side panel */}
          {isVisible && (
            <>
              <Separator variant="secondary" />
              <div style={{ margin: "25px 0px" }}>
                <Checkbox
                  label="Ready to sign"
                  isSelected={readyToSign}
                  onChange={(e) => onChangeReadyToSign(e)}
                  style={{ margin: "0px 0px 25px 0px" }}
                />
                <Select
                  label="Select signee"
                  items={users.map((user) => {
                    return {
                      id: user.id.toString(),
                      label: user.name,
                      icon: () => (
                        <RedCircleIcon color={user.color.toString()} />
                      ),
                    } as ListOption;
                  })}
                  selectedKey={currSignee.id.toString()}
                  onSelectionChange={
                    ((selected: any) => {
                      signeeChanged(
                        users.find((user) => user.id == selected) as User
                      );
                    }) as any
                  }
                />
                <ActionButton
                  label={"Add Signee"}
                  size="md"
                  onPress={addSignee}
                  style={{ margin: "25px 0px 0px 0px" }}
                />
              </div>
              <Separator variant="secondary" />
              <div style={{ margin: "25px 0px" }}>
                <h5>Standard Fields</h5>
                {/* Uncomment this to add draggable name field */}
                <DraggableAnnotation
                  className="mt-5"
                  type={AnnotationTypeEnum.NAME}
                  label="Name"
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  userColor={currSignee.color}
                />
                <DraggableAnnotation
                  className="mt-5"
                  type={AnnotationTypeEnum.SIGNATURE}
                  label="Signature"
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  userColor={currSignee.color}
                />
                <DraggableAnnotation
                  className="mt-5"
                  type={AnnotationTypeEnum.INITIAL}
                  label="Initial"
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  userColor={currSignee.color}
                />
                {/* Uncomment this to add draggable date field */}
                <DraggableAnnotation
                  className="mt-5"
                  type={AnnotationTypeEnum.DATE}
                  label="Date"
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  userColor={currSignee.color}
                />
              </div>
            </>
          )}
        </div>
        {/* PSPDFKit div */}
        <div
          onDragOver={handleDragOver}
          ref={containerRef}
          style={{ height: "90vh", width: "80%" }}
        />
      </div>
    </div>
  );
};

export default SignDemo;

// Red circle SVG icon as a React component
const RedCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ color }) => {
  const jsonString = color
    ? color.substring(2).replace(/(\w+):/g, '"$1":')
    : "";
  // Parse the JSON string into an object
  const colorObject = JSON.parse(jsonString);
  //console.log("Color: ", colorObject);
  return (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="10"
        cy="10"
        r="10"
        fill={`rgb(${colorObject.r},${colorObject.g},${colorObject.b})`}
      />
    </svg>
  );
};

const DraggableAnnotation = ({
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
      icon = signSVG;
      break;
  }

  return (
    <div
      draggable={true}
      onDragStart={(e) => onDragStart(e, type)}
      onDragEnd={(e) => onDragEnd(e, type)}
      style={{
        // display: "flex",
        margin: "15px 0px",
        padding: "0rem 0px",
        cursor: "move",
      }}
    >
      <div style={{ marginLeft: "0.5rem" }}>
        <span
          style={{
            border: "1.5px solid rgb(184, 134, 11)",
            borderRadius: "3px",
            maxHeight: "22px",
            marginInlineEnd: "8px",
            padding: "3px",
            backgroundColor: `rgb(${userColor.r},${userColor.g},${userColor.b})`,
          }}
        >
          {icon}
        </span>

        <span style={{ margin: "0px 0.5rem" }}>{label}</span>
      </div>
    </div>
  );
};
