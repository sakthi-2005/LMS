export function Sidebar({ active, setActive, isOpen, setIsOpen, setUser }) {
  const navLinks = ["Dashboard", "Calendar", "Pending Approvals", "History"];

  return (
    <>
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
          {navLinks.map((link) => (
            <li
              key={link}
              className={active === link ? "active" : ""}
              onClick={() => {
                setActive(link);
                setIsOpen(false);
              }}
            >
              {link}
            </li>
          ))}
        </ul>
        <a
          className="logout"
          onClick={() => {
            localStorage.removeItem("user");
            setUser(null);
          }}
        >
          Logout
        </a>
      </div>
    </>
  );
}
