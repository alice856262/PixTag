// Function to convert the image file to a Base64 string
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Function to upload the image
async function uploadImage() {
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file.');
        return;
    }

    try {
        const base64File = await getBase64(file);
        const imageBase64 = base64File.split(',')[1]; // Remove the Data URL part like "data:image/jpeg;base64,"

        const response = await fetch('https://3jvht8wbdj.execute-api.us-east-1.amazonaws.com/jianhui/image_upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: file.name,
                file: imageBase64,
                user_email:"lingjianhui177@gmail.com"
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Image uploaded successfully! URL: ${result.S3_URL}`); // Adjust property access as needed
        } else {
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

