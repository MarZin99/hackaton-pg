import { Color } from "three";

type BoxProps = {
  dimension: Dimension;
  color: Color;
  hoverColor?: Color;
} & JSX.IntrinsicElements["mesh"];

type Dimension = {
  width?: number;
  height?: number;
  depth?: number;
};

export default BoxProps;
