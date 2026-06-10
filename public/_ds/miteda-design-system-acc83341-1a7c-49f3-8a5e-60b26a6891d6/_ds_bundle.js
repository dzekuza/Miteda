/* @ds-bundle: {"format":3,"namespace":"MitedaDesignSystem_acc833","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"SegmentedControl","sourcePath":"components/buttons/SegmentedControl.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"KeyRow","sourcePath":"components/display/KeyRow.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"SidebarItem","sourcePath":"components/navigation/SidebarItem.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"8e1263b79993","components/buttons/IconButton.jsx":"dbbf4154fec2","components/buttons/SegmentedControl.jsx":"37af8926292a","components/display/Avatar.jsx":"098a970716ba","components/display/Card.jsx":"3b9bb56a2ab5","components/display/KeyRow.jsx":"58c76bab8000","components/feedback/Badge.jsx":"783a9afbefb7","components/forms/Checkbox.jsx":"6772fb26760b","components/forms/Input.jsx":"ea61c7c6d4d3","components/forms/Switch.jsx":"11dd25bc3100","components/navigation/SidebarItem.jsx":"af6918a685a5","ui_kits/dashboard/DigitalKeys.jsx":"2fd9d197e0e7","ui_kits/dashboard/DiscussionsMessages.jsx":"6c4c9ce15cf9","ui_kits/dashboard/EventsCalendar.jsx":"c488483e06aa","ui_kits/dashboard/Header.jsx":"fd786cc602cb","ui_kits/dashboard/NoticeBoard.jsx":"4863a8c87621","ui_kits/dashboard/Sidebar.jsx":"2aee9f37781d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MitedaDesignSystem_acc833 = window.MitedaDesignSystem_acc833 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Miteda Button — pill-shaped action.
 * Variants: primary (deep evergreen), accent (signal green),
 * secondary (hairline outline on white), ghost (no chrome).
 * Sizes: sm 32 / md 40 / lg 48. Optional leading/trailing icons
 * (pass a Phosphor class string or a node).
 */
function Button({
  children,
  variant = "secondary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = "button",
  onClick,
  style,
  className,
  ...rest
}) {
  const sizes = {
    sm: {
      height: 32,
      padding: "0 14px",
      font: "var(--text-body)",
      icon: 16,
      gap: 6
    },
    md: {
      height: 40,
      padding: "0 18px",
      font: "var(--text-body)",
      icon: 18,
      gap: 8
    },
    lg: {
      height: 48,
      padding: "0 24px",
      font: "var(--text-title)",
      icon: 20,
      gap: 8
    }
  }[size];
  const variants = {
    primary: {
      background: "var(--brand-forest)",
      color: "var(--text-on-forest)",
      boxShadow: "none"
    },
    accent: {
      background: "var(--brand-green)",
      color: "var(--text-on-brand)",
      boxShadow: "none"
    },
    secondary: {
      background: "var(--surface-card)",
      color: "var(--ink-700)",
      boxShadow: "inset 0 0 0 1px var(--line-100)"
    },
    ghost: {
      background: "transparent",
      color: "var(--ink-700)",
      boxShadow: "none"
    }
  }[variant];
  const renderIcon = (icon, sz) => {
    if (!icon) return null;
    if (typeof icon === "string") {
      return /*#__PURE__*/React.createElement("i", {
        className: icon,
        style: {
          fontSize: sz,
          lineHeight: 1
        },
        "aria-hidden": "true"
      });
    }
    return icon;
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    className: className,
    "data-variant": variant,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: sizes.gap,
      height: sizes.height,
      padding: sizes.padding,
      width: fullWidth ? "100%" : "auto",
      borderRadius: "var(--radius-pill)",
      border: "none",
      fontFamily: "var(--font-sans)",
      fontSize: sizes.font,
      fontWeight: "var(--fw-medium)",
      lineHeight: 1,
      letterSpacing: "var(--tracking-tight)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      whiteSpace: "nowrap",
      transition: "filter var(--dur-fast) var(--ease-standard), background var(--dur-fast) var(--ease-standard)",
      ...variants,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(0.98)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.filter = "none";
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.filter = "brightness(0.96)";
    }
  }, rest), renderIcon(iconLeft, sizes.icon), children != null && /*#__PURE__*/React.createElement("span", null, children), renderIcon(iconRight, sizes.icon));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Miteda IconButton — square, softly-rounded (12px) icon-only control.
 * Used in the dashboard header (search, notifications, chat) and toolbars.
 * `dot` shows the orange unread indicator.
 */
