import { bernini } from './bernini.js';

const apiKey = 'yourAPIKeyHere';

let currentHotspotId = null;
let currentTextContainer = null; 

// LOAD BERNINI
loadModel('yourEntryIdHere',  'scene');

// INIT HOTSPOTS FOR BERNINI
document.addEventListener('DOMContentLoaded', function() {
    createHotspots(bernini);
});

//create single
function createHotspot(data, index) { 
    const hotspot = document.createElement('a-entity');
    
    // Set attributes from data
    hotspot.setAttribute('position', data.position);
    hotspot.setAttribute('scale', data.scale); 
    hotspot.setAttribute('mixin', 'hotspot');
    hotspot.setAttribute('class', 'interactive'); 
    hotspot.setAttribute('data-hotspot-id', index.toString()); 
    
    hotspot.addEventListener('click', function() {
        const hotspotId = this.getAttribute('data-hotspot-id');
        if (currentHotspotId === hotspotId) {
            return;
        }
        closeCurrentHotspot(); 
        createTextContainer(data); 
        currentHotspotId = hotspotId; 
    });
    
    // Append the hotspot to the scene
    document.querySelector('a-scene').appendChild(hotspot);
}

//create set
function createHotspots(hotspotsData) {
    hotspotsData.forEach((hotspotData, index) => {
        createHotspot(hotspotData, index); // Pass index here
    });
}

// CREATE HOTSPOT CONTENT
function createTextContainer(hotspot) {
    var textContainer = document.createElement('div');
    textContainer.className = 'textBackground';

    // ADD "CLOSE" BUTTON + FUNCTIONALITY
    var closeButton = document.createElement('div');
    closeButton.textContent = 'x';
    closeButton.className = 'closeButton';
    closeButton.onclick = closeCurrentHotspot;
    textContainer.appendChild(closeButton);

    // ADD HEADER
    var headerText = document.createElement('div');
    headerText.className = 'headerStyle';
    headerText.textContent = hotspot.headerText;
    textContainer.appendChild(headerText);

    // ADD DATE
    var date = document.createElement('div');
    date.className = 'date';
    date.textContent = hotspot.date;
    textContainer.appendChild(date);

    // ADD BODY
    var bodyText = document.createElement('div');
    bodyText.className = 'bodyStyle';
    bodyText.textContent = hotspot.bodyText;
    textContainer.appendChild(bodyText);

    document.body.appendChild(textContainer);
    currentTextContainer = textContainer; 
}

// CLOSE CURRENT HOTSPOT (both regular & overlap functionality)
  function closeCurrentHotspot() {
      if (currentTextContainer) {
          const textContainerToRemove = currentTextContainer; 
          currentTextContainer.classList.add('fade-out');
          
          setTimeout(() => {

            if (textContainerToRemove && textContainerToRemove === currentTextContainer && textContainerToRemove.parentNode) {
                  textContainerToRemove.parentNode.removeChild(textContainerToRemove);

                  if (currentTextContainer === textContainerToRemove) {
                      currentTextContainer = null;
                      currentHotspotId = null; 
                  }
              }
          }, 1000);
      }
}

// LOAD MODEL BY ENTRYID
function loadModel(entryID, entityID) {
    fetch(`https://api.echo3D.com/query?key=${apiKey}&entry=${entryID}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const firstEntryKey = Object.keys(data.db)[0];
            const storageID = data.db[firstEntryKey].hologram.storageID;
            console.log('Storage ID:', storageID);
            document.querySelector(`#${entityID}`).setAttribute('gltf-model', `https://api.echo3D.com/query?key=${apiKey}&file=${storageID}`);
        })
        .catch(error => console.error('Fetch error:', error));
}
