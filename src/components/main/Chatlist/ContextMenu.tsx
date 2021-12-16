import { Menu, MenuItem } from "@material-ui/core";

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
        <MenuItem
          onClick={() => {
            props.handleClickOpenChat();
          }}
        >
          Open Chat
        </MenuItem>
        <MenuItem onClick={() => props.handleClickDeleteChat()}>
          Delete Chat
        </MenuItem>
      </Menu>
    </>
  );
};

export default ChatContextMenu;