function IconButton({
  icon,
  size = "md",
  variant = "soft",
  dot = false,
  ariaLabel,
  disabled = false,
  onClick,
  style,
  className,
  ...rest
}) {
  const dim = {
    sm: 32,
    md: 44,
    lg: 48
  }[size];
  const iconSize = {
    sm: 18,
    md: 20,
    lg: 22
  }[size];
  const variants = {
    soft: {
      background: "var(--overlay-ink-04)",
      color: "var(--ink-700)",
      boxShadow: "none"
    },
    outline: {
      background: "var(--surface-card)",
      color: "var(--ink-700)",
      boxShadow: "inset 0 0 0 1px var(--line-100)"
    },
    solid: {
      background: "var(--brand-forest)",
      color: "var(--text-on-forest)",
      boxShadow: "none"
    },
    ghost: {
      background: "transparent",
      color: "var(--ink-500)",
      boxShadow: "none"
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    disabled: disabled,
    onClick: onClick,
    className: className,
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: dim,
      height: dim,
      flex: "0 0 auto",
      borderRadius: "var(--radius-sm)",
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "filter var(--dur-fast) var(--ease-standard)",
      ...variants,
      ...style
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.filter = "brightness(0.95)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = "none";
    }
  }, rest), typeof icon === "string" ? /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      fontSize: iconSize,
      lineHeight: 1
    },
    "aria-hidden": "true"
  }) : icon, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 11,
      right: 11,
      width: 6,
      height: 6,
      borderRadius: "var(--radius-pill)",
      background: "var(--orange)"
    }
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/buttons/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Miteda SegmentedControl — the pill toggle used for List / Month views.
 * A rounded track holds equal segments; the active segment is a raised
 * white pill. Each option: { value, label, icon? }.
 */
function SegmentedControl({
  options = [],
  value,
  onChange,
  size = "md",
  style,
  className,
  ...rest
}) {
  const heights = {
    sm: 32,
    md: 40
  }[size];
  const pad = {
    sm: "0 12px",
    md: "0 16px"
  }[size];
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    className: className,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: 4,
      background: "var(--overlay-ink-04)",
      borderRadius: "var(--radius-pill)",
      ...style
    }
  }, rest), options.map(opt => {
    const active = opt.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: opt.value,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(opt.value),
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        height: heights,
        padding: pad,
        border: "none",
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-body)",
        fontWeight: "var(--fw-medium)",
        lineHeight: 1,
        color: active ? "var(--ink-900)" : "var(--ink-500)",
        background: active ? "var(--surface-white)" : "transparent",
        boxShadow: active ? "var(--shadow-xs)" : "none",
        transition: "color var(--dur-fast) var(--ease-standard), background var(--dur-fast) var(--ease-standard)"
      }
    }, opt.icon && /*#__PURE__*/React.createElement("i", {
      className: opt.icon,
      style: {
        fontSize: 16,
        lineHeight: 1
      },
      "aria-hidden": "true"
    }), opt.label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Miteda Avatar — circular initials or image. `tone="forest"` is the
 * dark sidebar avatar; default is the warm-white chip with green ring.
 */
