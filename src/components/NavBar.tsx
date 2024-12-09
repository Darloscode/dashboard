
import { FaBars, FaTimes } from "react-icons/fa";
import { useRef } from "react";
import "../styles/NavBar.css";
import logo from "../assets/react.svg";

export default function Navbar() {
    const navRef = useRef<HTMLDivElement>(null);

    const showNavBar = () => {
        navRef.current.classList.toggle("responsive_nav");
    };

    return (
        <header>
            <button className="nav-btn" onClick={showNavBar}>
                <FaBars />
            </button>
            
            <nav ref={navRef}>

                <div className="nav-header">
                    <img id="logo" src={logo} alt="logo" />
                    <h3 id="logo-title">Guayaquil Forecast</h3>
                </div>

                <a href="#" onClick={showNavBar}>Inicio</a>
                <a href="#indicators" onClick={showNavBar}>Detalles</a>
                <a href="#table" onClick={showNavBar}>Historial</a>
                <a href="#graphic" onClick={showNavBar}>Gráfico</a>

                <button className="nav-btn nav-close-btn" onClick={showNavBar}>
                    <FaTimes />
                </button>

            </nav>
        </header>
    );
}
