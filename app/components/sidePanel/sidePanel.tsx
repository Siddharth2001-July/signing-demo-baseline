import React from "react";
import {DraggableAnnotation} from "./draggableAnnotations"; // Adjust the import path as needed
import { AnnotationTypeEnum, User } from "@/utils/types"; // Adjust the import path as needed
import dynamic from "next/dynamic";

const Select = dynamic(
  () => import("@baseline-ui/core").then((mod) => mod.Select),
  { ssr: false }
);
const ActionButton = dynamic(
  () => import("@baseline-ui/core").then((mod) => mod.ActionButton),
  { ssr: false }
);

const SidePanel = ({
  users,
  currUser,
  currSignee,
  userChange,
  PSPDFKit,
  isVisible,
  selectedSignee,
  signeeChanged,
  deleteUser,
  addSignee,
  onDragStart,
  onDragEnd,
  applyDSign,
  instance,
  containerRef,
  setIsLoading,
  setPdfUrl,
}:any) => {
  return (
    <div
      style={{
        width: "256px",
        background: "#ffffff",
        borderRight: "1px solid #F0F3F9",
        overflowY: "auto",
        height: "90vh",
        borderTop: "1px solid #D7DCE4",
      }}
    >
      <div style={{ padding: "16px", borderBottom: "1px solid #D7DCE4" }}>
        <h3
          style={{
            fontFamily: "Inter",
            fontSize: "12px",
            fontWeight: "600",
            lineHeight: "20px",
            textTransform: "uppercase",
          }}
        >
          user
        </h3>
        <div
          style={{
            fontFamily: "Inter",
            fontSize: "10px",
            fontWeight: "400",
            lineHeight: "14px",
            marginBottom: "10px",
          }}
        >
          Choose &apos;Admin&apos; to edit and prepare the document for signing,
          or select a user to sign the document as that user.
        </div>
        <Select
          items={users.map((user:any) => {
            return {
              id: user.id.toString(),
              label:
                user?.name.length > 15
                  ? user?.name.slice(0, 15) + "..."
                  : user?.name,
              icon: () =>
                user.role == "Editor" ? null : (
                  <RedCircleIcon color={user.color.toString()} />
                ),
            } as any;
          })}
          className="input-custom-style"
          selectedKey={currUser.id.toString()}
          onSelectionChange={
            ((selected: any) => {
              userChange(
                users.find((user:any) => user.id == selected) as User,
                PSPDFKit
              );
            }) as any
          }
        />
      </div>
      {isVisible && (
        <>
          <div style={{ padding: "16px", borderBottom: "1px solid #D7DCE4" }}>
            <h3
              style={{
                fontFamily: "Inter",
                fontSize: "12px",
                fontWeight: "600",
                lineHeight: "20px",
                textTransform: "uppercase",
              }}
            >
              Signers
            </h3>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: "10px",
                fontWeight: "400",
                lineHeight: "14px",
                marginBottom: "10px",
              }}
            >
              Select the signer to assign fields to.
            </div>
            <div>
              <div>
                {users?.map((user:any) => {
                  if (user.role !== "Editor") {
                    const isLastClicked = selectedSignee.id === user.id;
                    return (
                      <div
                        className={`heading-custom-style_hover ${
                          isLastClicked ? "highlight-signee" : ""
                        }`}
                        key={user?.id}
                        onClick={(e) => {
                          signeeChanged(user);
                        }}
                      >
                        <RedCircleIcon color={user.color?.toString()} />
                        {user?.name.length > 10
                          ? user?.name.slice(0, 10) + "..."
                          : user?.name}
                        <span
                          className="cross"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteUser(user);
                          }}
                        >
                          <svg
                            width="10"
                            height="9"
                            viewBox="0 0 10 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.99991 5.43337L1.73324 8.70003C1.61102 8.82225 1.45547 8.88337 1.26658 8.88337C1.07769 8.88337 0.922133 8.82225 0.79991 8.70003C0.677688 8.57781 0.616577 8.42225 0.616577 8.23337C0.616577 8.04448 0.677688 7.88892 0.79991 7.7667L4.06658 4.50003L0.79991 1.23337C0.677688 1.11114 0.616577 0.955588 0.616577 0.766699C0.616577 0.57781 0.677688 0.422255 0.79991 0.300033C0.922133 0.17781 1.07769 0.116699 1.26658 0.116699C1.45547 0.116699 1.61102 0.17781 1.73324 0.300033L4.99991 3.5667L8.26658 0.300033C8.3888 0.17781 8.54435 0.116699 8.73324 0.116699C8.92213 0.116699 9.07769 0.17781 9.19991 0.300033C9.32213 0.422255 9.38324 0.57781 9.38324 0.766699C9.38324 0.955588 9.32213 1.11114 9.19991 1.23337L5.93324 4.50003L9.19991 7.7667C9.32213 7.88892 9.38324 8.04448 9.38324 8.23337C9.38324 8.42225 9.32213 8.57781 9.19991 8.70003C9.07769 8.82225 8.92213 8.88337 8.73324 8.88337C8.54435 8.88337 8.3888 8.82225 8.26658 8.70003L4.99991 5.43337Z"
                              fill="#EF4444"
                            />
                          </svg>
                        </span>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <ActionButton
              label={"+ Add New"}
              size="md"
              onPress={addSignee}
              className="custom-button"
              style={{ margin: "15px 0px 0px 0px" }}
            />
          </div>
          <div style={{ padding: "25px 15px" }}>
            <h3
              style={{
                fontFamily: "Inter",
                fontSize: "12px",
                fontWeight: "600",
                lineHeight: "20px",
                textTransform: "uppercase",
              }}
            >
              Add fields
            </h3>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: "10px",
                fontWeight: "400",
                lineHeight: "14px",
                marginBottom: "10px",
              }}
            >
              Drag & drop fields on the document
            </div>
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
            <DraggableAnnotation
              className="mt-5"
              type={AnnotationTypeEnum.RadioButton}
              label="Radio Button"
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              userColor={{ r: 255, g: 255, b: 255 }}
            />
            <DraggableAnnotation
              className="mt-5"
              type={AnnotationTypeEnum.CheckBox}
              label="Check Box"
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              userColor={{ r: 255, g: 255, b: 255 }}
            />
            <DraggableAnnotation
              className="mt-5"
              type={AnnotationTypeEnum.TextField}
              label="Text Field"
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              userColor={{ r: 255, g: 255, b: 255 }}
            />
            <DraggableAnnotation
              className="mt-5"
              type={AnnotationTypeEnum.DS}
              label="Digital Signature"
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              userColor={{ r: 255, g: 255, b: 255 }}
            />
            <ActionButton
              label={"Apply Digital Signature"}
              size="md"
              onPress={async function da() {
                await applyDSign(
                  instance,
                  containerRef,
                  setIsLoading,
                  setPdfUrl
                );
              }}
              className="custom-button"
              style={{ margin: "15px 0px 0px 0px" }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SidePanel;

const RedCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ color }) => {
  const jsonString = color
    ? color.substring(2).replace(/(\w+):/g, '"$1":')
    : "";
  try {
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
  } catch (error) {}
};
