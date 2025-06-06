// src/pages/projecte/ProjecteDetall.jsx
import { useParams } from "react-router-dom";
import ProjectesDetall from "../../components/projectesDetall/ProjectesDetall";

export default function ProjecteDetall() {
    const { id } = useParams();

    return <ProjectesDetall id={id} />;
}