function Avatar({
  name = "",
  src,
  size = 40,
  tone = "default",
  style,
  className,
  ...rest
}) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
  const tones = {
    default: {
      background: "var(--surface-card)",
      color: "var(--ink-700)",
      boxShadow: "inset 0 0 0 1px var(--line-200)"
    },
    forest: {
      background: "var(--brand-forest-700)",
      color: "var(--text-on-forest)",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)"
    },
    green: {
      background: "var(--brand-green)",
      color: "#fff",
      boxShadow: "none"
    }
  }[tone];
  return /*#__PURE__*/React.createElement("span", _extends({
    className: className,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      flex: "0 0 auto",
      borderRadius: "var(--radius-pill)",
      overflow: "hidden",
      fontFamily: "var(--font-sans)",
      fontSize: Math.round(size * 0.36),
      fontWeight: "var(--fw-medium)",
      letterSpacing: "0.01em",
      userSelect: "none",
      ...tones,
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "·");
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Miteda Card — the warm-white surface every dashboard panel sits on.
 * Generously rounded (24px), barely-there shadow. `tone="urgent"` tints
 * it with the warm orange wash used for urgent notices. `as` lets you
 * render a section/article.
 */
function Card({
  children,
  tone = "default",
  padding = 24,
  interactive = false,
  as: Tag = "div",
  style,
  className,
  ...rest
}) {
  const tones = {
    default: {
      background: "var(--surface-card)",
      boxShadow: "var(--shadow-xs)"
    },
    flat: {
      background: "var(--surface-card)",
      boxShadow: "inset 0 0 0 1px var(--line-100)"
    },
    sunken: {
      background: "var(--surface-sunken)",
      boxShadow: "none"
    },
    urgent: {
      background: "linear-gradient(180deg, var(--orange-soft), var(--orange-faint))",
      boxShadow: "inset 0 0 0 1px var(--orange-soft)"
    },
    forest: {
      background: "var(--brand-forest)",
      boxShadow: "none",
      color: "var(--text-on-forest)"
    }
  }[tone];
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: className,
    style: {
      borderRadius: "var(--radius-lg)",
      padding,
      boxSizing: "border-box",
      transition: interactive ? "box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)" : undefined,
      cursor: interactive ? "pointer" : undefined,
      ...tones,
      ...style
    },
    onMouseEnter: interactive ? e => {
      e.currentTarget.style.boxShadow = "var(--shadow-md)";
    } : undefined,
    onMouseLeave: interactive ? e => {
      e.currentTarget.style.boxShadow = tones.boxShadow;
    } : undefined
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/KeyRow.jsx
try { (() => {
/**
 * Miteda KeyRow — a labelled credential row from the "Digital Keys"
 * panel: a soft icon tile, a label + value, and QR / copy actions.
 * Clicking copy puts `value` on the clipboard and flashes a check.
 */
function KeyRow({
  icon = "ph ph-key",
  label,
  value,
  onShowQr,
  style,
  className
}) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    if (navigator.clipboard && value) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  const actionBtn = (iconCls, onClick, aria) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": aria,
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 32,
      height: 32,
      border: "none",
      borderRadius: "var(--radius-xs)",
      background: "transparent",
      color: "var(--ink-500)",
      cursor: "pointer",
      transition: "background var(--dur-fast) var(--ease-standard)"
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = "var(--overlay-ink-04)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = "transparent";
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: iconCls,
    style: {
      fontSize: 18,
      lineHeight: 1
    },
    "aria-hidden": "true"
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 0",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      flex: "0 0 auto",
      borderRadius: "var(--radius-sm)",
      background: "var(--overlay-ink-04)",
      color: "var(--ink-700)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      fontSize: 20,
      lineHeight: 1
    },
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body)",
      fontWeight: "var(--fw-medium)",
      color: "var(--ink-900)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body)",
      color: "var(--ink-500)"
    }
  }, value)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      flex: "0 0 auto"
    }
  }, actionBtn("ph ph-qr-code", onShowQr, "Show QR code"), actionBtn(copied ? "ph ph-check" : "ph ph-copy", copy, "Copy")));
}
Object.assign(__ds_scope, { KeyRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/KeyRow.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Miteda Badge — small pill label for categories & status
 * (Urgent, Rules, Cleaning, Topic…). Tones map to the signal palette.
 * `dot` prefixes a colored status dot instead of a filled background.
 */
function Badge({
  children,
  tone = "neutral",
  variant = "soft",
  dot = false,
  style,
  className,
  ...rest
}) {
  const tones = {
    urgent: {
      fg: "var(--orange)",
      soft: "var(--orange-soft)",
      solidBg: "var(--orange)",
      dot: "var(--orange)"
    },
    success: {
      fg: "var(--brand-green-strong)",
      soft: "var(--brand-green-soft)",
      solidBg: "var(--brand-green)",
      dot: "var(--brand-green)"
    },
    event: {
      fg: "#c14b78",
      soft: "rgba(253,179,202,0.35)",
      solidBg: "var(--accent-pink)",
      dot: "var(--accent-pink)"
    },
    neutral: {
      fg: "var(--ink-700)",
      soft: "var(--overlay-ink-04)",
      solidBg: "var(--ink-700)",
      dot: "var(--ink-400)"
    }
  }[tone];
  const palettes = {
    soft: {
      background: tones.soft,
      color: tones.fg
    },
    solid: {
      background: tones.solidBg,
      color: "#fff"
    },
    ghost: {
      background: "transparent",
      color: tones.fg
    }
  }[variant];
  return /*#__PURE__*/React.createElement("span", _extends({
    className: className,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 24,
      padding: dot ? "0 10px 0 8px" : "0 10px",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-small)",
      fontWeight: "var(--fw-medium)",
      lineHeight: 1,
      whiteSpace: "nowrap",
      ...palettes,
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "var(--radius-pill)",
      background: tones.dot
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/**
 * Miteda Checkbox — square, 6px radius. Checked = signal green with a
 * white Phosphor check. Pairs with an optional inline label.
 */
function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  id,
  style,
  className
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = isControlled ? checked : internal;
  const boxId = id || (label ? `cb-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: boxId,
    className: className,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body)",
      color: "var(--ink-700)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    id: boxId,
    type: "button",
    role: "checkbox",
    "aria-checked": on,
    disabled: disabled,
    onClick: toggle,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 20,
      height: 20,
      flex: "0 0 auto",
      padding: 0,
      border: "none",
      borderRadius: 6,
      cursor: "inherit",
      background: on ? "var(--brand-green)" : "var(--surface-card)",
      boxShadow: on ? "none" : "inset 0 0 0 1.5px var(--line-300)",
      transition: "background var(--dur-fast) var(--ease-standard)"
    }
  }, on && /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-check",
    style: {
      fontSize: 13,
      color: "#fff",
      lineHeight: 1
    },
    "aria-hidden": "true"
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Miteda Input — labelled text field. 12px radius, hairline border,
 * optional leading/trailing Phosphor icon. Focus ring is signal green.
 */
function Input({
  label,
  id,
  type = "text",
  placeholder,
  value,
  defaultValue,
  onChange,
  iconLeft,
  iconRight,
  disabled = false,
  size = "md",
  style,
  className,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const height = {
    sm: 36,
    md: 44
  }[size];
  const inputId = id || (label ? `in-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body)",
      fontWeight: "var(--fw-medium)",
      color: "var(--ink-700)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      height,
      padding: "0 14px",
      background: disabled ? "var(--surface-fill)" : "var(--surface-card)",
      borderRadius: "var(--radius-sm)",
      boxShadow: focused ? "inset 0 0 0 1.5px var(--focus-ring)" : "inset 0 0 0 1px var(--line-200)",
      transition: "box-shadow var(--dur-fast) var(--ease-standard)",
      opacity: disabled ? 0.6 : 1
    }
  }, iconLeft && /*#__PURE__*/React.createElement("i", {
    className: iconLeft,
    style: {
      fontSize: 18,
      color: "var(--ink-400)",
      lineHeight: 1
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body)",
      color: "var(--ink-900)"
    }
  }, rest)), iconRight && /*#__PURE__*/React.createElement("i", {
    className: iconRight,
    style: {
      fontSize: 18,
      color: "var(--ink-400)",
      lineHeight: 1
    },
    "aria-hidden": "true"
  })));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/**
 * Miteda Switch — pill toggle. Off = neutral track, On = signal green.
 * Controlled (checked + onChange) or uncontrolled (defaultChecked).
 */
