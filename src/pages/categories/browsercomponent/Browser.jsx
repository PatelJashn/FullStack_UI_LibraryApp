import React from "react";
import { Book, List, CheckSquare, ToggleLeft, CreditCard, Loader, Radio, MousePointerClick } from "lucide-react"; // Replace InputIcon
import "./browse.css"; // Importing the external CSS file

const UIGallery = () => {
  const categories = [
    { name: "All", icon: Book },
    { name: "Buttons", icon: List },
    { name: "Checkboxes", icon: CheckSquare },
    { name: "Toggle switches", icon: ToggleLeft },
    { name: "Cards", icon: CreditCard },
    { name: "Loaders", icon: Loader },
    { name: "Inputs", icon: MousePointerClick }, // Replaced invalid InputIcon
    { name: "Radio buttons", icon: Radio },
  ];

  return (
    <div className="ui-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Categories</h2>
        {categories.map(({ name, icon: Icon }) => (
          <div key={name} className="sidebar-item">
            <Icon size={18} />
            {name}
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="main-title">UI Gallery</h1>
        <div className="grid-container">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="grid-item">
              Placeholder for iframe
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UIGallery;
