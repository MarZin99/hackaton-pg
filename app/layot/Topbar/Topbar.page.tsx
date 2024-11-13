import Link from "next/link";
import { TopbarProps } from "./Topbar.types";
import { Pages } from "./Topbar.utils";
import styles from "./Topbar.module.scss";

const Topbar: React.FC<TopbarProps> = (props) => {
  const { name } = props;

  return (
    <div className={styles.wrapper}>
      {Pages.map((page, i) => {
        return (
          <Link key={i} href={page.href} className={styles.block}>
            <p>{page.name}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default Topbar;
