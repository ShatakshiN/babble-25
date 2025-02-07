function previewImage(event) {
            const preview = document.getElementById('profilePicPreview');
            preview.src = URL.createObjectURL(event.target.files[0]);
}