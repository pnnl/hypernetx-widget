import React from "react";

const ColorScale = ({ name, colorArray }) => {
  // console.log(colorArray);
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "inline-block",
          textAlign: "start",
          width: "100%",
          // position: "absolute",
        }}
      >
        <div className={"box"}>
          {colorArray.map((c, i) => (
            <div
              key={i}
              style={{
                backgroundColor: c,
                width: "" + 100.0 / colorArray.length + "%",
                height: "20px",
                // margin: "0 auto",
                display: "inline-block",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
        <div className={"stack-top"}>{name}</div>
      </div>
    </div>
  );
};

export default ColorScale;
