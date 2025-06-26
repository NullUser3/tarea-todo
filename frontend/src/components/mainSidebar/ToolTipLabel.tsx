import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { useDarkModeContext } from "../../context/DarkModeContext";

// Define props for the styled component (includes darkMode)
interface StyledTooltipProps extends TooltipProps {
  darkMode?: boolean;
}

const StyledTooltip = styled(
  ({ className, darkMode, ...props }: StyledTooltipProps) => (
    <Tooltip
      enterTouchDelay={600}
      leaveTouchDelay={300}
      enterNextDelay={600}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -5],
              },
            },
          ],
        },
      }}
      {...props}
      classes={{ popper: className }}
    />
  )
)(({ theme, darkMode }) => ({
  [`& .${tooltipClasses.tooltip}`]: darkMode
    ? {
        backgroundColor: theme.palette.common.white,
        color: "rgba(0, 0, 0, 0.87)",
        boxShadow: theme.shadows[1],
        fontSize: 11,
      }
    : {},
  [`& .${tooltipClasses.arrow}`]: darkMode
    ? {
        color: theme.palette.common.white,
      }
    : {},
}));

// Wrapper component that consumes the context
export const LightTooltip = (props: TooltipProps) => {
  const { darkMode } = useDarkModeContext(); // Get darkMode from context
  return <StyledTooltip darkMode={darkMode} {...props} />;
};
