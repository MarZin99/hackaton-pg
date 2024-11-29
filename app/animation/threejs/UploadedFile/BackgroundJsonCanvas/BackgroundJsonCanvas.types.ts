type ShaderConfig = {
  compiledVertexShaders: string[];
  compiledFragmentShaders: string[];
  type: string;
  trackMouse?: number;
  speed?: number;
};

// Shader Background Component
type ShaderBackgroundProps = {
  selectedFile: ShaderConfig;
};

type BackgroundProps = {
  selectedFile: ShaderConfig;
};

export type { ShaderConfig, ShaderBackgroundProps, BackgroundProps };
