type BoxProps = {
  dimension: Dimension;
  color: string;
  hoverColor?: string;
} & JSX.IntrinsicElements["mesh"];

type Dimension = {
  width?: number;
  height?: number;
  depth?: number;
};

export default BoxProps;