function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  ariaLabel,
  style,
  className
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = isControlled ? checked : internal;
  const dims = {
    sm: {
      w: 36,
      h: 20,
      knob: 14,
      pad: 3
    },
    md: {
      w: 44,
      h: 24,
      knob: 18,
      pad: 3
    }
  }[size];
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": on,
    "aria-label": ariaLabel,
    disabled: disabled,
    onClick: toggle,
    className: className,
    style: {
      position: "relative",
      width: dims.w,
      height: dims.h,
      flex: "0 0 auto",
      padding: 0,
      border: "none",
      borderRadius: "var(--radius-pill)",
      cursor: disabled ? "not-allowed" : "pointer",
      background: on ? "var(--brand-green)" : "var(--line-300)",
      opacity: disabled ? 0.5 : 1,
      transition: "background var(--dur-base) var(--ease-standard)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: dims.pad,
      left: on ? dims.w - dims.knob - dims.pad : dims.pad,
      width: dims.knob,
      height: dims.knob,
      borderRadius: "var(--radius-pill)",
      background: "#fff",
      boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
      transition: "left var(--dur-base) var(--ease-out)"
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Miteda SidebarItem — a nav row for the evergreen sidebar. Icon + label;
 * the active row gets a raised translucent fill and brighter ink. Designed
 * to sit on the --brand-forest background.
 */
function SidebarItem({
  icon,
  children,
  active = false,
  onClick,
  style,
  className,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    className: className,
    "aria-current": active ? "page" : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      height: 44,
      padding: "0 14px",
      border: "none",
      borderRadius: "var(--radius-sm)",
      cursor: "pointer",
      textAlign: "left",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body)",
      fontWeight: "var(--fw-medium)",
      lineHeight: 1,
      background: active ? "rgba(120,191,62,0.16)" : hover ? "rgba(255,255,255,0.05)" : "transparent",
      color: active ? "var(--text-on-forest)" : "rgba(255,254,252,0.7)",
      transition: "background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)",
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      fontSize: 20,
      lineHeight: 1,
      color: active ? "var(--brand-green)" : "inherit",
      flex: "0 0 auto"
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, children));
}
Object.assign(__ds_scope, { SidebarItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarItem.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/DigitalKeys.jsx
try { (() => {
/* global React */
(function () {
  const {
    Card,
    KeyRow
  } = window.MitedaDesignSystem_acc833;
  function DigitalKeys() {
    const SectionTitle = window.SectionTitle;
    return /*#__PURE__*/React.createElement(Card, {
      style: {
        display: "flex",
        flexDirection: "column"
      }
    }, /*#__PURE__*/React.createElement(SectionTitle, {
      title: "Digital Keys"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column"
      }
    }, /*#__PURE__*/React.createElement(KeyRow, {
      icon: "ph ph-key",
      label: "Stairway code",
      value: "#1234#"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: "var(--line-100)"
      }
    }), /*#__PURE__*/React.createElement(KeyRow, {
      icon: "ph ph-car-profile",
      label: "Parking code",
      value: "#5678#"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: "var(--line-100)"
      }
    }), /*#__PURE__*/React.createElement(KeyRow, {
      icon: "ph ph-wifi-high",
      label: "Wi-fi (common area)",
      value: "kalnu2024"
    })));
  }
  window.DigitalKeys = DigitalKeys;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/DigitalKeys.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/DiscussionsMessages.jsx
try { (() => {
/* global React */
(function () {
  const {
    Card,
    Badge,
    Button,
    IconButton,
    Avatar
  } = window.MitedaDesignSystem_acc833;
  function AvatarStack() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center"
      }
    }, ["Aa", "Bb", "Cc"].map((n, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        marginLeft: i ? -10 : 0,
        borderRadius: "var(--radius-pill)",
        boxShadow: "0 0 0 2px var(--surface-card)"
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: n,
      tone: "default",
      size: 28,
      style: {
        background: "var(--surface-sunken)"
      }
    }))));
  }
  function Discussions() {
    const SectionTitle = window.SectionTitle;
    const items = [{
      title: "Parking rules reminder for all",
      replies: 52,
      views: "3.2"
    }, {
      title: "Bike storage in the basement",
      replies: 18,
      views: "1.1"
    }];
    return /*#__PURE__*/React.createElement(Card, {
      style: {
        display: "flex",
        flexDirection: "column"
      }
    }, /*#__PURE__*/React.createElement(SectionTitle, {
      title: "Featured discussions",
      subtitle: "Most active threads this week"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        flex: 1
      }
    }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: 16,
        borderRadius: "var(--radius-md)",
        boxShadow: "inset 0 0 0 1px var(--line-100)",
        background: "var(--surface-card)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "success"
    }, "Topic"), /*#__PURE__*/React.createElement(AvatarStack, null)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        fontSize: "var(--text-title)",
        fontWeight: "var(--fw-medium)",
        color: "var(--ink-900)"
      }
    }, it.title), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-small)",
        color: "var(--ink-400)"
      }
    }, it.replies, " replies\xA0\xA0\xB7\xA0\xA0", it.views, " views")), /*#__PURE__*/React.createElement(IconButton, {
      icon: "ph ph-arrow-up-right",
      variant: "ghost",
      size: "sm",
      ariaLabel: "Open thread"
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      iconLeft: "ph ph-plus-circle",
      fullWidth: true
    }, "Report New Issue")));
  }
  function Messages() {
    const SectionTitle = window.SectionTitle;
    const msgs = [{
      name: "Greta Janušienė",
      preview: "Thanks for fixing the intercom so fast!",
      unread: false
    }, {
      name: "Tomas Petraitis",
      preview: "Could we add another bike rack downstairs?",
      unread: true
    }, {
      name: "Rūta K.",
      preview: "The elevator is making a noise again.",
      unread: true
    }, {
      name: "Building manager",
      preview: "Reminder: water shutoff this Thursday.",
      unread: false
    }];
    return /*#__PURE__*/React.createElement(Card, {
      style: {
        display: "flex",
        flexDirection: "column"
      }
    }, /*#__PURE__*/React.createElement(SectionTitle, {
      title: "New messages",
      subtitle: "Direct messages from residents"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        flex: 1
      }
    }, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: "var(--radius-md)",
        background: m.unread ? "linear-gradient(180deg, var(--orange-soft), var(--orange-faint))" : "var(--surface-sunken)"
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: m.name,
      size: 36,
      tone: "default"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-body)",
        fontWeight: "var(--fw-medium)",
        color: "var(--ink-900)"
      }
    }, m.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-body)",
        color: "var(--ink-500)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, m.preview)), m.unread && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: "var(--radius-pill)",
        background: "var(--orange)",
        flex: "0 0 auto"
      }
    })))));
  }
  window.Discussions = Discussions;
  window.Messages = Messages;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/DiscussionsMessages.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/EventsCalendar.jsx
