(function() {
  const notes_container = document.getElementById("notes-container");
  document.getElementById("new-note").addEventListener("submit", function(e) {
    e.preventDefault();
    let form = new FormData(this);
    let self = this;
    createNote({
      "title": form.get("title"),
      "description": form.get("description")
    })
    .then(function(res) {
      console.log(res);
      if(res.success && res.data_type != "null") {
        self.getElementsByTagName("input")[0].value = "";
        self.getElementsByTagName("textarea")[0].value = "";
        if(!addNoteToList(res.data)) {
          alert("No se podrá actualizar la nota creada hasta recargar la página. Ofresco disculpas por ello.");
        }
        let html = processNotesArray(getNotesStored());
        notes_container.innerHTML = html;
        if(!addUpdateListenersToAllForms(getNotesStored())) {
          alert("Ocurrió un problema al preparar la funcionalidad para actualizar.");
        }
      }
    })
    .catch(function(err) {
      alert("Algo ha salido mal al crear la nota.");
      console.log(err);
    })
  });
  getNotes()
  .then(function(res) {
    console.log(res);
    if(!res.success) {
      alert("Algo no ha salido bien.")
      console.log(res);
      return;
    }
    //add the submit listener to the notes form.
    if(res.success) {
      html = processNotesArray(res.data || []);
      notes_container.innerHTML = html;
      if(!addUpdateListenersToAllForms(res.data || [])) {
        alert("Ocurrió un problema al preparar la funcionalidad para actualizar.");
      } else {
        storeNotes(res.data);
      }
      return;
    }
    alert("Hay un problema al mostrar las notas.");
    console.log(res);
  })
  .catch(function(err) {
    alert("Algo ha salido mal.")
    console.log(err);
  })
})();