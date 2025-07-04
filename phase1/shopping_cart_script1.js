function updateLocation(category) {
    const locationElement = document.getElementById('location');
    locationElement.textContent = `home > ${category}`;
}