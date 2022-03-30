import { Divider, Menu, MenuItem } from "@material-ui/core";

const FriendlistContextMenu = (props: {
  open: boolean;
  handleClose: Function;
  pos: { mouseX: number; mouseY: number };
  handleClickStartChat: Function;
  handleClickShowProfile: Function;
  handleClickRemoveFriend: Function;
  handleClickBlockUser: Function;
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
          <strong>Friendlist</strong>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => props.handleClickRemoveFriend()}>
          Remove Friend
        </MenuItem>
        <MenuItem onClick={() => props.handleClickBlockUser()}>
          Block User
        </MenuItem>
      </Menu>
    </>
  );
};

export default FriendlistContextMenu;
