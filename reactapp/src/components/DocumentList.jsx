import React ,{useEffect,useState} from 'react';
import axios from 'axios';
import '../styles/FileGrid.css'
import '../styles/globals.css'

export const Document=({id,refresh})=>{
    const [documents,setDocument] = useState([]);

    useEffect(()=>{
        if(id){
            axios.get(`http://localhost:8080/doc/get/${encodeURIComponent(id)}`)
            .then((response)=>{
                setDocument(response.data||[]);
                console.log("The document information has been successfully got");
            })
            .catch((error)=>{
                console.log("Error fetching documents",error)
            });
        }
    },[id,refresh]);

    const handleDelete=(docId)=>{
        axios.delete(`http://localhost:8080/doc/del/${encodeURIComponent(docId)}`)
        .then((res)=>{
            console.log(res.data);
            setDocument((p)=>{
             const u = p.filter((doc)=> doc.id!== docId);
             console.log('Updated',u);
             return u;
            });
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('image')) return '🖼️';
        if (fileType.includes('video')) return '🎥';
        if (fileType.includes('audio')) return '🎵';
        if (fileType.includes('text')) return '📝';
        if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
        return '📎';
    };

    return(
        <div className="file-section">
            {documents.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📁</div>
                    <h3 className="empty-title">No documents yet</h3>
                    <p className="empty-description">Upload your first document to get started</p>
                </div>
            ) : (
                <div className='file-grid'>
                    {documents.map((doc)=> (
                        <div
                            key={doc.id}
                            className='file-card'
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData("docId",doc.id)} 
                            onClick={()=> window.open(doc.path,"_blank")}
                        >
                            <div className="file-card-header">
                                <div className="file-icon">
                                    {getFileIcon(doc.fileType)}
                                </div>
                                <button 
                                    className="file-action-btn delete-btn"
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        handleDelete(doc.id);
                                    }}
                                    aria-label="Delete document"
                                >
                                    🗑️
                                </button>
                            </div>
                                                        
                            <div className="file-card-body">
                                <h4 className="file-name" title={doc.name}>
                                    {doc.name.length > 20 ? `${doc.name.substring(0, 20)}...` : doc.name}
                                </h4>
                                <div className="file-meta">
                                    <span className="file-type">{doc.fileType.split('/')[1] || 'Unknown'}</span>
                                    <span className="file-size">{formatFileSize(doc.size)}</span>
                                </div>
                            </div>
                            
                            <div className="file-card-footer">
                                <div className="file-drag-indicator">
                                    <span>Drag to folder</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}