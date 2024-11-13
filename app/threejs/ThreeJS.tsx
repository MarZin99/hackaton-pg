import { ThreeJSProps } from "./ThreeJS.types";

const ThreeJS: React.FC<ThreeJSProps> = (props) => {
  const { name } = props;
  return <div>ThrereJS {name}</div>;
};

export default ThreeJS;
