// Icon components as inline SVGs
// Note: We use React.createElement directly here instead of storing it in a variable
// to avoid conflicts with other files

window.Icons = {
  Trophy: (props) =>
    React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
      },
      React.createElement("path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6" }),
      React.createElement("path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18" }),
      React.createElement("path", { d: "M4 22h16" }),
      React.createElement("path", {
        d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",
      }),
      React.createElement("path", {
        d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",
      }),
      React.createElement("path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z" })
    ),

  Plus: (props) =>
    React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
      },
      React.createElement("path", { d: "M5 12h14" }),
      React.createElement("path", { d: "M12 5v14" })
    ),

  ArrowLeft: (props) =>
    React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
      },
      React.createElement("path", { d: "m12 19-7-7 7-7" }),
      React.createElement("path", { d: "M19 12H5" })
    ),

  Calendar: (props) =>
    React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
      },
      React.createElement("rect", {
        width: "18",
        height: "18",
        x: "3",
        y: "4",
        rx: "2",
        ry: "2",
      }),
      React.createElement("line", { x1: "16", x2: "16", y1: "2", y2: "6" }),
      React.createElement("line", { x1: "8", x2: "8", y1: "2", y2: "6" }),
      React.createElement("line", { x1: "3", x2: "21", y1: "10", y2: "10" })
    ),

  TrendingDown: (props) =>
    React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
      },
      React.createElement("polyline", {
        points: "22 17 13.5 8.5 8.5 13.5 2 7",
      }),
      React.createElement("polyline", { points: "16 17 22 17 22 11" })
    ),

  Hash: (props) =>
    React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
      },
      React.createElement("line", { x1: "4", x2: "20", y1: "9", y2: "9" }),
      React.createElement("line", { x1: "4", x2: "20", y1: "15", y2: "15" }),
      React.createElement("line", { x1: "10", x2: "8", y1: "3", y2: "21" }),
      React.createElement("line", { x1: "16", x2: "14", y1: "3", y2: "21" })
    ),

  RefreshCw: (props) =>
    React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
      },
      React.createElement("path", {
        d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
      }),
      React.createElement("path", { d: "M21 3v5h-5" }),
      React.createElement("path", {
        d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
      }),
      React.createElement("path", { d: "M3 21v-5h5" })
    ),
};

console.log("Icons loaded successfully");