try { (() => {
/* global React */
(function () {
  const {
    Card,
    Button,
    IconButton,
    SegmentedControl
  } = window.MitedaDesignSystem_acc833;
  const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const EVENT_DAYS = {
    9: 3,
    12: 1,
    13: 2,
    14: 1,
    21: 1,
    23: 1,
    28: 3,
    30: 1
  };
  function buildMonth(year, month) {
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }
  function CalendarGrid({
    selected,
    onSelect,
    today
  }) {
    const cells = buildMonth(2026, 5);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        marginBottom: 6
      }
    }, WEEKDAYS.map(w => /*#__PURE__*/React.createElement("span", {
      key: w,
      style: {
        textAlign: "center",
        fontSize: "var(--text-small)",
        color: "var(--ink-400)",
        padding: "6px 0"
      }
    }, w))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 2
      }
    }, cells.map((d, i) => {
      if (d === null) return /*#__PURE__*/React.createElement("span", {
        key: i
      });
      const isToday = d === today;
      const isSel = d === selected;
      const dots = EVENT_DAYS[d] || 0;
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        type: "button",
        onClick: () => onSelect(d),
        style: {
          position: "relative",
          aspectRatio: "1 / 1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-body)",
          fontWeight: isToday ? "var(--fw-medium)" : "var(--fw-regular)",
          background: isToday ? "var(--brand-green)" : isSel ? "var(--brand-green-faint)" : "transparent",
          color: isToday ? "#fff" : isSel ? "var(--brand-green-strong)" : "var(--ink-700)",
          transition: "background var(--dur-fast) var(--ease-standard)"
        }
      }, d, dots > 0 && /*#__PURE__*/React.createElement("span", {
        style: {
          position: "absolute",
          bottom: 5,
          display: "flex",
          gap: 2
        }
      }, Array.from({
        length: dots
      }).map((_, k) => /*#__PURE__*/React.createElement("span", {
        key: k,
        style: {
          width: 4,
          height: 4,
          borderRadius: "var(--radius-pill)",
          background: isToday ? "#fff" : "var(--brand-green)"
        }
      }))));
    })));
  }
  function ScheduleRow({
    title,
    time,
    place
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: "var(--radius-pill)",
        background: "var(--accent-pink)",
        flex: "0 0 auto"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-body)",
        fontWeight: "var(--fw-medium)",
        color: "var(--ink-900)"
      }
    }, title), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-body)",
        color: "var(--ink-500)"
      }
    }, time, "\xA0\xA0\xB7\xA0\xA0", place)), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "Details"));
  }
  function EventsCalendar() {
    const SectionTitle = window.SectionTitle;
    const [view, setView] = React.useState("month");
    const [selected, setSelected] = React.useState(23);
    return /*#__PURE__*/React.createElement(Card, {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(SectionTitle, {
      title: "Upcoming Events",
      action: /*#__PURE__*/React.createElement(SegmentedControl, {
        value: view,
        onChange: setView,
        options: [{
          value: "list",
          label: "List",
          icon: "ph ph-list-bullets"
        }, {
          value: "month",
          label: "Month",
          icon: "ph ph-calendar-dots"
        }]
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: "ph ph-caret-left",
      variant: "ghost",
      size: "sm",
      ariaLabel: "Previous month"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-title)",
        fontWeight: "var(--fw-medium)",
        color: "var(--ink-900)"
      }
    }, "June 2026"), /*#__PURE__*/React.createElement(IconButton, {
      icon: "ph ph-caret-right",
      variant: "ghost",
      size: "sm",
      ariaLabel: "Next month"
    })), /*#__PURE__*/React.createElement(CalendarGrid, {
      selected: selected,
      onSelect: setSelected,
      today: 26
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: "var(--line-100)"
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-body)",
        color: "var(--ink-500)"
      }
    }, "Schedule"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-small)",
        color: "var(--ink-400)"
      }
    }, "2 events")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-title)",
        fontWeight: "var(--fw-medium)",
        color: "var(--ink-900)"
      }
    }, "May 26, 2026"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(ScheduleRow, {
      title: "Community meeting",
      time: "16:30",
      place: "Stairwell A"
    }), /*#__PURE__*/React.createElement(ScheduleRow, {
      title: "Booked BBQ \u21162",
      time: "18:30",
      place: "Building C"
    }))));
  }
  window.EventsCalendar = EventsCalendar;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/EventsCalendar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Header.jsx
