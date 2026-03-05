/**
 * Add New Score form (name, date, score, optional image).
 */
(function () {
  const e = React.createElement;

  function AddScoreForm(props) {
    const {
      newScore,
      setNewScore,
      players,
      isTodaysScore,
      saving,
      onSave,
      onCancel,
    } = props;

    return e(
      "div",
      {
        className:
          "bg-blue-50 p-6 rounded-lg mb-6 border-2 border-blue-200",
      },
      e(
        "h2",
        { className: "text-xl font-bold mb-4 text-gray-800" },
        "Add New Score"
      ),
      e(
        "div",
        { className: "grid gap-4" },
        e(
          "div",
          null,
          e(
            "label",
            { className: "block text-sm font-medium text-gray-700 mb-1" },
            "Player Name"
          ),
          e("input", {
            type: "text",
            value: newScore.name,
            onChange: (ev) =>
              setNewScore({ ...newScore, name: ev.target.value }),
            placeholder: "Enter name",
            className:
              "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent",
            list: "player-names",
          }),
          e(
            "datalist",
            { id: "player-names" },
            Object.keys(players).map((name) =>
              e("option", { key: name, value: name })
            )
          )
        ),
        e(
          "div",
          null,
          e(
            "label",
            { className: "block text-sm font-medium text-gray-700 mb-1" },
            "Date"
          ),
          e("input", {
            type: "date",
            value: newScore.date,
            onChange: (ev) =>
              setNewScore({ ...newScore, date: ev.target.value }),
            disabled: isTodaysScore,
            className:
              "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500",
          })
        ),
        e(
          "div",
          null,
          e(
            "label",
            { className: "block text-sm font-medium text-gray-700 mb-1" },
            "Score (0-900)"
          ),
          e("input", {
            type: "number",
            min: "0",
            max: "900",
            value: newScore.score,
            onChange: (ev) =>
              setNewScore({ ...newScore, score: ev.target.value }),
            placeholder: "Enter score",
            className:
              "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent",
          })
        ),
        e(
          "div",
          null,
          e(
            "label",
            { className: "block text-sm font-medium text-gray-700 mb-1" },
            "Grid Image (Optional)"
          ),
          e("input", {
            type: "file",
            accept: "image/*",
            onChange: (ev) => {
              const file = ev.target.files[0];
              setNewScore({ ...newScore, imageFile: file });
            },
            disabled: saving,
            className:
              "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50",
          }),
          newScore.imageFile &&
            e(
              "p",
              { className: "text-sm text-gray-600 mt-1" },
              `Selected: ${newScore.imageFile.name}`
            )
        ),
        e(
          "div",
          { className: "flex gap-2" },
          e(
            "button",
            {
              onClick: onSave,
              disabled: saving,
              className:
                "flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50",
            },
            saving ? "Saving..." : "Save Score"
          ),
          e(
            "button",
            {
              onClick: onCancel,
              disabled: saving,
              className:
                "flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50",
            },
            "Cancel"
          )
        )
      )
    );
  }

  window.AddScoreForm = AddScoreForm;
})();
