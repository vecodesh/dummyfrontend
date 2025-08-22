import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import '../styles/Home.css'
import '../styles/globals.css'
import {Upload} from 'upload-js';
import axios from 'axios';
import { Document } from './DocumentList';
import { Folder } from './Folder';
import {CreateFolder} from './CreateFolder';

export const Home=()=>{
    const navigate = useNavigate();
    const [refresh,setRefresh] = useState(false);
    const {state} = useLocation();
    const [email,setEmail] = useState(state?.email || "No email found");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [id,setId] = useState(0);
    const [createFold,setCreateFold] = useState(false);
    const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "light"
);

useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}, [theme]);

const toggleTheme = () => {
  setTheme((prev) => (prev === "light" ? "dark" : "light"));
};
    const handleLogout=()=>{
        setEmail("No email found");

        localStorage.clear();
        sessionStorage.clear();

        navigate('/',{replace : true});
    }
    const upload = new Upload({ apiKey: "public_W23MTKdBuuqa5Py4Aga1ipCkyJ5P"});

    useEffect(()=>{
        if(email!=="No email found"){
            axios.get(`https://dummybackend-2cs8.onrender.com/user/get/id/${encodeURIComponent(email)}`)
            .then((response)=>{
                setId(response.data);
            })
            .catch((error)=>{
                console.log(error)
            });
        }
    },[email]);

    const fileUpload= async (event)=>{
        const file = event.target.files[0];
        if(!file) return;
        if(!file.type){
            return;
        }

        const name = file.name;
        const fileType = file.type;
        const size = file.size;
        const isArchived = 0;

        try{
           
            const {fileUrl} = await upload.uploadFile(file,{
                onProgress: ({bytesSent,bytesTotal}) =>{
                    console.log(`Progress: ${(bytesSent / bytesTotal * 100).toFixed(2)}%`);
                     const percent = (bytesSent / bytesTotal) * 100;
                     setUploadProgress(percent.toFixed(2));
                }
            });
            const path = fileUrl;

            const doc = {
                name,
                fileType,
                size,
                isArchived,
                path
            }
   axios.post(`https://dummybackend-2cs8.onrender.com/doc/${encodeURIComponent(id)}/add`,doc,{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            .then((response)=>{
                console.log("Document added successfully")
                setRefresh((p)=>{
                    const d = !p;
                    console.log(d);
                    return d;
                });
                setUploadProgress(0);
            })
            .catch((error)=>{
                console.log(error)
            });

            console.log("Uploaded file URL:",fileUrl);
        }catch(e){
            console.error("Upload error",e);
        }
    }

    return(
        <div className="home-container">
            {/* Header Section */}
            <header className="home-header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo-section">
                            <h1 className="logo-title">Digital Locker</h1>
                            <p className="logo-subtitle">Secure Document Storage</p>
                        </div>
                        
                        <nav className="auth-nav">
                            {email === "No email found" ? (
                                <div className="auth-buttons">
                                    <button className="btn btn-secondary" onClick={() => navigate('/login')}>
                                        Login
                                    </button>
                                    <button className="btn btn-primary" onClick={() => navigate('/sign')}>
                                        Sign Up
                                    </button>
                                </div>
                            ) : (
                                 <div className="user-section">
                                    <div className="user-info">
                                        <span className="user-email">{email}</span>
                                        <span className="user-status">Online</span>
                                    </div>
                                    <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="home-main">
                <div className="container">
                    {email === "No email found" ? (
                        <div className="landing-section">
                            <div className="hero-content">
                                <h2 className="hero-title">Your Documents, Securely Stored</h2>
                                <p className="hero-description">
                                    Store, organize, and access your important documents from anywhere. 
                                    Enterprise-grade security meets simple, intuitive design.
                                </p>
                                <div className="hero-features">
                                    <div className="feature-item">
                                        <span className="feature-icon">🔒</span>
                                        <span>Bank-level Security</span>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-icon">📁</span>
                                        <span>Smart Organization</span>
                                    </div>
                                    <div className="feature-item">
                                        <span className="feature-icon">☁️</span>
                                        <span>Cloud Access</span>
                                    </div>
                                </div>
                                                              <button className="btn btn-primary btn-lg hero-cta" onClick={() => navigate('/sign')}>
                                    Get Started Free
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="dashboard-section">
                            {/* Upload Section */}
                            <section className="upload-section">
                                <div className="card">
                                    <div className="card-body">
                                        <h3 className="heading-3">Upload Documents</h3>
                                        <p className="text-muted">Drag and drop or click to select files</p>
                                        
                                        <div className="upload-area">
                                            <input 
                                                className="upload-input" 
                                                onChange={fileUpload} 
                                                accept="*/*" 
                                                type="file"
                                                id="file-upload"
                                            />
                                            <label htmlFor="file-upload" className="upload-label">
                                                <div className="upload-icon">📁</div>
                                                <span className="upload-text">Choose File</span>
                                            </label>
                                        </div>
                                       {uploadProgress > 0 && uploadProgress < 100 && (
                                            <div className="progress-container">
                                                <div className="progress-bar" style={{ width: `${uploadProgress}%` }}>
                                                    <span className="progress-text">{uploadProgress}%</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Folder Management */}
                            <section className="folder-management">
                                {createFold ? (
                                    <CreateFolder onclose={() => setCreateFold(false)} id={id} onCreate={()=> setRefresh((p)=> !p)}/>
                                ) : (
                                    <div className="create-folder-section">
                                        <button className="btn btn-secondary" onClick={() => setCreateFold(true)}>
                                            + Create Folder
                                        </button>
                                    </div>
                                )}
                            </section>

                            {/* Content Grid */}
                            <section className="content-grid">
                                <div className="folders-section">
                                    <h3 className="section-title">Folders</h3>
                                    <Folder refresh={refresh}onMove={() => setRefresh((p) => !p)} id={id}/>
                                </div>
                                
                                <div className="documents-section">
                                    <h3 className="section-title">Recent Documents</h3>
                                    <Document id={id} refresh={refresh}/>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}