try { (() => {
/* global React */
(function () {
  const {
    IconButton,
    Input
  } = window.MitedaDesignSystem_acc833;
  function Header({
    title,
    subtitle,
    onSearch
  }) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "16px 24px",
        borderRadius: "var(--radius-lg)",
        background: "var(--glass-card)",
        backdropFilter: "var(--blur-glass)",
        WebkitBackdropFilter: "var(--blur-glass)",
        boxShadow: "var(--shadow-xs)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        fontSize: "var(--text-display)",
        lineHeight: "var(--lh-display)",
        fontWeight: "var(--fw-medium)",
        letterSpacing: "var(--tracking-tight)",
        color: "var(--ink-900)"
      }
    }, title), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: "var(--text-body)",
        color: "var(--ink-500)"
      }
    }, subtitle)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Input, {
      placeholder: "Search invoices, events\u2026",
      iconLeft: "ph ph-magnifying-glass",
      onChange: e => onSearch && onSearch(e.target.value),
      style: {
        width: 264
      }
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "ph ph-bell",
      variant: "soft",
      dot: true,
      ariaLabel: "Notifications"
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "ph ph-chat-circle",
      variant: "soft",
      dot: true,
      ariaLabel: "Messages"
    })));
  }
  window.Header = Header;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/NoticeBoard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* global React */
