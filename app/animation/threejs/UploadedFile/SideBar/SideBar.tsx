import style from "./SideBar.module.scss";
import { SideBarProps } from "./SideBar.types";

const SideBar: React.FC<SideBarProps> = (props) => {
  const { children, side } = props;
  return (
    <div
      className={style.wrapper}
      style={{
        right: side == "right" ? "0" : "unset",
        left: side == "left" ? "0" : "unset",
      }}
    >
      {children}
    </div>
  );
};

export default SideBar;
