/**
 * Full-screen image viewer overlay.
 */
(function () {
  const e = React.createElement;

  function ImageViewerModal(props) {
    const { imageUrl, onClose } = props;

    if (!imageUrl) return null;

    return e(
      "div",
      {
        className:
          "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4",
        onClick: onClose,
      },
      e(
        "div",
        {
          className: "relative max-w-4xl w-full",
          onClick: (ev) => ev.stopPropagation(),
        },
        e(
          "button",
          {
            onClick: onClose,
            className:
              "absolute top-4 right-4 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold hover:bg-gray-200 z-10 shadow-lg",
          },
          "×"
        ),
        e("img", {
          src: imageUrl,
          alt: "Grid image",
          className: "w-full h-auto rounded-lg shadow-2xl",
        })
      )
    );
  }

  window.ImageViewerModal = ImageViewerModal;
})();