(function () {
  const {
    Card,
    Badge,
    IconButton
  } = window.MitedaDesignSystem_acc833;
  function SectionTitle({
    title,
    subtitle,
    action
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontSize: "var(--text-heading)",
        lineHeight: "var(--lh-heading)",
        fontWeight: "var(--fw-medium)",
        letterSpacing: "var(--tracking-tight)",
        color: "var(--ink-900)"
      }
    }, title), subtitle && /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: "var(--text-body)",
        color: "var(--ink-500)"
      }
    }, subtitle)), action);
  }
  function NoticeCard({
    tone,
    category,
    categoryTone,
    title,
    body,
    date
  }) {
    return /*#__PURE__*/React.createElement(Card, {
      tone: tone,
      padding: 18,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        flex: 1,
        minWidth: 0,
        borderRadius: "var(--radius-md)"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: categoryTone
    }, category), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        fontSize: "var(--text-title)",
        lineHeight: "var(--lh-title)",
        fontWeight: "var(--fw-medium)",
        color: "var(--ink-900)",
        textWrap: "pretty"
      }
    }, title), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: "var(--text-body)",
        lineHeight: "var(--lh-body)",
        color: "var(--ink-500)",
        textWrap: "pretty"
      }
    }, body)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-small)",
        color: "var(--ink-400)"
      }
    }, date), /*#__PURE__*/React.createElement(IconButton, {
      icon: "ph ph-arrow-up-right",
      variant: "ghost",
      size: "sm",
      ariaLabel: "Open"
    })));
  }
  function NoticeBoard() {
    const notices = [{
      tone: "urgent",
      category: "Urgent",
      categoryTone: "urgent",
      title: "Hot water shutdown on June 12",
      body: "Hot water off from 9:00 to 14:00 due to scheduled maintenance.",
      date: "June 25, 2026"
    }, {
      tone: "flat",
      category: "Rules",
      categoryTone: "neutral",
      title: "Parking rules reminder",
      body: "Each owner has one assigned spot. Please respect the rules.",
      date: "June 20, 2026"
    }, {
      tone: "flat",
      category: "Cleaning",
      categoryTone: "neutral",
      title: "Stairwell cleaning every Friday",
      body: "Stairwell cleaning takes place every Friday, 8:00–10:00.",
      date: "May 16, 2026"
    }];
    return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, {
      title: "Notice Board",
      subtitle: "Latest announcements from management"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 16
      }
    }, notices.map((n, i) => /*#__PURE__*/React.createElement(NoticeCard, _extends({
      key: i
    }, n)))));
  }
  window.SectionTitle = SectionTitle;
  window.NoticeBoard = NoticeBoard;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/NoticeBoard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Sidebar.jsx
