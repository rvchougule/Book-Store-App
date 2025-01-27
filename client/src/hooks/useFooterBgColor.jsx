import { useEffect } from "react";

function useFooterBgColor() {
  useEffect(() => {
    const footerContainer = document.getElementById("footer");
    footerContainer.style.backgroundColor = "#f8f6fb";

    return () => {
      footerContainer.style.backgroundColor = "white";
    };
  }, []);
}

export default useFooterBgColor;
