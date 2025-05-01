const documentStorage = {
    files: JSON.parse(localStorage.getItem('files')) || [],
    
    saveFile: function(file) {
        this.files.push(file);
        localStorage.setItem('files', JSON.stringify(this.files));
        this.updateFileGrid();
    },

    getFiles: function() {
        return this.files;
    },

    updateFileGrid: function() {
        const fileGrid = document.getElementById('file-grid');
        fileGrid.innerHTML = '';
        
        this.files.forEach(file => {
            const fileCard = document.createElement('div');
            fileCard.className = 'file-card';
            fileCard.innerHTML = `
                <div class="file-card-content">
                    <h3>${file.name}</h3>
                    <p>${file.category} • ${this.formatFileSize(file.size)}</p>
                    <small>Uploaded: ${new Date(file.uploadDate).toLocaleDateString()}</small>
                </div>
            `;
            fileGrid.appendChild(fileCard);
        });
    },

    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// Initialize file grid
documentStorage.updateFileGrid();

// File upload handling
document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const category = document.querySelector('.category-item.active').dataset.category;
    const statusDiv = document.getElementById('upload-status');

    // Simple validation
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        statusDiv.textContent = 'File too large (max 10MB)';
        return;
    }

    // Create file object
    const fileData = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        category: category,
        uploadDate: Date.now(),
        type: file.type
    };

    // Mock upload delay
    statusDiv.textContent = 'Uploading...';
    setTimeout(() => {
        documentStorage.saveFile(fileData);
        statusDiv.textContent = 'Upload successful!';
        e.target.value = ''; // Clear input
    }, 1500);
});

// Category filtering
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.active').classList.remove('active');
        item.classList.add('active');
        documentStorage.updateFileGrid();
    });
});

// Search functionality
document.querySelector('.search-bar').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredFiles = documentStorage.getFiles().filter(file => 
        file.name.toLowerCase().includes(searchTerm)
    );
    documentStorage.files = filteredFiles;
    documentStorage.updateFileGrid();
});
