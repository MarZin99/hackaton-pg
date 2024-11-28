import style from "./SideBar.module.scss";
import { SideBarProps } from "./SideBar.types";

const SideBar: React.FC<SideBarProps> = (props) => {
  const { name, children } = props;
  return (
    <div className={style.wrapper}>
      {name}
      {children}
    </div>
  );
};

export default SideBar;
