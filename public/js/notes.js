//createNote commands to create a new note.
function createNote(note) {
  return new Promise(function(resolve) {
    console.log(note);
    $.ajax({
      "url":"/api/notes",
      "headers": {
        "Content-Type":"application/json"
      },
      "method":"POST",
      "data": JSON.stringify({//Siempre enviar como string el JSON.
        "title":note.title,
        "description":note.description
      })
    })
    .done(function(res) {
      resolve(res)
    })
    .fail(function(res) {
      resolve(genBadResponse(res.responseJSON || res.responseText, "Server Error."))
    })
  });
}

//getNotes sends to get all notes in the server.
function getNotes() {
  return new Promise(function(resolve) {
    $.ajax({
      "url":"/api/notes",
      "headers": {
        "Content-Type":"application/json"
      },
      "method":"GET",
    })
    .done(function(res) {
      resolve(res);
    })
    .fail(function(res) {
      resolve(genBadResponse(res.responseJSON || res.responseText, "Server Error."))
    });
  });
}

//updateNote commands to update a note in the server.
function updateNote(note) {
  return new Promise(function(resolve) {
    console.log(note);
    $.ajax({
      "url":`/api/notes/${note.id}`,
      "headers": {
        "Content-Type":"application/json"
      },
      "method": "PUT",
      "data": JSON.stringify({
        "title": note.title,
        "description": note.description
      })
    })
    .done(function(res) {
      resolve(res);
    })
    .fail(function(res) {
      resolve(genBadResponse(res.responseJSON || res.responseText, "Server Error."))
    });
  });
}

//deleteNote sends to delete a note on server by id.
function deleteNote(id) {
  return new Promise(function(resolve) {
    $.ajax({
      "url":`/api/notes/${id}`,
      "headers": {
        "Content-Type":"application/json"
      },
      "method":"DELETE"
    })
    .done(function(res) {
      resolve(res);
    })
    .fail(function(res) {
      resolve(genBadResponse(res.responseJSON || res.responseText, "Server Error"));
    });
  });
}

//buildNoteCard generate the html structure of a note.
function buildNoteCard(note) {
  return `
    <div class = "jumbotron top-separation" id = "card-${note.id}">
      <form id="form-${note.id}" name="cards-form">
        <div class="form-group">
          <input class="form-control" name="title" placeholder="Título" id="title-${note.id}" value="${note.title}" disabled>
        </div>
        <div class="form-group">
          <textarea class="form-control" name="description" placeholder="Descripción" id="description-${note.id}" disabled>${note.description}</textarea>
        </div>
        <div class="form-group text-right">
          <input type="button" class="btn" value="Habilitar" onclick="enableInputs(${note.id})">  
          <input type="button" class="btn btn-danger" value="Borrar" onclick="commandDeleteNote(${note.id})">
          <input type="submit" class="btn btn-primary" value="Actualizar">
        </div>
      </form>
    </div>
  `;
}

//commandDeleteNote commands delete a note in the server and remove of the DOM.
function commandDeleteNote(id) {
  deleteNote(id)
  .then(function(res) {
    if(res.success) {
      document.getElementById("notes-container").removeChild(document.getElementById("card-"+id));
      //quitar del array de notas.
      if(!removeToNotesList(id)) {
        alert("Ah ocurrido un error al borrar la nota.")
        console.error("El id de la nota no a eliminar no existe, o no hay notas guardadas.");
      }
      return;
    }
    alert("Ocurrió un error al eliminar.");
    console.log(res);
  })
  .catch(function(err) {
    alert("Algo ha salido mal.");
    console.log(err);
  });
}

function enableInputs(id, status) {
  if(status === true || status === false) {
    document.getElementById("title-"+id).disabled = !status;
    document.getElementById("description-"+id).disabled = !status;
    return;
  }
  let title = document.getElementById("title-"+id);
  let = desc = document.getElementById("description-"+id);
  title.disabled = !title.disabled;
  desc.disabled = !desc.disabled;
}

/**processNotesArray generate the html structure by an array of notes.
  *@param res Array<note>
  */
function processNotesArray(res) {
  console.log(res);
  let html = "";
  if(res instanceof Array) {
    if(res.length > 0) {
      for (let note of res) {
        html += buildNoteCard(note);
      }
    } else {
      html = "<h4 class='text-center'>No hay notas por ahora.</h4>";
    }
    return html;
  }
  throw new Error("The argument provided must be an array.");
}

/**
 * addUpdateListener add submit listener to forms of notes cards.
 * @param id int
 */
function addUpdateListener(id) {
  document.getElementById("form-"+id).addEventListener("submit", function(e) {
    e.preventDefault();
    e.stopPropagation();
    let self = this;
    let form = new FormData(this);
    //console.log(form.get("title"), form.get("description"));
    //console.log(this);return;
    updateNote({
      "id": id,
      "title": form.get("title"),
      "description": form.get("description")
    })
    .then(function(res) {
      if(res.success && res.data_type === "object") {
        self.getElementsByTagName("input")[0] = res.data.title;
        self.getElementsByTagName("input")[1] = res.data.description;
        enableInputs(id, false);
        if(!updateNoteList(res.data)) {
          alert("Ocurrió un error al actualizar la nota.")
          console.error("Es posible que la nota no exista o que no se haya pasado un argumento válido.");
        }
        return;
      }
      alert("Algo no ha salido bien...");
      console.log(res);
    })
    .catch(function(err) {
      alert("Algo ha salido mal...");
      console.log(err);
    });
  });
}

//storeNotes store an notes array.
function storeNotes(notes) {
  sessionStorage.setItem("notes", JSON.stringify(notes));
}

//getNotes get the notes array stored.
function getNotesStored() {
  let notes = sessionStorage.getItem("notes");
  if(!notes) {
    return [];
  }
  return JSON.parse(notes);
}

/**
 * addNoteToList add a note json to list of notes stored.
 * @param {Object} note 
 */
function addNoteToList(note) {
  let notes = getNotesStored();
  if(notes && notes instanceof Array) {
    notes.push(note);
  } else {
    notes = [note];
  }
  storeNotes(notes);
  return true;
}

//removeToNotesList do that by id of the note.
function removeToNotesList(note_id) {
  let notes = getNotesStored();
  if(notes && notes instanceof Array) {
    for(let i = 0; i < notes.length; i++) {
      if(notes[i].id == note_id) {
        notes.splice(i, 1);
        storeNotes(notes);
        return true;
      }
    }
  }
  return false;
}

//updateNoteList do that using a note provided.
function updateNoteList(note) {
  let notes = getNotesStored();
  if(notes && notes instanceof Array) {
    for(let i = 0; i < notes.length; i++) {
      if(notes[i].id == note.id) {
        notes[i] = note;
        storeNotes(notes);
        return true;
      }
    }
  }
  return false;
}

/**
 * addUpdateListenersToAllForms do that, using de notes array provided.
 * @param {Array<note>} notes 
 */
function addUpdateListenersToAllForms(notes) {
  if(notes instanceof Array) {
    for(let note of notes) {
      addUpdateListener(note.id)
    }
    return true;
  }
  return false;
}