# NoteApp

## Descripción
Es una pequeña práctica para el desarrollo de API's REST con Go.

Consiste en un servidor a modo de API REST que recive peticiones a distintos endpoints
para crear, obtener, actualizar o borrar notas.

Adicionalmente, tambien sirve una pequeña aplicación web SPA que consume el API en la ruta: "/notes".

## Enpoints

~~~
Todos deben contener la cebecera "Content-Type":"application/json".
~~~
~~~
Todas las respuesta tiene este formato:
`
{
  status: int,
  success: bool,
  message: string,
  data_type: string,
  data: object || array || null
}
`
* status: entero indicando el codigo HTTP correspondiente.
* success: booleano indicando si la petición se realizó correctamente.
* message: string con un mensaje del servidor.
* data_type: string indicando el tipo de dato del campo "data".
* data: los datos devueltos.
~~~
Ahora, los enpoints son: 

* Crear
    * path: /api/notes
    * method: POST
    * body:
        * title: string
        * description: string
    * response:
        * En "data_type": "object"
        * En "data":
            * id: int
            * title: string
            * description: string
            * created_at: string
* Obtener
    * path: /api/notes
    * method: GET
    * body: null
    * response:
        * En "data_type": "array" || "null"
        * En "data", nulo o array con objetos: 
            * id: int
            * title: string
            * description: string
            * created_at: string
* Actualizar
    * path: /api/notes/{id}
    * method: PUT
    * body:
        * title: string
        * description: string
    * response:
        * En "data_type": "object"
        * En "data": 
            * id: int
            * title: string
            * description: string
            * created_at: string
* Borrar
    * path: /api/notes/{id}
    * method: DELETE
    * body: null
    * response:
        * En "data_type": "null"
        * En "data": null
~~~