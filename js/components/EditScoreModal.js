/**
 * Edit score modal: update score and grid image.
 */
(function () {
  const e = React.createElement;

  function EditScoreModal(props) {
    const {
      editingScore,
      setEditingScore,
      onClose,
      onUpdateScore,
      saving,
      onImageUpload,
      onDeleteImage,
      uploadingImage,
      onViewImage,
    } = props;

    if (!editingScore) return null;

    return e(
      "div",
      {
        className:
          "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
        onClick: onClose,
      },
      e(
        "div",
        {
          className:
            "bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",
          onClick: (ev) => ev.stopPropagation(),
        },
        e(
          "div",
          { className: "p-6" },
          e(
            "div",
            { className: "flex items-center justify-between mb-4" },
            e(
              "h2",
              { className: "text-2xl font-bold text-gray-800" },
              `Edit Grid - ${editingScore.name}`
            ),
            e(
              "button",
              {
                onClick: onClose,
                className:
                  "text-gray-500 hover:text-gray-700 text-2xl font-bold",
              },
              "×"
            )
          ),
          e(
            "div",
            { className: "mb-4" },
            e(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Date"
            ),
            e("input", {
              type: "date",
              value: editingScore.date,
              disabled: true,
              className:
                "w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed",
            })
          ),
          e(
            "div",
            { className: "mb-4" },
            e(
              "label",
              { className: "block text-sm font-medium text-gray-700 mb-1" },
              "Score (0-900)"
            ),
            e("input", {
              type: "number",
              min: "0",
              max: "900",
              value: editingScore.score,
              onChange: (ev) =>
                setEditingScore({
                  ...editingScore,
                  score: ev.target.value,
                }),
              className:
                "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent",
            })
          ),
          e(
            "button",
            {
              onClick: onUpdateScore,
              disabled: saving,
              className:
                "w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 mb-4",
            },
            saving ? "Updating..." : "Update Score"
          ),
          e(
            "div",
            { className: "border-t pt-4" },
            e(
              "h3",
              { className: "text-lg font-bold text-gray-800 mb-3" },
              "Grid Image"
            ),
            editingScore.imageUrl &&
              e(
                "div",
                { className: "mb-4" },
                e("img", {
                  src: editingScore.imageUrl,
                  alt: "Grid image",
                  className:
                    "w-full rounded-lg border border-gray-300 mb-2 cursor-pointer hover:opacity-90",
                  onClick: () => onViewImage(editingScore.imageUrl),
                }),
                e(
                  "button",
                  {
                    onClick: onDeleteImage,
                    disabled: uploadingImage,
                    className:
                      "w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50",
                  },
                  uploadingImage ? "Deleting..." : "Delete Image"
                )
              ),
            e(
              "div",
              { className: "mb-4" },
              e(
                "label",
                {
                  className: "block text-sm font-medium text-gray-700 mb-2",
                },
                "Upload Grid Image"
              ),
              e("input", {
                type: "file",
                accept: "image/*",
                onChange: (ev) => {
                  const file = ev.target.files[0];
                  if (file) onImageUpload(file);
                },
                disabled: uploadingImage,
                className:
                  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50",
              })
            ),
            uploadingImage &&
              e(
                "div",
                {
                  className:
                    "bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg mb-4",
                },
                "Uploading image..."
              ),
            e(
              "p",
              { className: "text-xs text-gray-500 italic" },
              "Note: Only your top 9 scores plus today's score can have images. Uploading a new image may replace an existing one."
            )
          )
        )
      )
    );
  }

  window.EditScoreModal = EditScoreModal;
})();
