import { useState } from "react";

export const useDisabledButton = () => {
  const [disabled, setDisabled] = useState(false);
  return [disabled, setDisabled];
};
