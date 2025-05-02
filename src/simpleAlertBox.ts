export function zeigeModal(nachricht) {
    return new Promise((resolve) => {
      // Erstelle dein Modal-Element dynamisch oder verwende ein bereits existierendes
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; border: 1px solid black; padding: 20px;">
          <p>${nachricht}</p>
          <button id="okBtn">OK</button>
          <button id="cancelBtn">Abbrechen</button>
        </div>
      `;
      document.body.appendChild(modal);
  
      const okButton = modal.querySelector('#okBtn');
      const cancelButton = modal.querySelector('#cancelBtn');
  
      if (okButton) okButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        resolve(true); // Benutzer hat "OK" geklickt
      });
  
      if (cancelButton) cancelButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        resolve(false); // Benutzer hat "Abbrechen" geklickt
      });
    });
  }
  
  export async function testFunktion() {
    const antwort = await zeigeModal("Möchten Sie fortfahren?");
  
    if (antwort) {
      console.log("Benutzer hat 'OK' geklickt. Fortfahren...");
      return true;
      // Hier die Logik ausführen, wenn der Benutzer bestätigt hat
    } else {
      console.log("Benutzer hat 'Abbrechen' geklickt.");
      return false;
      // Hier die Logik ausführen, wenn der Benutzer abgelehnt hat
    }
  
    console.log("Diese Zeile wird erst nach der Modal-Interaktion ausgeführt.");
  }