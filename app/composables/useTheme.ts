import { applyTheme, loadTheme, saveTheme, Theme } from "~/utils/theme";

export function useTheme() {
  const theme = useState<Theme>("theme", () => Theme.Light);

  function setTheme(next: Theme) {
    theme.value = next;
    saveTheme(next);
    applyTheme(next);
  }

  function init() {
    const next = loadTheme() ?? Theme.Light;
    theme.value = next;
    applyTheme(next);
  }

  return { theme, setTheme, init };
}
