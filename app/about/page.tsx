export default function AboutPage() {
  return (
    <div
      style={{
        maxWidth: "640px",
        display: "grid",
        gap: "1rem",
      }}
    >
      <h1
        style={{
          fontSize: "1.8rem",
          fontWeight: 700,
        }}
      >
        Yewon Choi
      </h1>

      <section
        style={{
          backgroundColor: "white",
          padding: "1.25rem 1rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
        }}
      >
        <h2
          style={{
            fontSize: "1.1rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Developer
        </h2>
        <p style={{ color: "#363d47ff", lineHeight: 1.5 }}>
          Bookshelf is a CGT 390 Final project developed by 
          <strong> Yewon Choi</strong>.
        </p>
        <p style={{ color: "#363d47ff", lineHeight: 1.5, marginTop: "0.5rem" }}>
          The goal of this app is make it easy to track what youre
          reading and write your thought
        </p>
      </section>
    </div>
  );
}