try { (() => {
/* global React */
(function () {
  const {
    SidebarItem,
    Avatar
  } = window.MitedaDesignSystem_acc833;
  const NAV_TOP = [{
    icon: "ph ph-house",
    label: "Pagrindinis"
  }, {
    icon: "ph ph-warning-octagon",
    label: "Defektai"
  }, {
    icon: "ph ph-images-square",
    label: "Nuotraukos"
  }, {
    icon: "ph ph-file-text",
    label: "Paslaugų sutartys"
  }, {
    icon: "ph ph-address-book",
    label: "Kontaktai"
  }, {
    icon: "ph ph-calendar-dots",
    label: "Tvarkaraštis"
  }, {
    icon: "ph ph-megaphone",
    label: "Skelbimų lenta"
  }, {
    icon: "ph ph-newspaper",
    label: "Naujienos"
  }];
  const NAV_BOTTOM = [{
    icon: "ph ph-users-three",
    label: "Bendruomenė"
  }, {
    icon: "ph ph-wrench",
    label: "Remonto darbai"
  }];
  function ChipRow({
    leading,
    title,
    subtitle
  }) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "8px 10px",
        border: "none",
        borderRadius: "var(--radius-sm)",
        background: "rgba(255,255,255,0.05)",
        cursor: "pointer",
        textAlign: "left"
      }
    }, leading, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-body)",
        fontWeight: "var(--fw-medium)",
        color: "var(--text-on-forest)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, title), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-small)",
        color: "rgba(255,254,252,0.55)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, subtitle)), /*#__PURE__*/React.createElement("i", {
      className: "ph ph-caret-up-down",
      style: {
        fontSize: 16,
        color: "rgba(255,254,252,0.55)"
      }
    }));
  }
  function Sidebar({
    active,
    onNavigate
  }) {
    return /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 256,
        flex: "0 0 auto",
        background: "var(--brand-forest)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 12px 16px",
        gap: 8,
        height: "100%",
        boxSizing: "border-box"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "4px 8px 12px"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/miteda-logo-light.svg",
      alt: "Miteda",
      style: {
        height: 28,
        display: "block"
      }
    })), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 2
      }
    }, NAV_TOP.map(it => /*#__PURE__*/React.createElement(SidebarItem, {
      key: it.label,
      icon: it.icon,
      active: active === it.label,
      onClick: () => onNavigate(it.label)
    }, it.label)), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: "rgba(255,255,255,0.08)",
        margin: "10px 12px"
      }
    }), NAV_BOTTOM.map(it => /*#__PURE__*/React.createElement(SidebarItem, {
      key: it.label,
      icon: it.icon,
      active: active === it.label,
      onClick: () => onNavigate(it.label)
    }, it.label))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(ChipRow, {
      leading: /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "var(--surface-card)",
          color: "var(--brand-forest)"
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "ph ph-buildings",
        style: {
          fontSize: 20
        }
      })),
      title: "Kaln\u0173 Terasos",
      subtitle: "Apr. B-12"
    }), /*#__PURE__*/React.createElement(ChipRow, {
      leading: /*#__PURE__*/React.createElement(Avatar, {
        name: "Name Surname",
        tone: "forest",
        size: 36
      }),
      title: "Name Surname",
      subtitle: "example@gmail.com"
    })));
  }
  window.Sidebar = Sidebar;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Sidebar.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.KeyRow = __ds_scope.KeyRow;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.SidebarItem = __ds_scope.SidebarItem;

})();
