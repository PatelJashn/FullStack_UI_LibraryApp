import React from "react";
import './Part.css'

const Part = () => {
    return(<div className="div">
        <h1>The Ultimate UI Library of Open-Source UI</h1>
        <p>Community-built library of UI elements.</p>
        <p>Copy as HTML/CSS, Tailwind, React and Figma</p>

        <form class="search-bar">
  <input
    type="text"
    name="search"
    id="search"
    placeholder="Search for components, styles, creators..."
  />
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
  <button type="submit">Search</button>
</form>

        </div>
    )
}

export default Part