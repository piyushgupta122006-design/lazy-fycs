function Paper({ content, pageNum }) {
  return (
    <div
      className="paper font-hand relative shadow-lg"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "25mm",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        color: "#1a237e",
        fontSize: "18px",
        borderLeft: "3px solid #c62828",
      }}
    >
      <span
        className="font-hand text-[#1a237e]"
        style={{
          position: "absolute",
          top: "0.75rem",
          right: "1rem",
          fontSize: "18px",
        }}
      >
        {pageNum}
      </span>
      <div className="whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}

export default Paper;
