import { MainProps } from "./Main.types";

const Main: React.FC<MainProps> = (props) => {
  const { name } = props;
  return <div>Main{name}</div>;
};

export default Main;
