import { Link } from "react-router-dom"
export default function Navbar(){
    return (
        <div id="navbar">
            <nav style={{ padding: "10px", backgroundColor: "#1877f2", color: "white" }}>
                    <Link to="/" style={{ marginRight: "15px", color: "white", textDecoration: "none" }}>Home</Link>
                    <Link to="/about" style={{ marginRight: "15px", color: "white", textDecoration: "none" }} >About</Link>
            </nav>
        </div>
    )   
}



