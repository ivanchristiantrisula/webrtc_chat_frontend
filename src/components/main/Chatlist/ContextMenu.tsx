import { Divider, Menu, MenuItem } from "@material-ui/core";

const ChatContextMenu = (props: {
  open: boolean;
  handleClose: Function;
  pos: { mouseX: number; mouseY: number };
  handleClickOpenChat: Function;
  handleClickDeleteChat: Function;
}) => {
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
          <strong>Chat</strong>
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.handleClickOpenChat();
          }}
        >
          Open
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => props.handleClickDeleteChat()}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default ChatContextMenu;
