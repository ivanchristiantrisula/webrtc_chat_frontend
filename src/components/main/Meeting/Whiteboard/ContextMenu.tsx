import {
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { Check, CheckRounded } from "@material-ui/icons";
import { useRef } from "react";

const WhiteboardContextMenu = (props: {
  open: boolean;
  handleClose: Function;
  pos: { mouseX: number; mouseY: number };
  handleColorChange: Function;
  handleLineWidthChange: Function;
  handleLineCapChange: Function;
  currentValue: {
    cap: "round" | "square";
    color: string;
    width: number;
  };
}) => {
  const lineCaps = useRef(["round", "square"]);
  const lineWidthSizes = useRef([6, 8, 10, 12, 14]);
  const lineColors = useRef([
    { hex: "#000000", name: "Black" },
    { hex: "#FF0000", name: "Red" },
    { hex: "#00FF00", name: "Green" },
    { hex: "#0000FF", name: "Blue" },
  ]);

  return (
    <>
      <Menu
        keepMounted
        open={props.open}
        onClose={() => props.handleClose()}
        anchorReference="anchorPosition"
        anchorPosition={
          props.pos.mouseY !== null && props.pos.mouseX !== null
            ? { top: props.pos.mouseY, left: props.pos.mouseX }
            : undefined
        }
      >
        <MenuItem disabled>
          <strong>Line Cap</strong>
        </MenuItem>
        {lineCaps.current.map((shape) => {
          return (
            <MenuItem
              onClick={() => props.handleLineCapChange(shape)}
              style={{ textTransform: "capitalize" }}
            >
              <ListItemIcon>
                {props.currentValue.cap === shape ? <Check /> : null}
              </ListItemIcon>
              <Typography variant="inherit">{shape}</Typography>
            </MenuItem>
          );
        })}
        <Divider />
        <MenuItem disabled>
          <strong>Line Width</strong>
        </MenuItem>
        {lineWidthSizes.current.map((width) => {
          return (
            <MenuItem onClick={() => props.handleLineWidthChange(width)}>
              <ListItemIcon>
                {props.currentValue.width === width ? <Check /> : null}
              </ListItemIcon>
              <Typography variant="inherit">{width}</Typography>
            </MenuItem>
          );
        })}
        <Divider />
        <MenuItem disabled>
          <strong>Line Color</strong>
        </MenuItem>
        {lineColors.current.map((color) => {
          return (
            <MenuItem onClick={() => props.handleColorChange(color.hex)}>
              <ListItemIcon>
                {props.currentValue.color === color.hex ? <Check /> : null}
              </ListItemIcon>
              <Typography variant="inherit">{color.name}</Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default WhiteboardContextMenu;
