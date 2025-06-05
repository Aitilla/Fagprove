"use client"

export default function Header() {
  function handleLogout() {
    console.log("Logout")
    // Clear cookies. Which should also redirect you to login page
  }
  return (
    <div className="header">
      <button
        onClick={() => {
          handleLogout;
        }}
      >Logout</button>
    </div>
  );
}
